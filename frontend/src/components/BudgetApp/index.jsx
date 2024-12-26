import React, { useState, useEffect } from 'react';
import Header from './Header';
import CategoryList from './CategoryList';
import ChartSection from './ChartSection';
import Footer from './Footer';
import CategoryModal from './CategoryModal';
import EditSubcategoryModal from './EditSubcategoryModal';
import { budgetApi } from '../../services/api';

const BudgetApp = () => {
  const [selectedDate, setSelectedDate] = useState('November 2024');
  const [expandedCategories, setExpandedCategories] = useState(['Fixed Expenses']);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [modalType, setModalType] = useState('category');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
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
    setModalType(type);
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleAddCategory = async (data) => {
    try {
      const response = await budgetApi.createCategory(data);
      await loadBudgetData(selectedDate.split(' ')[1], selectedDate.split(' ')[0]);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };
  const handleEditSubcategory = async (data) => {
    if (!editingSubcategory) return;

    try {
      await budgetApi.updateSubcategory(editingSubcategory.id, data);
      setEditingSubcategory(null);
      // Reload data
      const [month, year] = selectedDate.split(' ');
      await loadBudgetData(year, month);
    } catch (error) {
      console.error('Error updating subcategory:', error);
    }
  };

  /*
  const handleAddCategory = (data) => {
    setCategories(prev => ({
      ...prev,
      [data.name]: { budget: data.budget, items: [] }
    }));
  };
  */
  const handleAddSubcategory = (data) => {
    if (!selectedCategory) return;
    setCategories(prev => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory],
        items: [...prev[selectedCategory].items, { name: data.name, allotted: data.allotted, spending: 0 }]
      }
    }));
  };

  const handleDeleteCategory = (categoryName) => {
    setCategories(prev => {
      const newCategories = { ...prev };
      delete newCategories[categoryName];
      return newCategories;
    });
  };

  const handleDeleteSubcategory = (categoryName, subcategoryName) => {
    setCategories(prev => ({
      ...prev,
      [categoryName]: {
        ...prev[categoryName],
        items: prev[categoryName].items.filter(item => item.name !== subcategoryName)
      }
    }));
  };

  // Transform data for chart
  const chartData = Object.entries(categories).map(([name, data]) => ({
    name,
    Budget: data.budget,
    Allotted: data.items.reduce((sum, item) => sum + item.allotted, 0),
    Spending: data.items.reduce((sum, item) => sum + item.spending, 0),
  }));

    const loadBudgetData = async (year, month) => {
      try {
        console.log(`Loading budget data for ${year} ${month}`);
        const data = await budgetApi.fetchBudgetData(year, month);
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error loading budget data:', error);
        // Add user feedback here if needed
      }
    };

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
    </div>
  );
};

export default BudgetApp;