import { useState } from "react";
import { useLocation } from "react-router-dom";
import Pdf from "../components/Pdf";

// Page where the user can focus/study their uploaded text
export default function Study() {
  const location = useLocation();
  const contentType = location.state.contentType;
  const [sections, setSections] = useState(["Hi", "Test2"]);

  return <div className="flex flex-row-full h-full justify-between">
      <div className="fixed inset-0 h-screen w-fit max-w-65 p-3 border-1 border-white">
        <div>
          <p className="text-4xl">Summary title</p>
          <hr></hr>
        </div>
        <div className="h-[90vh]">
          {sections.map((section, i) => 
          <div key={i} className="flex flex-col justify-center min-h-13">
            <p className="text-xl" >{section}</p>
            <hr className="w-full"></hr>
          </div>)}
        </div>
      </div>

      {contentType === "text" &&
      <div className="ml-65">
        <p className="text-wrap">{location.state.text}</p>
      </div>}

      {contentType === "file" &&
      <div className="w-fit ml-65 p-1 border-1">
        <Pdf src={location.state.fileURL} />
      </div>
      }

      <div className="flex flex-col ml-auto p-4 text-5xl gap-3">
        <div className="rounded-lg p-3 bg-primary flex justify-center">
          00:00
        </div>
        <div className="rounded-lg p-3 bg-green-500 flex justify-center">
          Pause
        </div>
        <div className="rounded-lg p-3 bg-red-500 flex justify-center">
          Stop
        </div>
      </div>
    </div>;
}
