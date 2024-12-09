import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Return: React.FC = () => {
  const [title, setTitle] = useState<string>(""); // Kiválasztott könyv címe
  const [books, setBooks] = useState<string[]>([]); // Elérhető könyvek listája
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/user/borrowed", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setBooks(data.map((book: { title: string }) => book.title));
        } else if (res.status === 401) {
          navigate("/login");
        } else {
          setError("Nem sikerült lekérni a könyveket.");
        }
      } catch (err) {
        console.error("Hiba történt:", err);
        setError("Hálózati hiba történt.");
      }
    };

    fetchBooks();
  }, [navigate]);

  const handleReturn = async () => {
    setResponse(null);
    setError(null);

    if (!title.trim()) {
      setError("Kérlek, válassz egy könyvet!");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/return", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (res.status === 400) {
        setError("A könyvet már visszahozták.");
      } else if (res.status === 404) {
        setError("A megadott könyv nem található.");
      } else if (res.ok) {
        const data = await res.json();
        setResponse(`You have successfully returned the book "${data.title}"`);
        setBooks((prevBooks) => prevBooks.filter((book) => book !== title));
        setTitle("");
      } else {
        setError("Ismeretlen hiba történt.");
      }
    } catch (err) {
      setError("Hálózati hiba történt.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
      <div className="bg-[#D6EFD8] pt-16 pb-2">
        <div className="flex justify-center items-center p-5">
          <div className="max-w-96 min-w-96 text-center text-black bg-[#80AF81] p-6 rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
            <h1 className="mb-5 text-2xl font-bold">Return a book</h1>
            <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleReturn();
                }}
            >
              <div>
                <select
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="p-2 mb-4 border border-gray-300 rounded-md max-w-50px"
                >
                  <option value="">Choose a book</option>
                  {books.map((book, index) => (
                      <option key={index} value={book}>
                        {book}
                      </option>
                  ))}
                </select>
              </div>
              <button
                  type="submit"
                  className="w-28 p-2 px-4 bg-[#2b3b2d] hover:bg-[#202b21] text-white rounded"
              >
                Return
              </button>
            </form>

            {/* Sikeres válasz vagy hibaüzenet megjelenítése */}
            {response && <p className="mt-4 font-bold">{response}</p>}
            {error && <p className=" mt-4 font-bold">{error}</p>}
          </div>
        </div>
      </div>
  );
};

export default Return;
