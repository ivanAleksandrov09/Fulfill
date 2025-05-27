/* I created this context to pass the final time value to the
 FinishModal component when it needs it. Right now the Stopwatch
 component updates the timeData ref every millisecond, which is not
 ideal, but should do for now. The idea of using useRef is to fix
 an issue where the questions on the Study page keep rerendering upon each second
 which causes the questions to reorder */

import { useRef, createContext, useContext } from "react";

const TimeContext = createContext();

export function TimeProvider({ children }) {
  const timeData = useRef(null);

  return (
    <TimeContext.Provider value={{ timeData }}>{children}</TimeContext.Provider>
  );
}

export const useTimeContext = () => useContext(TimeContext);
