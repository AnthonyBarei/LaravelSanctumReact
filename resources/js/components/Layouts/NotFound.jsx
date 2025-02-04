// React
import { Link as RouterLink } from "react-router-dom";
// MUI
import { Box, Typography, Link } from "@mui/material";
// translation
import { useTranslation } from "react-i18next";


export default function NotFound({code = 404, message = false}) {
    const { t } = useTranslation();

    if (!message) message = t('not_found');

    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <Typography variant={'h1'} textAlign='center' sx={{ fontWeight: 'bold', fontSize: '10em' }} color='info.main'>{code}</Typography>
            <Typography gutterBottom variant={'h5'} textAlign='center'>{message}</Typography>
            <Link component={RouterLink} to="/" underline="none">{t('back_to_home')}</Link>
        </Box>
    );
}
