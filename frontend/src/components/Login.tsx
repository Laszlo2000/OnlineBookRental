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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // A teljes képernyő magassága
        width: "100vw", // A teljes képernyő szélessége
        backgroundColor: "#242424", // Háttérszín
        position: "fixed", // Fix helyzet
        top: 0,
        left: 0
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "300px", // Az űrlap szélessége
          backgroundColor: "#242424", // Űrlap háttérszín
          padding: "20px",
          borderRadius: "8px", // Lekerekített sarkok
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" // Árnyék
        }}
      >
        <h1 style={{ textAlign: "center", color: "#fff", marginBottom: "20px" }}>Login</h1>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#000",
            color: "#fff"
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#000",
            color: "#fff"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Login
        </button>
        {error && (
          <p
            style={{
              marginTop: "10px",
              textAlign: "center",
              color: "red"
            }}
          >
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
