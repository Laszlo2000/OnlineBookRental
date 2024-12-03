import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const token = await response.text();
      localStorage.setItem("token", token);
      navigate("/userprofile");
    } catch (err: any) {
      console.error("Login error:", err.message);
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-zinc-850 fixed top-0 left-0">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-72 bg-zinc-700 p-6 rounded-lg shadow-lg">
        <h1 className="text-center text-white mb-5 text-3xl">Login</h1>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer">
          Login
        </button>
        <p className="text-center">
          Does not have an account? <br />{" "}
          <a href="/register" className="text-blue-400">
            Register here!
          </a>
        </p>
        {error && <p className="mt-2 text-center text-red-600 text-lg font-bold">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
