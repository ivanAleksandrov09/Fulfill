import { useState } from "react";

export default function Modal({ initialText, onSubmit, onClose }) {
  const [localText, setLocalText] = useState(initialText);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(localText);
  };

  return (
    <div className="fixed inset-0 h-screen w-screen flex justify-center items-center flex-col bg-black/50">
      <div className="grid-rows-5 gap-4 border-1 rounded-sm p-3 bg-background">
        <form onSubmit={handleSubmit}>
          <div className="row-span-4 row-start-1">
            <textarea
              onChange={(e) => setLocalText(e.target.value)}
              rows="14"
              cols="50"
              value={localText}
            ></textarea>
          </div>
          <div className="row-span-1 row-start-4 flex justify-around">
            <button className="w-25" onClick={onClose}>
              Cancel
            </button>
            <button className="w-25" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
