import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar.tsx";

const Return: React.FC = () => {
    const [title, setTitle] = useState<string>(""); 
    const [response, setResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleReturn = async () => {
        // Előző válaszok és hibák törlése
        setResponse(null);
        setError(null);

        if (!title.trim()) {
            setError("Kérlek, add meg a könyv címét!");
            return;
        }

        const token = localStorage.getItem('token'); // Kiszedjük a Local Storage-ből a JWT-t

        if (!token) {
          navigate('/login'); // Ha nem sikerült megkapni a tokent, akkor visszaküldjük a felhasználót a loginra
          return;
        }

        try {
            const res = await fetch("http://localhost:8080/return", {
                method: "PUT",
                credentials: "include",
                headers: {
                    'Authorization': `Bearer ${token}`, // A JWT-t odaadjuk a headernek
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title }),
            });

            if (res.status === 400) {
                setError("A könyvet már visszahozták.");
            } else if (res.status === 404) {
                setError("A megadott könyv nem található.");
            } else if (res.ok) {
                const data = await res.json();
                setResponse(
                    `Sikeresen visszahoztad a(z) "${data.title}" című könyvet!`
                );
            } else {
                setError("Ismeretlen hiba történt.");
            }
        } catch (err) {
            setError("Hálózati hiba történt.");
            localStorage.removeItem('token'); // Az invalid tokent töröljük.
            navigate('/login'); // Visszaküldjül a loginra ha unauthorized    
        }
    };


    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <Navbar/>
            <h2>Könyv visszaadása</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault(); // Az alapértelmezett viselkedés megelőzése
                    handleReturn(); // Kérés elküldése
                }}
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
                <div>
                    <label htmlFor="title" style={{ display: "block", marginBottom: "5px" }}>
                        Könyv címe:
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} // Könyvcím frissítése
                        required
                        placeholder="Add meg a könyv címét"
                        style={{
                            padding: "8px",
                            fontSize: "16px",
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Könyv visszaadása
                </button>
            </form>

            {/* Sikeres válasz vagy hibaüzenet megjelenítése */}
            {response && (
                <p style={{ color: "green", marginTop: "20px", fontWeight: "bold" }}>
                    {response}
                </p>
            )}
            {error && (
                <p style={{ color: "red", marginTop: "20px", fontWeight: "bold" }}>
                    {error}
                </p>
            )}
        </div>
    );
};
export default Return;