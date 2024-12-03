import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar.tsx";

const Rent = () => {
    const [title, setTitle] = useState(""); // Könyvcím mező
    const [response, setResponse] = useState(""); // Sikeres válasz
    const [error, setError] = useState(""); // Hibaüzenet
    const navigate = useNavigate();

    const handleBorrow = async () => {
        // Előző állapotok törlése
        setResponse("");
        setError("");

        if (!title) {
            setError("Kérlek, add meg a könyv címét!");
            return;
        }
        const token = localStorage.getItem('token'); // Kiszedjük a Local Storage-ből a JWT-t

        if (!token) {
            setError('Nincs érvényes token. Kérlek, jelentkezz be!');
            navigate('/login');
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/rent", {
                method: "PUT",
                credentials: "include",
                headers: {
                    'Authorization': `Bearer ${token}`, // A JWT-t odaadjuk a headernek
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title }),
            });

            if (res.status === 400) {
                setError("A könyvet már kikölcsönözték.");
            } else if (res.status === 404) {
                setError("A megadott könyv nem található.");
            } else if (res.ok) {
                const data = await res.json();
                setResponse(
                    `Sikeresen kikölcsönözted a "${data.title}" című könyvet! Vissza kell hozni: ${data.dueDate}.`
                );
            } else {
                setError("Ismeretlen hiba történt.");
            }
        } catch (err) {
            setError("Hálózati hiba történt.");
            localStorage.removeItem('token'); // Az invalid tokent töröljük
            navigate('/login'); // Visszaküldjük a login oldalra

        }
    };

    return (
        <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif", justifyContent: 'center', alignItems: 'center',}}>
            <Navbar />
            <h1>Könyv kölcsönzése</h1>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <label htmlFor="title" style={{ marginBottom: "0.5rem" }}>
                    Könyv címe:
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add meg a könyv címét"
                    style={{
                        padding: "0.5rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        marginBottom: "1rem",
                        width: "300px",
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                />
                <button
                    onClick={handleBorrow}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    Kölcsönzés
                </button>
            </div>

            {response && <p style={{ color: "green", marginTop: "1rem" }}>{response}</p>}
            {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        </div>
    );
};

export default Rent;
