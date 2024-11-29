import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState(false); // Admin állapot
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/addbook/getrole', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const role = await response.text();
                    setIsAdmin(role === 'admin'); // Ellenőrizd, hogy admin-e
                } else {
                    console.error('Failed to fetch role');
                }
            } catch (error) {
                console.error('Error fetching role:', error);
            }
        };

        fetchUserRole();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Törli a tokent
        navigate('/login'); // Átirányít a login oldalra
    };

    return (
        <nav
            style={{
                display: 'flex',
                justifyContent: 'space-between', // Balra logó, jobbra linkek
                alignItems: 'center', // Függőleges középre igazítás
                backgroundColor: '#242424',
                color: '#fff',
                padding: '10px 50px',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
                boxSizing: 'border-box',
            }}
        >
            {/* Logo */}
            <div
                style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                }}
            >
                Online Book Rental
            </div>

            {/* Navigation Links */}
            <div
                style={{
                    display: 'flex',
                    gap: '30px',
                }}
            >
                <Link
                    to="/protected"
                    style={{
                        color: '#fff',
                        textDecoration: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#007BFF')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                >
                    Protected
                </Link>
                <Link
                    to="/userprofile"
                    style={{
                        color: '#fff',
                        textDecoration: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#007BFF')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                >
                    User Profile
                </Link>
                {isAdmin && ( // Csak adminoknak jelenik meg
                    <Link
                        to="/addbook"
                        style={{
                            color: '#fff',
                            textDecoration: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = '#007BFF')
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = 'transparent')
                        }
                    >
                        Add Book
                    </Link>
                )}
                <Link
                    to="/rent"
                    style={{
                        color: '#fff',
                        textDecoration: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#007BFF')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                >
                    Rent
                </Link>
                <Link
                    to="/return"
                    style={{
                        color: '#fff',
                        textDecoration: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#007BFF')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                >
                    Return
                </Link>
                <button
                    onClick={handleLogout}
                    style={{
                        color: '#fff',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#007BFF')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
