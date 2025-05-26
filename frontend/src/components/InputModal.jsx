import { useState } from "react";
import { useFileContext } from "./FileContext";

export default function InputModal({
  initialText,
  onSubmitText,
  onSubmitFile,
  onClose,
}) {
  const { setFileData } = useFileContext();

  const [localText, setLocalText] = useState(initialText);
  const [inputType, setInputType] = useState("text");
  const [loading, setLoading] = useState(false);

  const handleTextSubmit = (e) => {
    e.preventDefault();
    onSubmitText(localText);
  };

  const handleFileSubmit = async (e) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";

    fileInput.click();

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];

      if (!file) {
        alert("No file selected");
        return;
      }

      if (file.type !== "application/pdf") {
        alert("Please select a valid PDF file");
        return;
      }

      setFileData(file);

      onSubmitFile(URL.createObjectURL(file));
    };
  };

  return (
    <div className="fixed inset-0 h-screen w-screen flex justify-center items-center flex-col bg-black/50">
      <div className="grid grid-rows-7 gap-4 border-1 rounded-sm p-3 bg-background h-125 w-110">
        <div className="row-start-1">
          <div className="grid grid-cols-2 gap-1 justify-items-stretch mb-2">
            <button
              onClick={() => setInputType("text")}
              className={`!bg-background hover:!bg-background-hover border-r border-white rounded-[0px] w-auto ${
                inputType === "text" ? "!bg-background-selected" : ""
              }`}
            >
              Plain text
            </button>
            <button
              onClick={() => setInputType("pdf")}
              className={`!bg-background hover:!bg-background-hover w-auto ${
                inputType === "pdf" ? "!bg-background-selected" : ""
              }`}
            >
              PDF
            </button>
          </div>
        </div>

        {inputType === "text" && (
          <div className="row-span-6 row-start-2 grid grid-rows-[1fr_auto]">
            <form onSubmit={handleTextSubmit}>
              <div className="justify-self-center">
                <textarea
                  onChange={(e) => setLocalText(e.target.value)}
                  rows="14"
                  cols="50"
                  value={localText}
                ></textarea>
              </div>
              <div className="flex justify-around">
                <button className="w-25" onClick={onClose}>
                  Cancel
                </button>
                <button className="w-25" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}

        {inputType === "pdf" && (
          <div className="row-span-6 row-start-2 justify-self-center self-center">
            <button
              type="file"
              accept=".pdf"
              onClick={handleFileSubmit}
              className="w-40 h-15"
            >
              Upload File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
