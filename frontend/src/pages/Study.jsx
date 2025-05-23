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

  const [summarizedName, setSummarizedName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [displayedQuestion, setDisplayedQuestion] = useState(null);

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

      setSummarizedName(response.data["summarized_name"]);
      setSections(response.data["logical_parts"]);
      setQuestions(response.data["questions"]);
    } catch (e) {
      console.log("Error fetching sections: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadQuestionsPDF = () => {
    // if no question is meant to trigger on current page, return
    const question = questions.filter(
      (question) => question.page_trigger + 1 === currentPage
    );
    if (!question.length) {
      return <></>;
    }

    return displayQuestion(question[0]);
  };

  const displayQuestion = (question) => {
    if (!question) {
      return;
    }

    const wrongAnswers = question.wrong_answers;

    // random integer between 0 and 3
    const rightAnswerPosition = Math.floor(Math.random() * 4);

    const randomizedAnswers = [
      ...wrongAnswers.slice(0, rightAnswerPosition),
      question.right_answer,
      ...wrongAnswers.slice(rightAnswerPosition),
    ].slice(0, 4);

    const checkAnswer = (chosenIndex) => {
      if (chosenIndex == rightAnswerPosition) {
        alert("Correct!");
        setDisplayedQuestion(null);
      } else {
        alert("Wrong answer!");
      }
    };

    return (
      <div className="h-fit flex flex-col m-5 pb-2 text-center border-1 rounded-2xl">
        <p>{question.question}</p>
        <div className="grid grid-cols-2">
          {randomizedAnswers.map((answer, i) => (
            <button
              key={i}
              onClick={() => checkAnswer(i)}
              className="!bg-background rounded-lg hover:!bg-background-hover"
            >
              {answer}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const processText = () => {
    const lines = outputText.split("\n").filter((line) => line.length > 0);

    const processedLines = lines.map((line) => {
      const question = questions.find((q) => line.includes(q.trigger_sentence));
      if (question) {
        return `${line} [QUESTION:${JSON.stringify(question)}]`;
      }
      return line;
    });

    return processedLines.join("\n");
  };

  const QuestionButton = ({ question }) => {
    return (
      <button
        onClick={() => setDisplayedQuestion(question)}
        className="inline-block !mx-2 !px-2 !py-1 !rounded-full"
      >
        ❓
      </button>
    );
  };

  const QuestionText = ({ text }) => {
    const parts = text.split("\n").filter((t) => t.length > 0);

    return (
      <p>
        {parts.map((part, index) => {
          if (part.includes("[QUESTION:")) {
            try {
              const [text, questionPart] = part.split("[QUESTION:");
              const question = JSON.parse(questionPart.slice(0, -1));
              return (
                <div key={index}>
                  {text}
                  <QuestionButton question={question} />
                </div>
              );
            } catch (e) {
              console.error("JSON parse error:", e);
              return <div key={index}>{part}</div>;
            }
          }
          return <div key={index}>{part}</div>;
        })}
      </p>
    );
  };

  useEffect(() => {
    const awaitFetchInfo = async () => await fetchInfo();
    awaitFetchInfo();
  }, [contentType, fileData]);

  return (
    <div className="flex flex-row w-full h-full justify-between">
      {isLoading && <span className="loader"></span>}
      {!isLoading && (
        <>
          <div className="fixed left-0 h-full w-fit max-w-65 p-3 border-1 border-white">
            <div>
              <p className="text-2xl text-center pb-2">{summarizedName}</p>
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
            <>
              <div className="ml-65 h-full max-w-250 p-3 overflow-y-scroll">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <QuestionText text={children.toString()} />
                    ),
                  }}
                >
                  {processText()}
                </ReactMarkdown>
              </div>
              {!isLoading && displayQuestion(displayedQuestion)}
            </>
          )}

          {contentType === "file" && (
            <>
              <div className="w-fit ml-65 p-1 border-1">
                <Pdf src={fileURL} onPageUpdate={(n) => setCurrentPage(n)} />
              </div>
              {!isLoading && loadQuestionsPDF()}
            </>
          )}

          <div className="flex flex-col border-l-2">
            <Stopwatch />
            <Link
              className="mx-auto mt-auto mb-2 text-5xl h-24 w-44 rounded-lg p-3 !bg-red-500 flex justify-center items-center"
              to={"/"}
            >
              Exit
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
