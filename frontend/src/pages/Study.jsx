import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from "../api";
import Pdf from "../components/Pdf";
import Stopwatch from "../components/Stopwatch";
import { useFileContext } from "../components/FileContext";

// Page where the user can focus/study their uploaded text
export default function Study() {
  const { fileData } = useFileContext();
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const contentType = location.state.contentType;

  const inputText = location.state.text || null;
  const [outputText, setOutputText] = useState(inputText || null);

  const fileURL = location.state.fileURL || null;
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState([]);

  const [sections, setSections] = useState([]);

  const fetchInfo = async () => {
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
      setQuestions(response.data["questions"]);
      setIsLoading(false);
    } catch (e) {
      console.log("Error fetching sections: ", e);
    }
  };

  // todo: add question handling for text
  const loadQuestionsText = () => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(callback, options);

    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let element = entry.target;

          console.log(element);
        }
      });
    };
  };

  const loadQuestionsPDF = () => {
    // if no question is meant to trigger on current page, return
    const question = questions.filter(
      (question) => question.page_trigger + 1 === currentPage
    );
    if (!question.length) {
      return <></>;
    }

    displayQuestion(question);
  };

  const displayQuestion = (question) => {
    const wrongAnswers = question[0].wrong_answers;

    // random integer between 0 and 3
    const rightAnswerPosition = Math.floor(Math.random() * 4);

    const randomizedAnswers = [
      ...wrongAnswers.slice(0, rightAnswerPosition),
      question[0].right_answer,
      ...wrongAnswers.slice(rightAnswerPosition),
    ].slice(0, 4);

    return (
      <div className="flex flex-col">
        <p>{question[0].question}</p>
        {randomizedAnswers.map((answer, i) => (
          <button
            key={i}
            className="!bg-background rounded-lg hover:!bg-background-hover"
          >
            {answer}
          </button>
        ))}
      </div>
    );
  };

  useEffect(() => {
    fetchInfo();
  }, [contentType, inputText, fileData]);

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
        <>
          <div className="w-fit ml-65 p-1 border-1">
            <Pdf src={fileURL} onPageUpdate={(n) => setCurrentPage(n)} />
          </div>
          {!isLoading && loadQuestionsPDF()}
        </>
      )}

      <div className="flex flex-col">
        <Stopwatch />
        <Link
          className="mx-auto mt-auto mb-2 text-5xl h-24 w-44 rounded-lg p-3 !bg-red-500 flex justify-center items-center"
          to={"/"}
        >
          Exit
        </Link>
      </div>
    </div>
  );
}
