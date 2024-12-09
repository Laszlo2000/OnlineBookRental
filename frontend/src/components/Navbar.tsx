import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false); // Admin állapot
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown állapot
  const navigate = useNavigate();
  const location = useLocation(); // Figyeli az aktuális útvonalat

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/addbook/getrole", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const role = await response.text();
          setIsAdmin(role === "admin"); // Ellenőrizd, hogy admin-e
        } else {
          console.error("Failed to fetch role");
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    fetchUserRole();
  }, []);

  // Bezárja a dropdown menüt, ha az útvonal megváltozik
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Törli a tokent
    navigate("/login"); // Átirányít a login oldalra
  };

  return (
      <nav className="fixed top-0 left-0 w-full text-white z-50 flex items-center justify-between px-12 py-4 bg-[#336438] shadow-[0px_0px_10px_5px_rgba(0,0,0,0.4)]">
        <div className="text-lg font-bold">Online Book Rental</div>
        <div className="flex gap-6">
          <Link
              to="/userprofile"
              className="hover:bg-[#254729] px-2 py-2 rounded transition duration-300 hover:text-white"
          >
            User Profile
          </Link>
          <Link
              to="/rent"
              className="hover:bg-[#254729] px-2 py-2 rounded transition duration-300 hover:text-white"
          >
            Borrow
          </Link>
          <Link
              to="/return"
              className="hover:bg-[#254729] px-2 py-2 rounded transition duration-300 hover:text-white"
          >
            Return
          </Link>

          {isAdmin && (
              <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="hover:bg-[#254729] px-2 py-2 rounded transition duration-300"
                >
                  Admin
                </button>
                {isDropdownOpen && (
                    <div className="absolute mt-2 w-32 bg-[#336438] rounded shadow-lg z-50">
                      <Link
                          to="/admin/addbook"
                          onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
                          className="block px-4 py-2 hover:bg-[#254729] rounded transition duration-300 text-white"
                      >
                        Books
                      </Link>
                      <Link
                          to="/admin/users"
                          onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
                          className="block px-4 py-2 hover:bg-[#254729] rounded transition duration-300 text-white"
                      >
                        Users
                      </Link>
                    </div>
                )}
              </div>
          )}


          <button
              onClick={handleLogout}
              className="hover:bg-[#254729] px-2 py-2 rounded transition duration-300 hover:text-white"
          >
            Logout
          </button>
        </div>
      </nav>
  );
};

export default Navbar;