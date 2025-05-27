import { useState } from "react";
import QueryResults from "./QueryResults";

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState("");

  const updateQuery = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="fixed inset-0 h-screen w-screen flex justify-center items-center flex-col bg-black/50">
      <div className="w-[60%] h-[70%] border-1 p-3 rounded-3xl">
        <form className="h-fit w-full flex flex-row justify-between p-3 gap-x-3">
          <input
            onChange={updateQuery}
            className="w-full border-1 rounded-[5px] p-[1ch]"
            rows={1}
            value={query}
          ></input>
          <button
            onClick={onClose}
            className="text-2xl h-fit w-14 !rounded-[100%] !bg-background hover:!bg-background-hover"
          >
            X
          </button>
        </form>
        <QueryResults query={query} refreshOnRedirect={false} />
      </div>
    </div>
  );
}
