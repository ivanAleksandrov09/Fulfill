import { useState } from "react";
import { useLocation } from "react-router-dom";

// Page where the user can focus/study their uploaded text
export default function Study() {
  const location = useLocation();

  return <p>{location.state.text}</p>;
}
