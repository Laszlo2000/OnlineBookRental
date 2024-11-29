import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedPage from './components/ProtectedPage';
import UserProfile from './components/UserProfile';
import AddBook from './components/AddNewBook';
import Rent from "./components/Rent.tsx";
import Return from "./components/Return.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/protected" element={<ProtectedPage />} />
                <Route path="/userprofile" element={<UserProfile />} />
                <Route path="/addbook" element={<AddBook />} />
                <Route path="/rent" element={<Rent />} />
                <Route path="/return" element={<Return />} />
            </Routes>
        </Router>
    );
};

export default App;
