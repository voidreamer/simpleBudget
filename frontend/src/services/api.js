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
              id: category.id,
              budget: category.budget,
              items: category.subcategories.map(sub => ({
                id: sub.id,
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


  async createCategory(data) {
    const response = await fetch(`${API_BASE_URL}/categories/?month=${data.month}&year=${data.year}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        budget: data.budget
      })
    });
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    return response.json();
  },

  async createSubcategory(data) {
    console.log('Creating subcategory:', data);
    const response = await fetch(`${API_BASE_URL}/subcategories/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log('Create subcategory response:', result);
    return result;
  },

  async createTransaction(data) {
    console.log('Creating transaction with:', data); // Debug
    const response = await fetch(`${API_BASE_URL}/transactions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            description: data.description,
            amount: data.amount,
            subcategory_id: data.subcategory_id // Ensure this is included
        })
    });
    return response.json();
  },

  async deleteCategory(categoryId) {
    console.log('aaa Deleting category:', categoryId);
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete category');
    }
    return response.json();
  },

  async deleteSubcategory(subcategoryId) {
    const response = await fetch(`${API_BASE_URL}/subcategories/${subcategoryId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete subcategory');
    }
    return response.json();
  },

  async updateSubcategory(id, data) {
    console.log('Updating subcategory:', id, data);
    const response = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log('Update subcategory response:', result);
    return result;
 }
};