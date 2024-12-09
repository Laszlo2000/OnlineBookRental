import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";

interface RegisteredUser {
    id: number;
    username: string;
    email: string;
    role: {
        id: string;
    };
}

const Users: React.FC = () => {
    const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
    // const [message, setMessage] = useState<string | null>(null);

    // Fetch registered users
    const fetchRegisteredUsers = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8080/users", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const users: RegisteredUser[] = await response.json();
                setRegisteredUsers(users);
            } else {
                throw new Error("Failed to fetch registered users.");
            }
        } catch (err: any) {
            console.error("Error:", err.message);
            console.error("Failed to load registered users. Please try again later.");
            // setMessage("Failed to load registered users. Please try again later.");
        }
    };

    // Handle role change
    const handleRoleChange = async (userId: number, newRoleId: number) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/${userId}/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ roleId: newRoleId }),
            });

            if (response.ok) {
                console.log("Role updated successfully");
                await fetchRegisteredUsers(); // Refresh the user list
            } else {
                console.error("Failed to update role");
            }
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };

    useEffect(() => {
        fetchRegisteredUsers();
    }, []);

    return (
        <div className="p-6 bg-[#d6efd8] min-h-screen">
            {registeredUsers.length > 0 ? (
                <div
                    className="max-w-7xl mx-auto mt-5 overflow-x-auto bg-[#80AF81] border-gray-700 rounded-xl shadow-[0px_0px_30px_rgba(0,0,0,0.3)]">
                    <Table>
                        <TableHeader className="bg-[#508D4E] border-b-2 border-[#D6EFD8]">
                            <TableRow>
                                <TableHead className="font-bold">ID</TableHead>
                                <TableHead className="font-bold">Username</TableHead>
                                <TableHead className="font-bold">Email</TableHead>
                                <TableHead className="font-bold">Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {registeredUsers.map((user) => (
                                <TableRow
                                    className="text-black font-bold border-[#D6EFD8] border-b-2"
                                    key={user.id}
                                >
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="w-[150px]"> {/* Adjust width here */}
                                        <select
                                            value={user.role.id}
                                            onChange={(e) =>
                                                handleRoleChange(user.id, Number(e.target.value))
                                            }
                                            className="bg-[#2A3B2D] hover:bg-[#202B21] text-white p-2 rounded w-full text-center text-base"
                                        >
                                            <option value="1">Admin</option>
                                            <option value="2">User</option>
                                        </select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </div>
            ) : (
                <p className="text-[#000] text-center mt-5"></p>
            )}
        </div>
    );
};

export default Users;
