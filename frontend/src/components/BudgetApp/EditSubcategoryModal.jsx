import React, { useState } from 'react';
import Dialog, { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import Button from '../ui/button.jsx';
import Input from '../ui/input.jsx';

const EditSubcategoryModal = ({ isOpen, onClose, subcategory, onSubmit }) => {
  const [allotted, setAllotted] = useState(subcategory?.allotted || 0);
  const [spending, setSpending] = useState(subcategory?.spending || 0);

  const handleSubmit = () => {
    onSubmit({
        id: subcategory.id,
        allotted: parseFloat(allotted),
        spending: parseFloat(spending)
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {subcategory?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Allotted Amount</label>
            <Input
              type="number"
              value={allotted}
              onChange={(e) => setAllotted(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Spending</label>
            <Input
              type="number"
              value={spending}
              onChange={(e) => setSpending(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubcategoryModal;
