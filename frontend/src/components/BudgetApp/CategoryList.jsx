import React from 'react';
import { ChevronRight, ChevronDown, Plus, MoreVertical } from 'lucide-react';
import Button from '../ui/button.jsx';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu.jsx';

const CategoryList = ({
  categories,
  expandedCategories,
  toggleCategory,
  openModal,
  handleDeleteCategory,
  handleDeleteSubcategory,
  handleEditSubcategory,
  onAddTransaction
}) => {
  return (
    <div className="w-1/2 bg-white rounded-lg shadow">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="space-y-2">
          {Object.entries(categories).map(([categoryName, categoryData]) => (
            <CategoryItem
              key={categoryName}
              categoryName={categoryName}
              categoryData={categoryData}
              isExpanded={expandedCategories.includes(categoryName)}
              onToggle={() => toggleCategory(categoryName)}
              onAddSubcategory={() => openModal('subcategory', {id:categoryData.id})}
              onDeleteCategory={() => handleDeleteCategory(categoryData.id)}
              onDeleteSubcategory={handleDeleteSubcategory}
              onEditSubcategory={handleEditSubcategory}
              onAddTransaction={onAddTransaction}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryItem = ({
  categoryName,
  categoryData,
  isExpanded,
  onToggle,
  onAddSubcategory,
  onDeleteCategory,
  onDeleteSubcategory,
  onEditSubcategory,
  onAddTransaction
}) => {
  return (
    <div className="rounded-lg border border-gray-200">
      <div className="p-3 hover:bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={onToggle}>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 mr-2" />
            ) : (
              <ChevronRight className="w-5 h-5 mr-2" />
            )}
            <span className="font-medium">{categoryName}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">Budget: ${categoryData.budget}</span>
            <CategoryActions
              onAddSubcategory={() => onAddSubcategory(categoryData.id)}
              onDeleteCategory={() => onDeleteCategory(categoryData.id)}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <SubcategoryList
          items={categoryData.items}
          categoryName={categoryName}
          onDeleteSubcategory={onDeleteSubcategory}
          onEditSubcategory={onEditSubcategory}
          onAddTransaction={onAddTransaction}
        />
      )}
    </div>
  );
};

const CategoryActions = ({ onAddSubcategory, onDeleteCategory, categoryId }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onAddSubcategory(categoryId)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Subcategory
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            console.log('Delete clicked', onDeleteCategory); // Debug
            onDeleteCategory();
          }}
          className="text-red-600"
        >
          Delete Category
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SubcategoryList = ({ items, categoryName, onDeleteSubcategory, onEditSubcategory, onAddTransaction }) => (
  <div className="border-t border-gray-200">
    {items.map((item) => (
      <SubcategoryItem
        key={item.name}
        item={item}
        categoryName={categoryName}
        onDeleteSubcategory={onDeleteSubcategory}
        onEditSubcategory={onEditSubcategory}
        onAddTransaction={onAddTransaction}
      />
    ))}
  </div>
);

const SubcategoryItem = ({ item, categoryId, onDeleteSubcategory, onEditSubcategory, onAddTransaction}) => (
  <div className="p-3 pl-10 hover:bg-gray-50 flex justify-between items-center">
    <span>{item.name}</span>
    <div className="flex items-center gap-4">
      <span className="text-blue-600">${item.allotted}</span>
      <span className={item.spending > item.allotted ? 'text-red-600' : 'text-green-600'}>
        ${item.spending}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <Button onClick={() => onAddTransaction(item)}>
              Add Transaction
            </Button>
          <DropdownMenuItem onClick={() => onEditSubcategory({id: item.id, allotted: item.allotted, spending:item.spending})}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDeleteSubcategory(item.id)}
            className="text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);

export default CategoryList;