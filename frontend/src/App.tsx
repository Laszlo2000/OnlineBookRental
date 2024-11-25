import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedPage from './components/ProtectedPage';
import UserProfile from './components/UserProfile';
import AddBook from './components/AddNewBook';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/protected" element={<ProtectedPage />} />
                <Route path="/userprofile" element={<UserProfile />} />
                <Route path="/addbook" element={<AddBook />} />
            </Routes>
        </Router>
    );
};

export default App;
