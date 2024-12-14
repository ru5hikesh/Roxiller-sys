import React, { useState } from "react";
import "./App.css";
import TransactionDashboard from "./components/TransactionDashboard";
import Chart from "./components/Chart";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-black p-8">
      <TransactionDashboard
        transactions={transactions}
        setTransactions={setTransactions}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
      <div className="mt-8">
        <Chart transactions={transactions} selectedMonth={selectedMonth} />
      </div>
    </div>
  );
}

export default App;