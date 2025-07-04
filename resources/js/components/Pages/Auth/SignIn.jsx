// filepath: /C:/Users/Antho/Documents/code/php/pmpp/resources/js/components/Pages/Auth/Login.jsx
// React
import * as React from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
// MUI
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Box, Typography, Container, Alert } from "@mui/material";
import Grid from '@mui/material/Grid2';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// Components
import Copyright from '../../Layouts/Copyright';
// Auth
import { useAuth } from '../../../AuthContext';
// Translation
import { useTranslation } from 'react-i18next';

export default function SignIn() {
    const location = useLocation();
    const navigate = useNavigate();
    const { authed, login } = useAuth();
    const [alert, setAlert] = React.useState(false);
    const { t } = useTranslation();

    const authenticatedCallback = () => {
        let {from} = location.state || {from: {pathname: '/'}}
        navigate(from, { replace: true });
    }

    React.useEffect(() => { if (authed) authenticatedCallback(); }, [authed]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const loginCredentials = {
            email: formData.get('email'),
            password: formData.get('password'),
        };

        try {
            await login(loginCredentials);
            authenticatedCallback();
        } catch (error) {
            console.log(error.message);
            setAlert(error.message);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {t('sign_in')}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus size="small"/>
                    <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" size="small"/>

                    <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me"/>

                    {alert && (<Alert severity="error" sx={{ mb: 2 }}>{alert}</Alert>)}

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 2 }}>
                        {t('sign_in')}
                    </Button>

                    <Grid container direction="row" sx={{justifyContent: "space-between"}}>
                        <Grid>
                            <Link component={RouterLink} to="/forgot-password" variant="body2">{t('forgot_password')}</Link>
                        </Grid>
                        <Grid>
                            <Link component={RouterLink} to="/sign-up" variant="body2">{t('dont_have_account')}</Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}
