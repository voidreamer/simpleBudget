import React from 'react';

const Footer = ({ categories }) => {
  const totalBudget = Object.values(categories).reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = Object.values(categories).reduce((sum, cat) =>
    sum + cat.items.reduce((itemSum, item) => itemSum + item.spending, 0), 0);
  const remaining = totalBudget - totalSpent;

  return (
    <footer className="bg-white shadow">
      <div className="mx-auto px-4 py-3">
        <div className="text-center text-sm text-gray-500">
          Total Budget: <b>${totalBudget}</b> • Spent: ${totalSpent} • Remaining: ${remaining}
        </div>
      </div>
    </footer>
  );
};

export default Footer;