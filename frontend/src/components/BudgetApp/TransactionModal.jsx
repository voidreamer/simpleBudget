import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import Button from '../ui/button.jsx';
import Input from '../ui/input.jsx';

const TransactionModal = ({ isOpen, onClose, subcategory, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

    const handleSubmit = () => {
      onSubmit({
        amount: parseFloat(amount),
        description,
        subcategory_id: subcategory.id,
        date: new Date().toISOString()
      });
      onClose();
    };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>Add Transaction</DialogHeader>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <Button onClick={() => onSubmit({
          amount: parseFloat(amount),
          description,
          subcategory_id: subcategory.id
        })}>Add</Button>
      </DialogContent>
    </Dialog>
  );
};
export default TransactionModal;
