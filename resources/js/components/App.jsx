// React
import React from 'react';
import { Routes, Route } from "react-router-dom";
// Components
import Loading from './Layouts/Loading';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Home from './Pages/Home';
// Routes
import { PrivateRoutes, IsAuthenticatedRoutes } from './Routes/ProtectedRoutes';
// Auth
import { useAuth } from './hooks/useAuth';

const App = () => {
    const { loading } = useAuth();

    return (
        <>
            {!loading ? (
                <Routes>
                    <Route element={<IsAuthenticatedRoutes/>}>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                    </Route>
                    <Route element={<PrivateRoutes/>}>
                        <Route path="/" element={<Home/>}></Route>
                    </Route>
                </Routes>
            ) : (
                <Loading/>
            )}
        </>
    );

}

export default App;
