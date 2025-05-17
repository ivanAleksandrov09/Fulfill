import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import api from "../api";

function Home() {
  const [username, setUsername] = useState("GUEST");

  const [text, setText] = useState("Paste your text here...");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const logOut = () => {
    navigate("/logout");
  };

  const handleTextUpdate = (newText) => {
    setText(newText);
    navigate("/Study", { state: { text: newText, contentType: "text" } });
  };

  const handleFileUpdate = (newFileURL) => {
    navigate("/Study", { state: { fileURL: newFileURL, contentType: "file" } });
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/api/user-info/");
        setUsername(response.data);
      } catch (e) {
        console.log("Error fetching username: ", e);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <>
      <div className="h-[10vh] w-[100vw] flex justify-end text-2xl p-5">
        <div className="flex flex-col justify-center items-center gap-y-2">
          Hi, {username}
          <button onClick={logOut} className="text-xl">
            Log out
          </button>
        </div>
      </div>
      <div className="h-[40vh] w-[100vw] flex justify-center items-center pt-10 flex-col">
        <p className="text-6xl">Fulfill</p>
        <p className="text-4xl mt-1">What are we reading today?</p>
      </div>
      <div className="h-[50vh] w-[100vw] flex justify-start items-center pt-10 flex-col">
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
