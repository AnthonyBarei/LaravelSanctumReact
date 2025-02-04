// React
import { useState, useMemo, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
// MUI
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from "@mui/material/styles";
// Components
import App from './App';
import Loading from './Layouts/Loading';
// Theme
import { getDesignTokens, ColorModeContext } from './theme';
// Auth
import { AuthProvider } from './hooks/useAuth';

const Boot = () => {
    // Theme
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const choosedDarkMode = localStorage.getItem('darkmode');
    const [mode, setMode] = useState(choosedDarkMode || prefersDarkMode);
    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
    const colorMode = useMemo(() => ({ toggleColorMode: () => {
        setMode((prevMode) => {
            localStorage.setItem('darkmode', prevMode === 'light' ? 'dark' : 'light');
            return (prevMode === 'light' ? 'dark' : 'light')
        });
    }}), []);

    return (
        <div className='app'>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <BrowserRouter>
                        <AuthProvider>
                            <Suspense fallback={<Loading/>}>
                                <App/>
                            </Suspense>
                        </AuthProvider>
                    </BrowserRouter>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </div>
    );
}

export default Boot;

if (document.getElementById('app')) {
    const container = document.getElementById('app');
    const root = createRoot(container);
    root.render(<Boot/>);
}
