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
  <div className="flex justify-center mt-6">
    <div className="bg-[#80AF81] rounded-xl shadow-lg p-6 w-96">
      <h1 className="text-xl font-bold mb-4 text-[#000] text-center">User Profile</h1>
      <p className="text-lg mb-2 text-[#000] text-center">
        <strong>Username:</strong> {userData?.username}
      </p>
      <p className="text-lg mb-2 text-[#000] text-center">
        <strong>Email:</strong> {userData?.email}
      </p>
      <h2 className="mt-8 text-xl font-bold text-[#000] text-center">Borrowed Books</h2>
      {userData?.borrowedBooks && userData.borrowedBooks.length > 0 ? (
        <ul className="list-none p-0 mt-5">
          {userData.borrowedBooks.map((title, index) => (
            <li
              key={index}
              className="p-3 my-2 bg-[#2a3b2d] hover:bg-[#202B21] rounded-md text-center"
            >
              {title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-black mt-5 text-center">
          You have not borrowed any books.
        </p>
      )}
    </div>
  </div>
</div>

    );
};

export default UserProfile;
