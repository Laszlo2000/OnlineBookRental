import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";



interface Book {
  id: number;
  title: string;
  author: string;
  available: boolean;
  genre: string;
  isbn: BigInteger;
}

const Rent = () => {
  const [title, setTitle] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [registeredBooks, setRegisteredBooks] = useState<Book[]>([]);

  const handleBorrow = async () => {
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
          `You have successfully checked out the book "${data.title}"`
        );
        setRegisteredBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.title === data.title ? { ...book, available: false } : book
          ));
      } else {
        setError("Ismeretlen hiba történt.");
      }
    } catch (err) {
      setError("Hálózati hiba történt.");
      localStorage.removeItem("token"); 
      navigate("/login");
    }
  };

  useEffect(() => {

    const fetchRegisteredBooks = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch("http://localhost:8080/books", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch registered books.");
        }

        const books: Book[] = await response.json();
        setRegisteredBooks(books);
      } catch (err: any) {
        console.error("Error:", err.message);
        setError("Failed to load registered users. Please try again later.");
      }
    };

    fetchRegisteredBooks();
  }, []);



  return (
    <div className="bg-[#D6EFD8] pt-16 pb-2">
      <div className="flex justify-center items-center p-5">
        <div className="max-w-96 min-w-96 text-center text-black bg-[#80AF81] p-6 rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
          <h1 className="mb-5 text-2xl font-bold">Borrow a book</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleBorrow();
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
                  {registeredBooks.filter((book) => book.available).map((book, index) => (
                      <option key={index} value={book.title}>
                        {book.title}
                      </option>
                  ))}
                </select>
            </div>
            <button
              type="submit"
              className="w-28 p-2 px-4 bg-[#2b3b2d] hover:bg-[#202b21] text-white rounded"
            >
              Borrow
            </button>
          </form>
          {response && <p className="mt-4 font-bold">{response}</p>}
          {error && <p className=" mt-4 font-bold">{error}</p>}
        </div>
      </div>

      {registeredBooks.length > 0 ? (
          <div className="max-w-7xl mx-auto mt-5 overflow-x-auto rounded bg-[#80AF81] border-gray-700 rounded-xl shadow-[0px_0px_30px_rgba(0,0,0,0.3)]">
            <Table className="">
              <TableHeader className="bg-[#508D4E] border-b-2 border-[#D6EFD8]">
              <TableRow>
                <TableHead className="font-bold">Title</TableHead>
                <TableHead className="font-bold">Author</TableHead>
                <TableHead className="font-bold">Genre</TableHead>
                <TableHead className="font-bold">ISBN</TableHead>
              </TableRow>
              </TableHeader>
              <TableBody>
              {registeredBooks.filter((book) => book.available).map((book) => (
                  <TableRow className="text-black font-bold border-[#D6EFD8] border-b-2" key={book.id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.genre}</TableCell>
                    <TableCell>{book.isbn}</TableCell>
                  </TableRow>
              ))}
              </TableBody>
            </Table>
          </div>
      ) : (
          <p className="text-gray-500 text-center mt-5">
            No registered books found.
          </p>
      )}

    </div>
  );
};

export default Rent;
