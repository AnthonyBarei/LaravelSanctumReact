import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Copyright = (props) => {
    return (
        <Typography variant="caption" color="textSecondary" align="center" {...props}>
            {'Copyright © '}{new Date().getFullYear()}{' '}
            <Link color="inherit" href="https://www.linkedin.com/in/anthony-barei-768b76144/">
                Anthony Barei
            </Link>{'. '}
             All rights reserved.
        </Typography>
    );
}

export default Copyright;
