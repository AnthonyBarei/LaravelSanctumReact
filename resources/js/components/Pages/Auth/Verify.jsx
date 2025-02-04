// React
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// MUI
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import DraftsIcon from '@mui/icons-material/Drafts';
// Components
import Copyright from '../../Layouts/Copyright';

import { useTranslation } from 'react-i18next';


export default function Verify() {
    const { t } = useTranslation();

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
                    <DraftsIcon/>
                </Avatar>
                <Typography component="h1" variant="h5" gutterBottom>
                    {t('verify_your_account')}
                </Typography>
                <Typography component={"h2"} variant='h6'>
                    {t('email_verfication_sent')}
                </Typography>
                <Typography component={"h2"} variant='h6'>
                    {t('verify_your_email')}
                </Typography>

                <Button component={RouterLink} to={"/login"} variant="contained" sx={{mt: 3}}>{t('login')}</Button>
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container>
    );
}
