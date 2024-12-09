import React, { useState, useEffect } from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table.tsx";

const Books: React.FC = () => {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        genre: "",
        isbn: "",
    });
    const [message, setMessage] = useState<string | null>(null);
    const [books, setBooks] = useState<any[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.author || !formData.genre || !formData.isbn) {
            setMessage("All fields are required.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("Unauthorized. Please log in again.");
                return;
            }

            const response = await fetch("http://localhost:8080/addbook", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage("Book added successfully!");
                setFormData({ title: "", author: "", genre: "", isbn: "" });
                fetchBooks(); // Refresh the book list after adding
            } else {
                const errorMessage = await response.text();
                setMessage(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error(error);
            setMessage("Failed to add book. Please try again later.");
        }
    };

    const fetchBooks = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("Unauthorized. Please log in again.");
                return;
            }

            const response = await fetch("http://localhost:8080/books", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBooks(data);
            } else {
                setMessage("Failed to fetch books.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Failed to fetch books. Please try again later.");
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <div className="p-6 bg-[#d6efd8] min-h-screen">
            {/* Form section */}
            <div className="flex justify-center mt-6">
                <div className="bg-[#80AF81] rounded-xl shadow-lg p-6 w-96">
                    <h1 className="text-xl font-bold mb-4 text-[#000] text-center">
                        Add a Book
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={formData.title}
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded-md w-full text-black"
                        />
                        <input
                            type="text"
                            name="author"
                            placeholder="Author"
                            value={formData.author}
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded-md w-full text-black"
                        />
                        <input
                            type="text"
                            name="genre"
                            placeholder="Genre"
                            value={formData.genre}
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded-md w-full text-black"
                        />
                        <input
                            type="text"
                            name="isbn"
                            placeholder="ISBN"
                            value={formData.isbn}
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded-md w-full text-black"
                        />
                        <button
                            type="submit"
                            className="bg-[#2A3B2D] hover:bg-[#202B21] text-white p-2 rounded w-full"
                        >
                            Add Book
                        </button>
                        {message && (
                            <p className="mt-4 text-center text-[#000] font-semibold">
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </div>

            {/* Book list section */}
            {books.length > 0 ? (
                <div className="max-w-7xl mx-auto mt-5 overflow-x-auto bg-[#80AF81] border-gray-700 rounded-xl shadow-[0px_0px_30px_rgba(0,0,0,0.3)]">
                    <Table className="">
                        <TableHeader className="bg-[#508D4E] border-b-2 border-[#D6EFD8]">
                            <TableRow>
                                <TableHead className="font-bold">Title</TableHead>
                                <TableHead className="font-bold">Author</TableHead>
                                <TableHead className="font-bold">Genre</TableHead>
                                <TableHead className="font-bold">ISBN</TableHead>
                                <TableHead className="font-bold">Edit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {books.map((book) => (
                                <TableRow className="text-black font-bold border-[#D6EFD8] border-b-2" key={book.id}>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell>{book.genre}</TableCell>
                                    <TableCell>{book.isbn}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded">
                                                Edit
                                            </button>
                                            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded">
                                                Delete
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (<p className="text-[#000]"></p>)
            }
        </div>
    );
};

export default Books;
