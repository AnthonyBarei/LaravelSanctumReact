// React
import React, { useState } from 'react';
import { useParams } from "react-router-dom";

import { Link as RouterLink } from 'react-router-dom';
// MUI
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Alert, CircularProgress } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// Components
import Copyright from '../../Layouts/Copyright';
// Auth
import { useAuth } from '../../../AuthContext';
// Translations
import { useTranslation } from 'react-i18next';
// utils
import { displayApiErrors } from '../../utils';

export default function ResetPassword() {
    const { token } = useParams();
    const [alertSeverity, setAlertSeverity] = useState(false);
    const [alert, setAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const { handleErrors } = useAuth();
    const { t } = useTranslation();

    const handleSubmit = (event) => {
        event.preventDefault();

        setLoading(true);
        setAlert(false);

        const formData = new FormData(event.currentTarget);

        const data = {
            email: formData.get('email'),
            password: formData.get('password'),
            password_confirmation: formData.get('confirmPassword'),
        };

        window.axios.post('/api/reset-password/'+token, data).then((response) => {
            setAlertSeverity('success');
            setAlert(response.data.message);
            setLoading(false);
        }).catch((error) => {
            const errorMessages = displayApiErrors(error);
            if (errorMessages !== '') {
                setAlertSeverity('error');
                setAlert(t(errorMessages));
            }
            handleErrors(error.response.status, error.response.data.message);
            setLoading(false);
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
                    {t('dashboard.reset_password')}
                </Typography>

                {alert && alertSeverity === 'success' && (
                    <>
                        <Typography component={"h2"} variant='body1' gutterBottom sx={{mt:2}}>
                            Your password was modified successfully, please try logging into dashboard.
                        </Typography>

                        <Button fullWidth variant="contained" sx={{mt:2}} component={RouterLink} to="/login">Log in</Button>
                    </>
                )}

                {alertSeverity !== 'success' && (
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                        <TextField margin="normal" required fullWidth id="email" label={t('email')} name="email" autoComplete="email" autoFocus/>
                        <TextField margin="normal" required fullWidth id="password" label={t('password')} type="password" name="password" autoComplete="password" autoFocus/>
                        <TextField margin="normal" required fullWidth name="confirmPassword" label={t('password_confirm')} type="password" id="confirm-password" autoComplete="new-password"/>

                        { alert && (
                            <Alert severity={alertSeverity} sx={{mt: 1}} onClose={() => { setAlert(false) }}>{alert}</Alert>
                        )}

                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                            {!loading ? t('reset_my_password') : (<CircularProgress/>)}
                        </Button>

                        <Grid container>
                            <Grid item>
                                <Link component={RouterLink} to="/login" variant="body2">{t('back_to_login')}</Link>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}
