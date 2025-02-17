import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import DraftsIcon from '@mui/icons-material/Drafts';
import Copyright from '../../Layouts/Copyright';
import { useAuth } from '../../../AuthContext';
import { Link } from '@mui/material';
import { useTranslation, Trans } from 'react-i18next';

export default function VerifyEmail() {
    const { token } = useParams();
    const [verified, setVerified] = useState(false);
    const { verify } = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        verify({ token })
            .then(() => setVerified(true))
            .catch(() => setVerified('error'));
    }, [token, verify]);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <DraftsIcon />
                </Avatar>
                {verified && (
                    <>
                        <Typography component="h1" variant="h5" gutterBottom>
                            {t('email_verified')}
                        </Typography>
                        <Typography component={"p"} variant='body1'>
                            <Trans i18nKey="verifyEmail.loginMessage">
                                You can now <Link component={RouterLink} to={"/login"} underline="none">login</Link> into your account.
                            </Trans>
                        </Typography>
                    </>
                )}

                {!verified && (
                    <>
                        <Typography component="h1" variant="h5">
                            {t('verification_error')}
                        </Typography>
                    </>
                )}
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container>
    );
}
