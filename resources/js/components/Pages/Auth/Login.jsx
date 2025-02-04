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
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    const { authed, login } = useAuth();
    const [alert, setAlert] = React.useState(false);

    const authenticatedCallback = () => {
        let {from} = location.state || {from: {pathname: '/'}}
        navigate(from, { replace: true });
    }

    React.useEffect(() => { if (authed) authenticatedCallback(); }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const loginCredentials = {
            email: formData.get('email'),
            password: formData.get('password'),
        };

        login(loginCredentials).then(authenticatedCallback).catch((error) => {
            console.log(error.message);
            setAlert(error.message);
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus size="small"/>
                    <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" size="small"/>

                    <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me"/>

                    {alert && (<Alert severity="error" sx={{ mb: 2 }}>{alert}</Alert>)}

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 2 }}>
                        Sign In
                    </Button>

                    <Grid container direction="row" sx={{justifyContent: "space-between"}}>
                        <Grid>
                            <Link href="#" variant="body2">Forgot password?</Link>
                        </Grid>
                        <Grid>
                            <Link component={RouterLink} to="/register" variant="body2">{"Don't have an account? Sign Up"}</Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}
