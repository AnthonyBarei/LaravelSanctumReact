import axios from 'axios';
import React, { useState, createContext, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Create the context
const AuthContext = createContext({
    authed: false,
    setAuthed: (authed: boolean) => {},
    loading: true,
    user: {},
    login: (data: object) => {},
    logout: (config: object) => {},
    register: (config: object) => {},
    verify: (data: object) => {},
    handleErrors: (status: number, message: string) => {},
});

export const AuthProvider = ({ children }) => {
    // Using the useState hook to keep track of the value authed (if a user is logged in)
    const [authed, setAuthed] = useState<boolean>(false);
    // Store new value to indicate the call has not finished. Default to true
    const [loading, setLoading] = useState<boolean>(true);
    // A state that defines user values (email, name, token, is_admin)
    const [user, setUser] = useState({
        id: null,
        name: null,
        email: null,
        token: null,
        is_admin: 0,
        client_id: null,
    });
    const location = useLocation();
    const navigate = useNavigate();

    // Runs once when the component first mounts
    useEffect(() => { loginCheck(); }, []);

    const handleErrors = (status: number, message: string) => {
        if (status === 401 && message == "errors.unauthenticated") {
            logout();
        }
        if (status === 419 && message == "errors.token_mismatch") {
            logout();
        }
    }

    /* ** Async Promises functions ** */
    const loginCheck = async (): Promise<void> => {
        await loginCheckAsync().then((logged) => {
            if (logged) {
                initUser();
            }
        }).catch((error) => {
            setAuthed(false);
            setLoading(false);
        });
    };

    const initUser = async (): Promise<void> => {
        const config = { headers: { 'Authorization': 'Bearer ' + user.token }, };

        await initUserAsync(config).then((activeUser) => {
            if (activeUser) {
                setAuthed(true);
                setLoading(false);
            }
        }).catch((error) => {
            setAuthed(false);
            setLoading(false);
        });
    };

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

    const logout = async (config: object={headers: {'Authorization': 'Bearer ' + user.token}}): Promise<void> => {
        await logoutAsync(config).then((logged_out) => {
            if (logged_out) {
                setAuthed(false);
                logoutCallback();
            }
        }).catch((error) => {
            if (!user.token) {
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

    /* ** Async API calls functions ** */

    // Mock call to an authentication endpoint
    const loginCheckAsync = async (): Promise<string> => {
        return new Promise((resolve, reject) => {
            // get localstorage lang if exists
            const lang = localStorage.getItem('i18nextLng') === 'fr-FR' ? 'fr' : 'en';

            axios.get('/api/authenticated', { params: { lang: lang} }).then((response) => {
                const resp = response.data;
                resolve(resp.message);
            }).catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    const resp = error.response.data;

                    if (resp.success === false) {
                        // print error message here
                        reject(resp.data.error);
                    } else {
                        console.log(resp);
                    }
                } else {
                    // Something happened in setting up the request that triggered an Error
                    reject(error.message);
                }
            });
        });
    };

    const initUserAsync = async (config: object): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.get('/api/me', config).then((response) => {
                let resp = response.data;
                setUser(resp.user);
                resolve(resp.message);
            }).catch((error) => {
                console.log(error);
            });
        });
    };

    // Mock Async Login API call.
    const loginAsync = async (data: object): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.post('/api/login', data).then((response) => {
                let resp = response.data;
                setUser(resp.data);
                resolve(resp.message);
            }).catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    var resp = error.response.data;

                    if (resp.success === false) {
                        // print error message here
                        reject(resp.data.error);
                    } else {
                        console.log(resp);
                    }
                } else {
                    // Something happened in setting up the request that triggered an Error
                    reject(error.message);
                }
            });
        });
    };

    // Mock Async Logout API call.
    const logoutAsync = async (config: object): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.post('/api/logout', config).then((response) => {
                let resp = response.data;
                resolve(resp.message);
            }).catch((error) => {
                console.log(error);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    const resp = error.response.data;

                    if (resp.success === false) {
                        // print error message here
                        reject(resp.data.error);
                    } else {
                        if (resp.message) {
                            resolve(resp.message);
                        } else {
                            console.log(resp);
                        }
                    }
                } else {
                    // Something happened in setting up the request that triggered an Error
                    reject(error.message);
                }
            });
        });
    };

    const resgisterAsync = async(data: object): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.post('/api/register', data).then((response) => {
                let resp = response.data;
                setUser(resp.data);
                resolve(resp.message);
            }).catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    let resp = error.response.data;

                    if (resp.success === false) {
                        // print error message here
                        reject(resp.data[Object.keys(resp.data)[0]][0]);
                    } else {
                        console.log(resp);
                    }
                } else {
                    // Something happened in setting up the request that triggered an Error
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
                    // The request was made and the server responded with a status code
                    let resp = error.response.data;

                    if (resp.success === false) {
                        // print error message here
                        reject(resp.data[Object.keys(resp.data)[0]][0]);
                    } else {
                        console.log(resp);
                    }
                } else {
                    // Something happened in setting up the request that triggered an Error
                    reject(error.message);
                }
            });
        });
    }

    return (
        // Using the provider so that ANY component in our application can use the values that we are sending.
        <AuthContext.Provider value={{ authed, setAuthed, loading, user, login, logout, register, verify, handleErrors }}>
            {children}
        </AuthContext.Provider>
    );
};

// Finally creating the custom hook
export const useAuth = () => useContext(AuthContext);
