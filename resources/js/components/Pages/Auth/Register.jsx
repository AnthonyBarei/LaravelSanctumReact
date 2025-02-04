// React
import * as React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// MUI
import { Avatar, Button, CssBaseline, TextField, Link, Box, Typography, Container, Alert } from "@mui/material";
import Grid from '@mui/material/Grid2';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// Components
import Copyright from '../../Layouts/Copyright';
// Auth
import { useAuth } from '../../hooks/useAuth';
// Translation
import { useTranslation } from 'react-i18next';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [alert, setAlert] = React.useState(false);
    const { t } = useTranslation();

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const registerData = {
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            email: formData.get('email'),
            password: formData.get('password'),
            password_confirmation: formData.get('password_confirmation'),
        };

        register(registerData).then(() => {
            navigate('/login');
        }).catch((error) => {
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
                    {t('sign_up')}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth id="firstname" label={t('firstname')} name="firstname" autoComplete="firstname" autoFocus size="small"/>
                    <TextField margin="normal" required fullWidth id="lastname" label={t('lastname')} name="lastname" autoComplete="lastname" autoFocus size="small"/>
                    <TextField margin="normal" required fullWidth id="email" label={t('email')} name="email" autoComplete="email" size="small"/>
                    <TextField margin="normal" required fullWidth name="password" label={t('password')} type="password" id="password" autoComplete="current-password" size="small"/>
                    <TextField margin="normal" required fullWidth name="password_confirmation" label={t('password_confirm')} type="password" id="password_confirmation" autoComplete="current-password" size="small"/>

                    {alert && (<Alert severity="error" sx={{ mb: 2 }}>{alert}</Alert>)}

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
                        {t('sign_up')}
                    </Button>

                    <Grid container direction="row" sx={{justifyContent: "space-between"}}>
                        <Grid>
                            <Link component={RouterLink} to="/login" variant="body2">{t('already_have_account')}</Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}
