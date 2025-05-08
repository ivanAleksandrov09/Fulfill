import { createContext, useContext, useState } from "react";

const FileContext = createContext();

export function FileProvider({ children }) {
  const [fileData, setFileData] = useState(null);

  return (
    <FileContext.Provider value={{ fileData, setFileData }}>
      {children}
    </FileContext.Provider>
  );
}

export const useFileContext = () => useContext(FileContext);
