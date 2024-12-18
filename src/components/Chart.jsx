import React, { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Chart = ({ transactions, selectedMonth }) => {
  const [isBoxVisible, setIsBoxVisible] = useState(true);
  const boxRef = useRef(null);
  const initialPosition = useRef({ x: 0, y: 0 });

  const getPriceRangeData = () => {
    const ranges = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const priceRangeData = ranges.map((range, index) => {
      const count = transactions.filter((transaction) => {
        const transactionMonth = new Date(transaction.dateOfSale).getMonth() + 1;
        const price = transaction.price;
        return (
          transactionMonth === selectedMonth &&
          price >= range &&
          (index === ranges.length - 1 || price < ranges[index + 1])
        );
      }).length;
      return { range: `${range}-${ranges[index + 1] || "1000+"}`, count };
    });

    return priceRangeData;
  };

  const data = getPriceRangeData();

  const getSalesStats = () => {
    // Filter only sold items
    const soldTransactions = transactions.filter((transaction) => {
      const transactionMonth = new Date(transaction.dateOfSale).getMonth() + 1;
      return transactionMonth === selectedMonth && transaction.sold;
    });

    // Calculate total sale (sum of the price of sold items)
    const totalSale = soldTransactions.reduce((sum, transaction) => sum + transaction.price, 0);

    // Calculate the total sold and not sold items
    const totalSold = soldTransactions.length;
    const totalNotSold = transactions.filter((transaction) => {
      const transactionMonth = new Date(transaction.dateOfSale).getMonth() + 1;
      return transactionMonth === selectedMonth && !transaction.sold;
    }).length;

    return { totalSale, totalSold, totalNotSold };
  };

  const { totalSale, totalSold, totalNotSold } = getSalesStats();

  const handleDrag = (e) => {
    const box = boxRef.current;
    const offsetX = e.clientX - initialPosition.current.x;
    const offsetY = e.clientY - initialPosition.current.y;
    box.style.position = 'absolute';
    box.style.left = `${box.offsetLeft + offsetX}px`;
    box.style.top = `${box.offsetTop + offsetY}px`;

    initialPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleDragEnd = () => {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  const handleDragStart = (e) => {
    initialPosition.current = { x: e.clientX, y: e.clientY };
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
  };

  return (
    <div className="relative">
      {isBoxVisible && (
        <div
          ref={boxRef}
          className="absolute top-10 right-0 p-4 bg-gray-900 text-white rounded-lg shadow-lg w-64 cursor-pointer z-10"
          onMouseDown={handleDragStart}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Sales Stats</h3>
            <button
              className="text-gray-500 hover:text-white"
              onClick={() => setIsBoxVisible(false)}
            >
              X
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Sale:</span>
              <span>${totalSale.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Items Sold:</span>
              <span>{totalSold}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Items Not Sold:</span>
              <span>{totalNotSold}</span>
            </div>
          </div>
        </div>
      )}

      <div className="chart-container max-w-7xl mx-auto bg-transparent border rounded-md">
        <h2 className="text-gray-300 font-normal text-xl mb-4">
          Bar Chart Stats - {selectedMonth ? `Month ${selectedMonth}` : "Select a month"}
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="range" tick={{ fill: '#ffffff' }} />
            <YAxis allowDecimals={false} tick={{ fill: '#ffffff' }} />
            <Legend />
            <Bar dataKey="count" fill="#7FDBDA" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
