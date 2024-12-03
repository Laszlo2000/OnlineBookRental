import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
<div className="bg-zinc-850 min-h-screen pt-16">
  {/* Tartalom */}
  <div className="flex justify-center items-center p-5">
    <div className="max-w-xl text-center font-sans text-zinc-800 bg-zinc-100 p-6 rounded-lg shadow-lg">
      <h1 className="mb-5 text-2xl font-bold">User Profile</h1>
      <p className="text-lg mb-2">
        <strong>Username:</strong> {userData?.username}
      </p>
      <p className="text-lg mb-2">
        <strong>Email:</strong> {userData?.email}
      </p>
      <h2 className="mt-8 text-xl">Borrowed Books</h2>
      {userData?.borrowedBooks && userData.borrowedBooks.length > 0 ? (
        <ul className="list-none p-0 mt-5">
          {userData.borrowedBooks.map((title, index) => (
            <li
              key={index}
              className="p-3 my-2 bg-gray-200 rounded-md text-center"
            >
              {title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-5">
          You have not borrowed any books.
        </p>
      )}
    </div>
  </div>
</div>

    );
};

export default UserProfile;
