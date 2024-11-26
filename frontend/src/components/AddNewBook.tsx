import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar.tsx";

const AddBook: React.FC = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        isbn: '',
    });

    const [message, setMessage] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

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

        fetchUserRole();
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
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // A teljes képernyő magassága
                width: '100vw', // A teljes képernyő szélessége
                backgroundColor: '#242424', // Háttérszín
                position: 'fixed', // Fix helyzet a képernyőn
                top: 0,
                left: 0,
            }}
        >

            {/* Navbar hozzáadása */}
            <Navbar />


            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    width: '300px', // Az űrlap szélessége
                    backgroundColor: '#242424', // Űrlap háttérszín
                    padding: '20px',
                    borderRadius: '8px', // Lekerekített sarkok
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Árnyék
                }}
            >
                <h1 style={{ textAlign: 'center', color: '#fff', marginBottom: '20px' }}>Add New Book</h1>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    style={{
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#000',
                        color: '#fff',
                    }}
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    style={{
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#000',
                        color: '#fff',
                    }}
                />
                <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                    style={{
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#000',
                        color: '#fff',
                    }}
                />
                <input
                    type="text"
                    name="isbn"
                    placeholder="ISBN"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                    style={{
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#000',
                        color: '#fff',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '10px',
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Add Book
                </button>
                {message && (
                    <p
                        style={{
                            marginTop: '10px',
                            textAlign: 'center',
                            color: message.includes('successfully') ? 'green' : 'red',
                        }}
                    >
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default AddBook;
