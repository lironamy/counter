// pages/index.js
"use client";

import { useState } from 'react';
import { products as initialProducts } from '@/data/products';

export default function Home() {
  // Initialize state with product list
  const [products, setProducts] = useState(initialProducts);
  
  // Modal state for adding a new product
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIsMarlboro, setNewIsMarlboro] = useState(false);

  // Update product count
  const updateCount = (index, delta) => {
    setProducts(prev =>
      prev.map((product, i) =>
        i === index
          ? { ...product, count: Math.max(0, product.count + delta) }
          : product
      )
    );
  };

  // Add a new product from modal form
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newName.trim() !== "") {
      const newProduct = {
        name: newName.trim(),
        count: 0,
        isMarlboro: newIsMarlboro,
      };
      setProducts(prev => [...prev, newProduct]);
      // Reset modal fields and close modal
      setNewName('');
      setNewIsMarlboro(false);
      setShowModal(false);
    }
  };

  // Calculate sums and price
  const totalCount = products.reduce((sum, p) => sum + p.count, 0);
  const marloboroCount = products.filter(p => p.isMarlboro).reduce((sum, p) => sum + p.count, 0);
  const otherCount = totalCount - marloboroCount;

  // Price calculation
  const price = marloboroCount * 300 + otherCount * 250;

  // Calculate number of packets
  const amountSum = products.reduce((sum, product) => sum + product.count, 0);

  
  // Define the copyText function
  const copyText = () => {
    const summaryText = [
      `היי,`,
      ` יש לי בשבילך ${amountSum} פאקטים-`,
      ...products
        .filter(p => p.count > 0)
        .map(p => `${p.name}: ${p.count}`),
      ``,
      `סך הכל זה יצא ${price.toLocaleString('he-IL')} ש"ח`
    ].join('\n');
  
    navigator.clipboard.writeText(summaryText)
      .then(() => alert('הטקסט הועתק ללוח'))
      .catch((err) => {
        console.error('Error copying text: ', err);
        alert('שגיאה בהעתקת הטקסט');
      });
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans" dir="rtl">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-center text-zinc-800">מונה סיגריות</h1>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none"
            aria-label="Add new product"
          >
            +
          </button>
        </div>
        
        <ul className="space-y-4 text-zinc-800">
          {products.map((product, index) => (
            <li key={index} className="flex items-center justify-between">
              <div>
                <span className="block text-lg">{product.name}</span>
                <span className="text-sm text-gray-500">כמות: {product.count}</span>
              </div>
              <div className="flex items-center space-x-2 gap-3">
                <button 
                  onClick={() => updateCount(index, 1)} 
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 focus:outline-none"
                  aria-label={`Increase count for ${product.name}`}
                >
                  +
                </button>
                <button 
                  onClick={() => updateCount(index, -1)} 
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none"
                  aria-label={`Decrease count for ${product.name}`}
                >
                  -
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t pt-6 text-zinc-800">
          <button
            onClick={copyText}
            className="flex flex-row items-center bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 focus:outline-none"
          >
            copy
          </button>
          <p className="text-lg font-semibold">היי,</p>
          <p className="mt-2 text-md">יש לי בשבילך {amountSum} פאקטים-</p>

          {/* Display product counts for summary */}
          <ul className="mt-4 space-y-2">
            {products
              .filter(p => p.count > 0)
              .map((p, i) => (
                <li key={i} className="flex justify-between">
                  <span>{p.name}</span>
                  <span>{p.count}</span>
                </li>
              ))}
          </ul>

          <p className="mt-4 text-xl font-bold">סך הכל זה יצא {price.toLocaleString('he-IL')} ש"ח</p>
        </div>
      </div>

      {/* Modal for adding new product */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" dir="rtl">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-xl font-semibold mb-4 text-center">הוסף מוצר חדש</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">שם המוצר:</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={newIsMarlboro}
                  onChange={(e) => setNewIsMarlboro(e.target.checked)}
                  id="isMarlboro"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="isMarlboro" className="text-sm text-gray-700">האם זה מלבורו?</label>
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none"
                >
                  ביטול
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
                >
                  הוסף
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
