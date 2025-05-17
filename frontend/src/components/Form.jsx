import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { Link } from "react-router-dom";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <p className="w-full h-[25vh] flex justify-center items-center text-8xl">
        Fulfill
      </p>
      <form
        onSubmit={handleSubmit}
        className="w-full h-[75vh] flex flex-col justify-center items-center text-5xl gap-y-3"
      >
        <input
          className="border-1 rounded-2xl p-2"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="border-1 rounded-2xl p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="!rounded-2xl" type="submit">
          {name}
        </button>
        {name === "Login" && (
          <div className="flex flex-row gap-x-4">
            <p>or</p>
            <Link to={"/register"} className="underline hover:text-gray-300">
              create a new account
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}

export default Form;
