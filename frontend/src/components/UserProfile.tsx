import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Importáld a Navbar-t

interface UserProfileData {
    username: string;
    email: string;
    borrowedBooks: string[];
}

const UserProfile: React.FC = () => {
    const [userData, setUserData] = useState<UserProfileData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No authentication token found. Please log in.');
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/userprofile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile.');
                }

                const data: UserProfileData = await response.json();
                setUserData(data);
            } catch (err: any) {
                console.error('Error:', err.message);
                setError('Failed to load profile. Please try again later.');
            }
        };

        fetchUserProfile();
    }, [navigate]);

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
    }

    if (!userData) {
        return <div style={{ textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div
            style={{
                backgroundColor: '#242424', // Háttér szín
                minHeight: '100vh', // Minimum magasság a képernyő kitöltéséhez
                paddingTop: '60px', // Helyet hagyunk a fix Navbar-nak
            }}
        >
            {/* Navbar hozzáadása */}
            <Navbar />

            {/* Tartalom */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px',
                }}
            >
                <div
                    style={{
                        maxWidth: '600px',
                        textAlign: 'center',
                        fontFamily: 'Arial, sans-serif',
                        color: '#333',
                        backgroundColor: '#f9f9f9',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
                        User Profile
                    </h1>
                    <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                        <strong>Username:</strong> {userData?.username}
                    </p>
                    <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                        <strong>Email:</strong> {userData?.email}
                    </p>
                    <h2 style={{ marginTop: '30px', fontSize: '20px' }}>Borrowed Books</h2>
                    {userData?.borrowedBooks && userData.borrowedBooks.length > 0 ? (
                        <ul style={{ listStyleType: 'none', padding: 0, marginTop: '20px' }}>
                            {userData.borrowedBooks.map((title, index) => (
                                <li
                                    key={index}
                                    style={{
                                        padding: '10px',
                                        margin: '10px 0',
                                        backgroundColor: '#e8e8e8',
                                        borderRadius: '4px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {title}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: '#777', marginTop: '20px' }}>
                            You have not borrowed any books.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
