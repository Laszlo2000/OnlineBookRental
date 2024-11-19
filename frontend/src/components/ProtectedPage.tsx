import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Protected: React.FC = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token'); // Kiszedjük a Local Storage-ből a JWT-t

      if (!token) {
        navigate('/login'); // Ha nem sikerült megkapni a tokent, akkor visszaküldjük a felhasználót a loginra
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/protected', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // A JWT-t odaadjuk a headernek
          },
        });

        if (!response.ok) {
          throw new Error('Unauthorized');
        }

        const data = await response.text(); // Feltételezzük, hogy megkapjuk a backendtől a szöveget 
        setMessage(data);
      } catch (error) {
        console.error('Error fetching protected data:', error);
        localStorage.removeItem('token'); // Az invalid tokent töröljük.
        navigate('/login'); // Visszaküldjül a loginra ha unauthorized
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div>
      <h1>Protected Page</h1>
      <p>{message}</p>
    </div>
  );
};

export default Protected;
