import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Return: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleReturn = async () => {
    // Előző válaszok és hibák törlése
    setResponse(null);
    setError(null);

    if (!title.trim()) {
      setError("Kérlek, add meg a könyv címét!");
      return;
    }

    const token = localStorage.getItem("token"); // Kiszedjük a Local Storage-ből a JWT-t

    if (!token) {
      navigate("/login"); // Ha nem sikerült megkapni a tokent, akkor visszaküldjük a felhasználót a loginra
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/return", {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`, // A JWT-t odaadjuk a headernek
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
      });

      if (res.status === 400) {
        setError("A könyvet már visszahozták.");
      } else if (res.status === 404) {
        setError("A megadott könyv nem található.");
      } else if (res.ok) {
        const data = await res.json();
        setResponse(`Sikeresen visszahoztad a(z) "${data.title}" című könyvet!`);
      } else {
        setError("Ismeretlen hiba történt.");
      }
    } catch (err) {
      setError("Hálózati hiba történt.");
      localStorage.removeItem("token"); // Az invalid tokent töröljük.
      navigate("/login"); // Visszaküldjül a loginra ha unauthorized
    }
  };

  return (
    <div className="bg-zinc-850 min-h-screen pt-16">
      <div className="flex justify-center items-center p-5">
        <div className="max-w-xl min-w-96 text-center font-sans text-zinc-800 bg-zinc-100 p-6 rounded-lg shadow-lg">
          <h1 className="mb-5 text-2xl font-bold">Return a book</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleReturn();
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
                required
                placeholder="Choose a book"
                className="p-2 mb-4 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-28 p-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer"
            >
              Return
            </button>
          </form>

          {/* Sikeres válasz vagy hibaüzenet megjelenítése */}
          {response && <p className="text-green-500 mt-4 font-bold">{response}</p>}
          {error && <p className="text-red-500 mt-4 font-bold">{error}</p>}
        </div>
      </div>
    </div>
  );
};
export default Return;
