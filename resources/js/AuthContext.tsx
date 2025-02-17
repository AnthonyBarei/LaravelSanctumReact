import axios from 'axios';
import React, { useState, createContext, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from './authObserver';

export interface User {
    id: number | null;
    name: string | null;
    email: string | null;
    token: string | null;
    is_admin: number;
    client_id: number | null;
}

interface AuthContextType {
    authed: boolean;
    setAuthed: (authed: boolean) => void;
    loading: boolean;
    session: User | null;
    login: (data: object) => Promise<void>;
    logout: (config?: object) => Promise<void>;
    register: (data: object) => Promise<void>;
    verify: (data: object) => Promise<void>;
    handleErrors: (status: number, message: string) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType>({
    authed: false,
    setAuthed: () => {},
    loading: true,
    session: null,
    login: async () => {},
    logout: async () => {},
    register: async () => {},
    verify: async () => {},
    handleErrors: () => {},
});

export const AuthProvider = ({ children }) => {
    const [authed, setAuthed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [session, setSession] = useState<User | null>(() => {
        const savedSession = localStorage.getItem('session');
        return savedSession ? JSON.parse(savedSession) : null;
    });
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            setAuthed(true);
            setLoading(false);
        } else {
            const unsubscribe = onAuthStateChanged((user) => {
                if (user) {
                    const newSession = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        token: user.token,
                        is_admin: user.is_admin,
                        client_id: user.client_id,
                    };
                    setSession(newSession);
                    localStorage.setItem('session', JSON.stringify(newSession));
                    setAuthed(true);
                } else {
                    setSession(null);
                    localStorage.removeItem('session');
                    setAuthed(false);
                }
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [session]);

    const handleErrors = (status: number, message: string) => {
        if (status === 401 && message == "errors.unauthenticated") {
            logout();
        }
        if (status === 419 && message == "errors.token_mismatch") {
            logout();
        }
    }

    const login = async (data: object): Promise<void> => {
        await loginAsync(data).then((logged_in) => {
            if (logged_in) {
                setAuthed(true);
            }
        }).catch((error) => {
            throw new Error(error);
        });
    };

    const logoutCallback = () => {
        let {from} = location.state || {from: {pathname: '/login'}}
        navigate(from, { replace: true });
    };

    const logout = async (config: object={headers: {'Authorization': 'Bearer ' + session?.token}}): Promise<void> => {
        await logoutAsync(config).then((logged_out) => {
            if (logged_out) {
                setAuthed(false);
                setSession(null);
                localStorage.removeItem('session');
                logoutCallback();
            }
        }).catch((error) => {
            if (!session?.token) {
                throw new Error('Token not found.');
            } else {
                throw new Error(error);
            }

            logoutCallback();
        });
    };

    const register = async (data: object): Promise<void> => {
        await resgisterAsync(data).then((registered) => {
            console.log(registered);
        }).catch((error) => {
            throw new Error(error);
        });
    };

    const verify = async (data: object): Promise<void> => {
        await verifyAsync(data).then((verified) => {
            console.log(verified);
        }).catch((error) => {
            throw new Error(error);
        })
    };

    const loginCheckAsync = async (): Promise<string> => {
        return new Promise((resolve, reject) => {
            const lang = localStorage.getItem('i18nextLng') === 'fr-FR' ? 'fr' : 'en';

            axios.get('/api/authenticated', { params: { lang: lang} }).then((response) => {
                const resp = response.data;
                resolve(resp.message);
            }).catch((error) => {
                if (error.response) {
                    const resp = error.response.data;

                    if (resp.success === false) {
                        reject(resp.data.error);
                    } else {
                        console.log(resp);
                    }
                } else {
                    reject(error.message);
                }
            });
        });
    };

    const initUserAsync = async (config: object): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.get('/api/me', config).then((response) => {
                let resp = response.data;
                setSession(resp.user);
                localStorage.setItem('session', JSON.stringify(resp.user));
                resolve(resp.message);
            }).catch((error) => {
                console.log(error);
            });
        });
    };

    const loginAsync = async (data: object): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.post('/api/login', data).then((response) => {
                let resp = response.data;
                setSession(resp.data);
                localStorage.setItem('session', JSON.stringify(resp.data));
                resolve(resp.message);
            }).catch((error) => {
                if (error.response) {
                    var resp = error.response.data;

                    if (resp.success === false) {
                        reject(resp.data.error);
                    } else {
                        console.log(resp);
                    }
                } else {
                    reject(error.message);
                }
            });
        });
    };

    const logoutAsync = async (config: object): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.post('/api/logout', config).then((response) => {
                let resp = response.data;
                resolve(resp.message);
            }).catch((error) => {
                console.log(error);
                if (error.response) {
                    const resp = error.response.data;

                    if (resp.success === false) {
                        reject(resp.data.error);
                    } else {
                        if (resp.message) {
                            resolve(resp.message);
                        } else {
                            console.log(resp);
                        }
                    }
                } else {
                    reject(error.message);
                }
            });
        });
    };

    const resgisterAsync = async(data: object): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.post('/api/register', data).then((response) => {
                let resp = response.data;
                setSession(resp.data);
                localStorage.setItem('session', JSON.stringify(resp.data));
                resolve(resp.message);
            }).catch((error) => {
                if (error.response) {
                    let resp = error.response.data;

                    if (resp.success === false) {
                        reject(resp.data[Object.keys(resp.data)[0]][0]);
                    } else {
                        console.log(resp);
                    }
                } else {
                    reject(error.message);
                }
            });
        });
    };

    const verifyAsync = async (data: object): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.post('/api/verify-email', data).then((response) => {
                const resp = response.data;
                resolve(resp.message);
            }).catch((error) => {
                if (error.response) {
                    let resp = error.response.data;

                    if (resp.success === false) {
                        reject(resp.data[Object.keys(resp.data)[0]][0]);
                    } else {
                        console.log(resp);
                    }
                } else {
                    reject(error.message);
                }
            });
        });
    }

    return (
        <AuthContext.Provider value={{ authed, setAuthed, loading, session, login, logout, register, verify, handleErrors }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
