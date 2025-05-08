import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from "../api";
import Pdf from "../components/Pdf";
import Stopwatch from "../components/Stopwatch";
import { useFileContext } from "../components/FileContext";

// Page where the user can focus/study their uploaded text
export default function Study() {
  const { fileData } = useFileContext();

  const location = useLocation();
  const contentType = location.state.contentType;

  const inputText = location.state.text || null;
  const fileURL = location.state.fileURL || null;

  const [sections, setSections] = useState([]);
  const [outputText, setOutputText] = useState(inputText || null);

  const fetchSections = async () => {
    try {
      let response;
      if (contentType === "text") {
        response = await api.post("/api/analyze-text/", {
          text: inputText,
        });

        setOutputText(response.data["formatted_text"]);
      } else if (contentType === "file") {
        const formData = new FormData();
        formData.append("file", fileData);

        response = await api.post("/api/analyze-pdf/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status != 200) {
        alert("Error fetching sections");
        return [];
      }

      setSections(response.data["logical_parts"]);
    } catch (e) {
      console.log("Error fetching sections: ", e);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return (
    <div className="flex flex-row-full h-full justify-between">
      <div className="fixed left-0 h-full w-fit max-w-65 p-3 border-1 border-white">
        <div>
          <p className="text-4xl">Summary title</p>
          <hr></hr>
        </div>
        <div className="h-[90vh] overflow-y-scroll p-3 mt-2">
          {sections.map((section, i) => (
            <div key={i} className="flex flex-col justify-center min-h-13">
              <p className="text-xl">{section}</p>
              <hr className="w-full"></hr>
            </div>
          ))}
        </div>
      </div>

      {contentType === "text" && (
        <div className="ml-65 h-full p-3 overflow-y-scroll">
          <ReactMarkdown>{outputText}</ReactMarkdown>
        </div>
      )}

      {contentType === "file" && (
        <div className="w-fit ml-65 p-1 border-1">
          <Pdf src={location.state.fileURL} />
        </div>
      )}

      <Stopwatch />
    </div>
  );
}
