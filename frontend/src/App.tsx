import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import AddBook from './components/AddNewBook';
import Rent from "./components/Rent.tsx";
import Return from "./components/Return.tsx";
import Navbar from './components/Navbar.tsx';

const App: React.FC = () => {

    return (
        <Router>
            <NavBarWithConditionalRender/>
            <Routes>
                <Route path='/' element={<UserProfile/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/userprofile" element={<UserProfile />} />
                <Route path="/addbook" element={<AddBook />} />
                <Route path="/rent" element={<Rent />} />
                <Route path="/return" element={<Return />} />
            </Routes>
        </Router>
    );
};

const NavBarWithConditionalRender: React.FC = () => { //A /login és /register enpointokon nem jelenik meg a navbar
    const location = useLocation();
    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }
    return <Navbar />;
};

export default App;
