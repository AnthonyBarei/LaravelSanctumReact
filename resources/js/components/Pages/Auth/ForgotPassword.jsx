// React
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// MUI
import { Avatar, Button, CssBaseline, TextField, Link, Box, Typography, Container, Alert, CircularProgress } from "@mui/material";
import Grid from '@mui/material/Grid2';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// Components
import Copyright from '../../Layouts/Copyright';
// Auth
import { useAuth } from '../../hooks/useAuth';
// Translations
import { useTranslation } from 'react-i18next';
// utils
import { displayApiErrors } from '../../utils';

export default function ForgotPassword() {
    const [alertSeverity, setAlertSeverity] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const { handleErrors } = useAuth();
    const { t } = useTranslation();

    const handleSubmit = (event) => {
        event.preventDefault();

        setLoading(true);
        setAlert(false);

        const formData = new FormData(event.currentTarget);

        const data = {
            email: formData.get('email'),
        };

        window.axios.post('/api/forgot-password', data).then((response) => {
            setAlertSeverity('success');
            setAlert(t(response.data.message));
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
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField margin="normal" required fullWidth id="email" label={t('email')} name="email" autoComplete="email" autoFocus/>

                    { alert && (
                        <Alert severity={alertSeverity} sx={{mt: 1}} onClose={() => { setAlert(false) }}>{alert}</Alert>
                    )}

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                        {!loading ? t('reset_my_password') : (<CircularProgress/>)}
                    </Button>

                    <Grid container>
                        <Grid >
                            <Link component={RouterLink} to="/login" variant="body2">{t('back_to_login')}</Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}
