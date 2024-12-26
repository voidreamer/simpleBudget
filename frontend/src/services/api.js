// src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api';

export const budgetApi = {
  async fetchBudgetData(year, month) {
      try {
        console.log(`Fetching data for ${year}-${month}`); // Debug log
        const response = await fetch(`${API_BASE_URL}/budget-summary/${year}/${month}`);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData); // Debug log
          throw new Error(errorData.detail || 'Failed to fetch budget data');
        }

        const data = await response.json();
        console.log('Raw API response:', data); // Debug log

        // Transform API data to our frontend format
        const transformedData = {};
        if (Array.isArray(data)) {
          data.forEach(category => {
            transformedData[category.name] = {
              budget: category.budget,
              items: category.subcategories.map(sub => ({
                name: sub.name,
                allotted: sub.allotted,
                spending: sub.spending
              }))
            };
          });
        }

        console.log('Transformed data:', transformedData); // Debug log
        return transformedData;
      } catch (error) {
        console.error('Error fetching budget data:', error);
        throw error;
      }
    },


  async createCategory(categoryData) {
    const response = await fetch(`${API_BASE_URL}/categories/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: categoryData.name,
        budget: categoryData.budget
      })
    });
    return response.json();
  },

  async createSubcategory(data) {
    const response = await fetch(`${API_BASE_URL}/subcategories/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        allotted: data.allotted,
        category_id: data.categoryId
      })
    });
    return response.json();
  },

  async createTransaction(data) {
    const response = await fetch(`${API_BASE_URL}/transactions/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: data.description,
        amount: data.amount,
        subcategory_id: data.subcategoryId,
        date: new Date().toISOString()
      })
    });
    return response.json();
  },

  async deleteCategory(categoryId) {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete category');
    }
    return response.json();
  },

  async deleteSubcategory(subcategoryId) {
    const response = await fetch(`${API_BASE_URL}/subcategories/${subcategoryId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete subcategory');
    }
    return response.json();
  },

  async updateSubcategory(subcategoryId, data) {
    const response = await fetch(`${API_BASE_URL}/subcategories/${subcategoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update subcategory');
    }
    return response.json();
  }
};