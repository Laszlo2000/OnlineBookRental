import React, { useState } from "react";

const Return: React.FC = () => {
    // Állapotok az űrlap és az üzenetek kezelésére
    const [title, setTitle] = useState<string>(""); // Könyvcím
    const [response, setResponse] = useState<string | null>(null); // Sikeres válasz
    const [error, setError] = useState<string | null>(null); // Hibaüzenet

    const handleReturn = async () => {
        // Előző válaszok és hibák törlése
        setResponse(null);
        setError(null);

        // Ellenőrizd, hogy megadtak-e címet
        if (!title.trim()) {
            setError("Kérlek, add meg a könyv címét!");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/return", {
                method: "PUT",
                credentials: "include",
                headers: {
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
        }
    };


    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
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