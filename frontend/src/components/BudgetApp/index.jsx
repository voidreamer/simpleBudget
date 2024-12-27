import React, { useState, useEffect } from 'react';
import Header from './Header';
import CategoryList from './CategoryList';
import ChartSection from './ChartSection';
import Footer from './Footer';
import CategoryModal from './CategoryModal';
import EditSubcategoryModal from './EditSubcategoryModal';
import TransactionModal from './TransactionModal';
import { budgetApi } from '../../services/api';

const BudgetApp = () => {
  const [selectedDate, setSelectedDate] = useState('November 2024');
  const [expandedCategories, setExpandedCategories] = useState(['Fixed Expenses']);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [modalType, setModalType] = useState('category');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [addingTransactionTo, setAddingTransactionTo] = useState(null);
  const [categories, setCategories] = useState({
    'Fixed Expenses': {
      budget: 1000,
      items: [
        { name: 'Rent', allotted: 800, spending: 800 },
        { name: 'Utilities', allotted: 200, spending: 180 },
      ]
    },
    'Necessities': {
      budget: 2500,
      items: [
        { name: 'Groceries', allotted: 600, spending: 545 },
        { name: 'Transport', allotted: 200, spending: 180 },
      ]
    }
  });

  // Business logic functions
  const toggleCategory = (category) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const openModal = (type, category = null) => {
    console.log('Opening modal:', type, category); // Debug
    setModalType(type);
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleAddCategory = async (data) => {
      try {
        const response = await budgetApi.createCategory(data);
        console.log('New category:', response); // Check if ID is returned
        await loadBudgetData(selectedDate.split(' ')[1], selectedDate.split(' ')[0]);
      } catch (error) {
        console.error('Error adding category:', error);
      }
    };

  const handleDeleteCategory = async (categoryId) => {
    console.log('handleDeleteCategory called with ID:', categoryId);
    if (!categoryId) {
        console.error('No category ID provided');
        return;
    }
    try {
        await budgetApi.deleteCategory(categoryId);
            const [month, year] = selectedDate.split(' ');
            await loadBudgetData(year, month);
        } catch (error) {
        console.error('Error deleting category:', error);
    }
    };

    const handleAddSubcategory = async (data) => {
        console.log('handleAddSubcategory :', selectedCategory?.id);
        if (!selectedCategory?.id) return;
        try {
            const subcategoryData = {
                name: data.name,
                allotted: data.allotted,
                category_id: selectedCategory.id
            };
            await budgetApi.createSubcategory(subcategoryData);
            const [month, year] = selectedDate.split(' ');
            await loadBudgetData(year, month);
        } catch (error) {
            console.error('Error adding subcategory:', error);
        }
      };

    const handleEditSubcategory = async (data) => {
        console.log('Editing subcategory:', data); // Debug
        if (!data?.id) return;
        try {
            await budgetApi.updateSubcategory(data.id, {
                allotted: parseFloat(data.allotted),
                spending: parseFloat(data.spending)
            });
            const [month, year] = selectedDate.split(' ');
            await loadBudgetData(year, month);
        } catch (error) {
            console.error('Error updating subcategory:', error);
        }
    };

    const handleDeleteSubcategory = async (subcategoryId) => {
      if (!subcategoryId) return;
      try {
        await budgetApi.deleteSubcategory(subcategoryId);
        const [month, year] = selectedDate.split(' ');
        await loadBudgetData(year, month);
      } catch (error) {
        console.error('Error deleting subcategory:', error);
      }
    };

    const handleAddTransaction = async (data) => {
        console.log('Transaction data:', data);
      try {
        await budgetApi.createTransaction(data);
        const [month, year] = selectedDate.split(' ');
        await loadBudgetData(year, month);
        setAddingTransactionTo(null);
      } catch (error) {
        console.error('Error adding transaction:', error);
      }
    };

  const loadBudgetData = async (year, month) => {
      try {
        console.log(`Loading budget data for ${year} ${month}`);
        const data = await budgetApi.fetchBudgetData(year, month);
        console.log('Budget data:', data);
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error loading budget data:', error);
      }
  };

  // Transform data for chart
  const chartData = Object.entries(categories).map(([name, data]) => ({
    name,
    Budget: data.budget,
    Allotted: data.items.reduce((sum, item) => sum + item.allotted, 0),
    Spending: data.items.reduce((sum, item) => sum + item.spending, 0),
  }));

    useEffect(() => {
      const [month, year] = selectedDate.split(' ');
      loadBudgetData(year, month);
    }, [selectedDate]);

  return (
    <div className="flex flex-col h-screen">
      <Header
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        openModal={openModal}
      />
      <main className="flex-1 flex p-6 gap-6">
        <CategoryList
          categories={categories}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
          openModal={openModal}
          handleDeleteCategory={handleDeleteCategory}
          handleDeleteSubcategory={handleDeleteSubcategory}
          handleEditSubcategory={setEditingSubcategory}
          onAddTransaction={setAddingTransactionTo}
        />
        <ChartSection chartData={chartData} />
      </main>
      <Footer categories={categories} />
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        type={modalType}
        selectedCategory={selectedCategory}
        onSubmit={modalType === 'category' ? handleAddCategory : handleAddSubcategory}
      />
      <EditSubcategoryModal
        isOpen={!!editingSubcategory}
        onClose={() => setEditingSubcategory(null)}
        subcategory={editingSubcategory}
        onSubmit={handleEditSubcategory}
      />
      <TransactionModal
          isOpen={!!addingTransactionTo}
          onClose={() => setAddingTransactionTo(null)}
          subcategory={addingTransactionTo}
          onSubmit={handleAddTransaction}
        />
    </div>
  );
};

export default BudgetApp;