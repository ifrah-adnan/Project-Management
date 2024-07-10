// context/TableFontSizeContext.tsx

import React, { createContext, useContext, useState } from "react";

interface TableFontSizeContextType {
  tableFontSize: string;
  setTableFontSize: React.Dispatch<React.SetStateAction<string>>;
}

const TableFontSizeContext = createContext<
  TableFontSizeContextType | undefined
>(undefined);

export const TableFontSizeProvider: React.FC = ({ children }) => {
  const [tableFontSize, setTableFontSize] = useState("16px");

  return (
    <TableFontSizeContext.Provider value={{ tableFontSize, setTableFontSize }}>
      {children}
    </TableFontSizeContext.Provider>
  );
};

export const useTableFontSize = (): TableFontSizeContextType => {
  const context = useContext(TableFontSizeContext);
  if (!context) {
    throw new Error(
      "useTableFontSize must be used within a TableFontSizeProvider"
    );
  }
  return context;
};
