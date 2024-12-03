import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Rent = () => {
  const [title, setTitle] = useState(""); // Könyvcím mező
  const [response, setResponse] = useState(""); // Sikeres válasz
  const [error, setError] = useState(""); // Hibaüzenet
  const navigate = useNavigate();

  const handleBorrow = async () => {
    // Előző állapotok törlése
    setResponse("");
    setError("");

    if (!title) {
      setError("Kérlek, add meg a könyv címét!");
      return;
    }
    const token = localStorage.getItem("token"); // Kiszedjük a Local Storage-ből a JWT-t

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/rent", {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`, // A JWT-t odaadjuk a headernek
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
      });

      if (res.status === 400) {
        setError("A könyvet már kikölcsönözték.");
      } else if (res.status === 404) {
        setError("A megadott könyv nem található.");
      } else if (res.ok) {
        const data = await res.json();
        setResponse(
          `You have successfully checked out the book "${data.title}"!` // Vissza kell hozni: ${data.dueDate}.`
        );
      } else {
        setError("Ismeretlen hiba történt.");
      }
    } catch (err) {
      setError("Hálózati hiba történt.");
      localStorage.removeItem("token"); // Az invalid tokent töröljük
      navigate("/login"); // Visszaküldjük a login oldalra
    }
  };

  return (
    <div className="bg-zinc-850 min-h-screen pt-16">
      <div className="flex justify-center items-center p-5">
        <div className="max-w-xl min-w-96 text-center font-sans text-zinc-800 bg-zinc-100 p-6 rounded-lg shadow-lg">
          <h1 className="mb-5 text-2xl font-bold">Borrow a book</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleBorrow();
            }}
          >
            <div>
              <label htmlFor="title" className="block pb-3">
                Select a book
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Choose a book"
                className="p-2 mb-4 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-28 p-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer"
            >
              Borrow
            </button>
          </form>
          {response && <p className="text-green-500 mt-4 font-bold">{response}</p>}
          {error && <p className="text-red-500 mt-4 font-bold">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Rent;
