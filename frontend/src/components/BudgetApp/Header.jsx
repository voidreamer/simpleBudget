import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../ui/button.jsx';

const Header = ({ selectedDate, setSelectedDate, openModal }) => {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Budget Tracker</h1>
          <div className="flex items-center gap-4">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option>October 2024</option>
              <option>November 2024</option>
              <option>December 2024</option>
            </select>
            <Button onClick={() => openModal('category')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;