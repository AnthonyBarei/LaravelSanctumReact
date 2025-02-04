// React
import React from 'react';
import { Routes, Route } from "react-router-dom";
// Components
import Loading from './Layouts/Loading';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Home from './Pages/Home';
import Verify from './Pages/Auth/Verify';
import VerifyEmail from './Pages/Auth/VerifyEmail';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import ResetPassword from './Pages/Auth/ResetPassword';
import NotFound from './Layouts/NotFound';
// Routes
import { PrivateRoutes, IsAuthenticatedRoutes } from './Routes/ProtectedRoutes';
// Auth
import { useAuth } from './hooks/useAuth';
// translation
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: 'en',
        load: 'languageOnly', // load only the current language, not regional variants
    });

// Set the initial Accept-Language header
window.axios.defaults.headers.common['Accept-Language'] = i18n.language;
// Update the Accept-Language header whenever the language is changed
i18n.on('languageChanged', function(lang) {
    window.axios.defaults.headers.common['Accept-Language'] = lang;
});

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

                    <Route path="/verify-email" element={<Verify/>}/>
                    <Route path="/verify-email/:token" element={<VerifyEmail/>}/>
                    <Route path="/forgot-password" element={<ForgotPassword/>}/>
                    <Route path="/reset-password/:token" element={<ResetPassword/>}/>

                    <Route element={<PrivateRoutes/>}>
                        <Route path="/" element={<Home/>}></Route>
                    </Route>

                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            ) : (
                <Loading/>
            )}
        </>
    );

}

export default App;
