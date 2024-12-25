import React, { useState } from 'react';
import Dialog, { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import Button from '../ui/button.jsx';
import Input from '../ui/input.jsx';

const CategoryModal = ({ isOpen, onClose, type, selectedCategory, onSubmit }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    onSubmit({
      name,
      [type === 'category' ? 'budget' : 'allotted']: parseFloat(amount)
    });
    onClose();
    setName('');
    setAmount('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'category' ? 'Add Category' : 'Add Subcategory'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            placeholder="Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input 
            type="number" 
            placeholder={type === 'category' ? 'Total Budget' : 'Allotted Amount'}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;