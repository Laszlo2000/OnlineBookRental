import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Több próbálkozás esetén ez reseteli az errort.

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const token = await response.text(); // A Backend elvileg plain text-ként küldi a JWT-t
      console.log('Token received:', token);

      localStorage.setItem('token', token); // Tároljuk a tokent a böngészőben.

      navigate('/userprofile');
    } catch (err: any) {
      console.error('Login error:', err.message);
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
      <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh', // Teljes magasság
            width: '100vw', // Teljes szélesség
            margin: 0,
            backgroundColor: 'inherit', // Az eredeti háttérszín megőrzése
          }}
      >
        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="username">Username:</label>
              <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    margin: '5px 0',
                    borderRadius: '4px',
                  }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="password">Password:</label>
              <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    margin: '5px 0',
                    borderRadius: '4px',
                  }}
              />
            </div>
            <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'black',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
            >
              Login
            </button>
          </form>
          {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
        </div>
      </div>
  );
};

export default Login;
