import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";


interface RegisteredUser {
    id: number;
    username: string;
    email: string;
    role: {
        authority: string;
    }
}

const AddBook: React.FC = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        isbn: '',
    });

    const [message, setMessage] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setMessage('Unauthorized. Please log in again.');
                    return;
                }

                const response = await fetch('http://localhost:8080/addbook/getrole', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const role = await response.text();
                    setUserRole(role);
                } else {
                    setMessage('Failed to fetch user role.');
                }
            } catch (error) {
                console.error('Error fetching role:', error);
                setMessage('Failed to fetch user role.');
            }
        };

        const fetchRegisteredUsers = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch("http://localhost:8080/users", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const users: RegisteredUser[] = await response.json();
                    setRegisteredUsers(users);
                } else{
                    throw new Error("Failed to fetch registered users.");
                }

            } catch (err: any) {
                console.error("Error:", err.message);
                setMessage("Failed to load registered users. Please try again later.");
            }
        };

        fetchUserRole();
        fetchRegisteredUsers();

    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.author || !formData.genre || !formData.isbn) {
            setMessage('All fields are required.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Unauthorized. Please log in again.');
                return;
            }

            const response = await fetch('http://localhost:8080/addbook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    isbn: formData.isbn,
                }),
            });

            if (response.ok) {
                setMessage('Book added successfully!');
                setFormData({ title: '', author: '', genre: '', isbn: '' });
            } else {
                const errorMessage = await response.text();
                setMessage(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed to add book. Please try again later.');
        }
    };

    if (userRole !== 'admin') {
        return <p>Access denied. Admin role required to add books.</p>;
    }

    return (
        <>
        <div className="flex justify-center items-center w-screen bg-zinc-850 fixed left-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-72 bg-zinc-700 p-6 rounded-lg shadow-lg">
                <h1 className="text-center text-white mb-5 text-3xl">Add New Book</h1>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="p-2 border border-gray-300 rounded-md bg-black text-white"
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className="p-2 border border-gray-300 rounded-md bg-black text-white"
                />
                <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                    className="p-2 border border-gray-300 rounded-md bg-black text-white"
                />
                <input
                    type="text"
                    name="isbn"
                    placeholder="ISBN"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                    className="p-2 border border-gray-300 rounded-md bg-black text-white"
                />
                <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer">Add Book</button>
                {message && (
                    <p className={`mt-2 text-center ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
        <div className='flex justify-center items-center h-screen w-screen bg-zinc-850 fixed top-60'>
            {registeredUsers.length > 0 ? (
                <div>
                    <Table >
                        <TableHeader >
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {registeredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role.authority}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <p className="text-gray-500 text-center mt-5">
                    No registered users found.
                </p>
            )}
        </div>
    </>
    );
};

export default AddBook;