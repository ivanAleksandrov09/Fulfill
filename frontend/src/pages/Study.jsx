import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useLocation } from "react-router-dom";
import api from "../api";
import { useFileContext } from "../components/FileContext";
import FinishModal from "../components/FinishModal";
import { Pdf } from "../components/Pdf";
import Stopwatch from "../components/Stopwatch";
import { useTimeContext } from "../components/TimeContext";

// Page where the user can focus/study their uploaded text
export default function Study() {
  const { fileData } = useFileContext();
  const { timeData } = useTimeContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  const location = useLocation();
  const contentType = location.state.contentType;

  const jsonData = location.state.json || null;

  const inputText = location.state.text || null;
  const [outputText, setOutputText] = useState(inputText || null);

  const fileURL = location.state.fileURL || null;
  const [currentPage, setCurrentPage] = useState(1);

  const [queryResult, setQueryResult] = useState(null);
  const [displayedQuestion, setDisplayedQuestion] = useState(null);

  const fetchInfo = async () => {
    try {
      let response;
      if (contentType === "text") {
        if (jsonData) {
          response = { data: jsonData, status: 200 };
        } else {
          response = await api.post("/api/analyze-text/", {
            text: inputText,
          });
        }

        setOutputText(response.data["formatted_text"]);
      } else if (contentType === "file") {
        if (jsonData) {
          response = { data: jsonData, status: 200 };
        } else {
          const formData = new FormData();
          formData.append("file", fileData);

          response = await api.post("/api/analyze-pdf/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
      }

      if (response.status != 200) {
        alert("Error fetching sections");
        return [];
      }

      setQueryResult(response.data);
    } catch (e) {
      console.log("Error fetching sections: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadQuestionsPDF = () => {
    if (!queryResult?.questions) return <></>;
    // if no question is meant to trigger on current page, return
    const question = queryResult.questions.filter(
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
    if (!queryResult?.questions) return "";
    const jsonSafeOutputText = outputText.replace(/"/g, "'");

    const lines = jsonSafeOutputText
      .split("\n")
      .filter((line) => line.length > 0);

    const processedLines = lines.map((line) => {
      const question = queryResult.questions.find((q) =>
        line.includes(q.trigger_sentence)
      );
      if (question) {
        // when quotation marks are present in question it messes
        // up the JSON, so we replace them with single quotes
        question.question = question.question.replace(/"/g, "'");
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
                <span key={index}>
                  {text}
                  <QuestionButton question={question} />
                </span>
              );
            } catch (e) {
              console.error("JSON parse error:", e);
              return <span key={index}>{part}</span>;
            }
          }
          return <p key={index}>{part}</p>;
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
      {!isLoading && queryResult && (
        <>
          <div className="fixed left-0 h-full w-fit max-w-65 p-3 border-1 border-white flex flex-col justify-around">
            <div className="min-h-[8vh]">
              <p className="text-2xl text-center pb-2">
                {queryResult.summarized_name}
              </p>
              <hr></hr>
            </div>
            <div className="h-[75vh] overflow-y-scroll p-3 mt-2 mb-0.5">
              {queryResult.logical_parts.map((section, i) => (
                <div key={i} className="flex flex-col justify-center min-h-13">
                  <p className="text-xl">{section}</p>
                  <hr className="w-full"></hr>
                </div>
              ))}
            </div>
            <hr></hr>
            <div className="w-full flex items-center justify-center mt-0.5">
              <button
                onClick={() => setIsFinished(true)}
                className="w-full text-4xl rounded-lg py-2 bg-green-500 hover:bg-green-600 transition-colors"
              >
                Finish
              </button>
            </div>
          </div>

          {contentType === "text" && (
            <>
              <div className="ml-65 h-screen max-w-250 p-3 overflow-y-scroll">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <QuestionText text={children.toString()} />
                    ),
                    h2: ({ children }) => (
                      <QuestionText text={children.toString()} />
                    ),
                    li: ({ children }) => (
                      <QuestionText text={children.toString()} />
                    ),
                    span: ({ children }) => (
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

          <div className="flex flex-col border-l-2 w-54">
            <Stopwatch onCall={(t) => setSavedTime(t)} />
            <Link
              className="transition font-medium shadow-md mx-auto mt-auto mb-2 text-5xl h-24 w-44 rounded-lg p-3 !bg-red-500 hover:!bg-red-800 flex justify-center items-center"
              to={"/"}
            >
              Exit
            </Link>
          </div>
          {isFinished && (
            <FinishModal
              query={queryResult.keywords}
              totalTime={timeData.current > 0 ? timeData.current : -1}
            />
          )}
        </>
      )}
    </div>
  );
}
