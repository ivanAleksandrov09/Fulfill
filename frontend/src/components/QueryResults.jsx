import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function QueryResults({ query, refreshOnRedirect }) {
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleClick = (searchResult) => {
    // We need to refresh the page if we are redirecting from the Study
    // page in order to update all the JSON data
    if (searchResult.document_data.formatted_text) {
      if (refreshOnRedirect) navigate(0);
      navigate("/Study", {
        state: { json: searchResult.document_data, contentType: "text" },
      });
    } else {
      if (refreshOnRedirect) navigate(0);
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

      if (response.status === 500) {
        alert(
          "There's been a server error in processing your document! We are sorry for any inconvenience!"
        );
      }

      // make sure the document doesn't recommend itself by comparing it's own
      // keywords joined together with the query variable
      const results = response.data.filter((queryResult) => {
        let currentQuery = queryResult.document_data.keywords.join(" ");
        return currentQuery != query;
      });

      setSearchResults(results);
    } catch (e) {
      console.log("Error when handling querying: ", e);
      alert("There was an error in the server for querying your search! Sorry");
    }
  };

  useEffect(() => {
    searchContent(query);
  }, [query]);

  return (
    <div className="flex flex-row gap-4 overflow-x-auto">
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
  );
}
