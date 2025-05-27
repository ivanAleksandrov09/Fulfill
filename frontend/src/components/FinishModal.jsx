import { Link } from "react-router-dom";
import QueryResults from "./QueryResults";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

export default function FinishModal({ query, totalTime }) {
  // we simply construct the query as the keywords joined together
  query = query.join(" ");

  const hours = Math.floor(totalTime / HOUR);
  const minutes = Math.floor((totalTime / MINUTE) % 60);
  const seconds = Math.floor((totalTime / SECOND) % 60);

  let totalTimeMessage = "";
  if (totalTime === -1) {
    totalTimeMessage = "!";
  } else {
    totalTimeMessage = `for ${hours}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}!`;
  }

  return (
    <div className="fixed inset-0 h-screen w-screen flex justify-center items-center flex-col bg-black/75 z-50">
      <div className="w-[55%] h-[60%] border-1 rounded-2xl flex flex-col p-3">
        <p className="h-[15%] text-4xl">
          Congratulations on being productive {totalTimeMessage}
        </p>
        <div className="h-[80%]">
          <QueryResults query={query} refreshOnRedirect={true} />
        </div>

        <div className="flex justify-center items-center">
          <Link
            to={"/"}
            className="w-30 text-3xl transition font-medium shadow-md bg-primary hover:bg-primary-hover rounded-3xl p-2 flex justify-center"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
