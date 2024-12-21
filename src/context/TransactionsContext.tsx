import React, { createContext, useContext, useState } from 'react';

const TransactionsContext = createContext(null);

// export const TransactionsProvider = ({ children }) => {
//   const [products, setProducts] = useState([]);
//   // Add other state and methods.

//   return (
//     <TransactionsContext.Provider value={{ products, setProducts }}>
//       {children}
//     </TransactionsContext.Provider>
//   );
// };

export const useTransactions = () => useContext(TransactionsContext);
