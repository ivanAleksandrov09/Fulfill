import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleClick = (searchResult) => {
    if (searchResult.document_data.formatted_text) {
      navigate("/Study", {
        state: { json: searchResult.document_data, contentType: "text" },
      });
    } else {
      navigate("/Study", {
        state: {
          contentType: "file",
          // construct the backend url to retrieve the file
          fileURL: `${api.defaults.baseURL}${searchResult.PDF}`,
          json: searchResult.document_data,
        },
      });
    }
  };

  const searchContent = async (query) => {
    if (query.length < 2) {
      return;
    }

    try {
      const response = await api.get("/api/documents/search/", {
        params: { query },
      });

      console.log(response.data);
      setSearchResults(response.data);
    } catch (e) {
      console.log("Error when handling querying: ", e);
      alert("There was an error in the server for querying your search! Sorry");
    }
  };

  const updateQuery = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    searchContent(newQuery);
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
        <div>
          {searchResults.map((currentResult, i) => (
            <button
              onClick={() => handleClick(currentResult)}
              key={i}
              className="h-55 w-fit border-1 p-3 !bg-background/50 hover:!bg-background-hover/50"
            >
              <div className="h-[80%]"></div>
              <hr></hr>
              <div className="h-[20%] flex justify-center items-center">
                {currentResult.document_data.summarized_name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
