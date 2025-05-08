import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import api from "../api";

function Home() {
  const [text, setText] = useState("Paste your text here...");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleTextUpdate = (newText) => {
    setText(newText);
    navigate("/Study", { state: { text: newText, contentType: "text" } });
  };

  const handleFileUpdate = (newFileURL) => {
    navigate("/Study", { state: { fileURL: newFileURL, contentType: "file" } });
  };

  return (
    <>
      <div className="h-[50vh] w-[100vw] flex justify-center items-center pt-10 flex-col">
        <p className="text-6xl">Fulfill</p>
        <p className="text-4xl mt-1">What are we reading today?</p>
      </div>
      <div className="h-[50vh] w-[100vw] flex justify-start items-center mt-10 flex-col">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-80 h-26 text-3xl"
        >
          Upload text
        </button>

        {isModalOpen && (
          <Modal
            initialText={text}
            onSubmitText={handleTextUpdate}
            onSubmitFile={handleFileUpdate}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </>
  );
}

export default Home;
