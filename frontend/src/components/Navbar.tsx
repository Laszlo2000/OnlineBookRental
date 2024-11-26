import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav
            style={{
                display: 'flex',
                justifyContent: 'space-between', // Balra logó, jobbra linkek
                alignItems: 'center', // Függőleges középre igazítás
                backgroundColor: '#242424',
                color: '#fff',
                padding: '10px 50px', // Több hely bal és jobb oldalon
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%', // A navbar szélessége a teljes képernyő
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                zIndex: 1000, // Mindig legyen felül
                boxSizing: 'border-box', // A padding ne tolja ki a szélességet
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
                    gap: '30px', // Távolság a linkek között
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
            </div>
        </nav>
    );
};

export default Navbar;
