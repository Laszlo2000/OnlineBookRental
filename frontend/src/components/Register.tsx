import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  // formhoz állapotok
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // A regisztrációs kérés
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const requestData = {
      username,
      email,
      password
    };

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      // Ha sikerült, átirányítjuk a login oldalra
      navigate("/login");
    } catch (err) {
      setError("Registration failed: " + err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-zinc-850 fixed top-0 left-0">
      <form onSubmit={handleRegister} className="flex flex-col gap-4 w-72 bg-zinc-700 p-6 rounded-lg shadow-lg">
        <h1 className="text-center text-white mb-5 text-3xl">Register</h1>
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md bg-black text-white"
        />
        <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer">
          Register
        </button>
        <p className="text-center">
          Already have an account? <br />{" "}
          <a href="/login" className="text-blue-400">
            Sign in here!{" "}
          </a>
        </p>
        {error && <p className="mt-2 text-center text-red-600 text-lg font-bold">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
