// Updated TransactionDashboard with hover effect on image
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { motion } from "framer-motion";

// Custom Button Component
const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseStyle = "px-4 py-2 rounded-md font-medium transition-colors duration-200 ease-in-out";
  const variants = {
    primary: "bg-purple-500 text-white hover:bg-purple-600",
    outline: "border border-gray-600 text-gray-300 hover:bg-gray-700",
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Custom Input Component
const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
    {...props}
  />
);

// Custom Badge Component
const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-700 text-gray-300",
    success: "bg-green-600 text-white",
    danger: "bg-red-600 text-white",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const TransactionDashboard = ({ transactions, setTransactions, selectedMonth, setSelectedMonth }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://thingproxy.freeboard.io/fetch/https://s3.amazonaws.com/roxiler.com/product_transaction.json`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to fetch transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [setTransactions]);

  const filteredTransactions = transactions.filter((transaction) => {
    const query = searchQuery.toLowerCase();
    const transactionDate = new Date(transaction.dateOfSale);
    const transactionMonth = transactionDate.getMonth() + 1;

    const matchesSearch =
      transaction.title.toLowerCase().includes(query) ||
      transaction.description.toLowerCase().includes(query) ||
      transaction.price.toString().includes(query);

    const matchesMonth = selectedMonth ? transactionMonth === parseInt(selectedMonth) : true;

    return matchesSearch && matchesMonth;
  });

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="min-h-screen">
      <motion.div initial="hidden" animate="visible" className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Transaction Dashboard</h1>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mx-auto rounded-full" />
        </motion.div>

        <motion.div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search transaction"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <Button
              variant="outline"
              className="w-40"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              {selectedMonth ? months[selectedMonth - 1] : "Select Month"}
            </Button>
            {isDropdownOpen && (
              <div className="absolute top-full mt-2 bg-gray-800 rounded-md shadow-lg z-10">
                <div className="flex flex-col">
                  {months.map((month, index) => (
                    <Button
                      key={month}
                      variant="outline"
                      onClick={() => {
                        setSelectedMonth(index + 1);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left"
                    >
                      {month}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <motion.div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    {["Image", "ID", "Title", "Description", "Price", "Category", "Sold"].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-300"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-300">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-16 h-16 object-cover rounded-md transition-transform transform hover:scale-125 hover:shadow-lg"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{item.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-white">
                          {item.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">$ {item.price}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          <Badge>{item.category}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          <Badge
                            variant={item.sold ? "success" : "danger"}
                          >
                            {item.sold ? "Sold" : "Not Sold"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center text-gray-500 py-4"
                      >
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-700 px-4 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-300">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
              <div className="text-sm text-gray-300">
                Showing {itemsPerPage} items per page
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TransactionDashboard;
