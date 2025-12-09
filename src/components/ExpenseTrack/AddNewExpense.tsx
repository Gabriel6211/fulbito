import { useState } from "react";
import Modal from "../Basic/Modal";

export default function AddNewExpense({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Agregar gasto", newExpenseData);
  };

  const [newExpenseData, setNewExpenseData] = useState({
    amount: 0,
    description: "",
    category: "",
  });

  return (
    <div className={className}>
      <button
        onClick={handleOpen}
        className="bg-[var(--primary)] text-[var(--bg)] px-4 py-2 rounded-md cursor-pointer hover:bg-[var(--primary-hover)]"
      >
        Agregar gasto 💰
      </button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <p>Agrega un nuevo gasto</p>
        <form>
          <div>
            <label htmlFor="amount">Cantidad</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={newExpenseData.amount}
              onChange={(e) =>
                setNewExpenseData({ ...newExpenseData, amount: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label htmlFor="description">Descripción</label>
            <input
              type="text"
              id="description"
              name="description"
              value={newExpenseData.description}
              onChange={(e) =>
                setNewExpenseData({ ...newExpenseData, description: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="category">Categoría</label>
            <input
              type="text"
              id="category"
              name="category"
              value={newExpenseData.category}
              onChange={(e) => setNewExpenseData({ ...newExpenseData, category: e.target.value })}
            />
          </div>
          <div>
            <button type="submit" onClick={handleAddExpense}>
              Agregar gasto
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
