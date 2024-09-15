import { Box, Container, Typography, Link, useTheme } from '@mui/material';

export default function Footer() {
    const theme = useTheme();

    return (
        <Box
            component="footer"
            sx={{
                py: 1,
                px: 1,
                mt: 2,
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.primary.main,
                color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.primary.contrastText,
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <Link href="#" color="inherit" sx={{ mx: 1 }}>
                        About Us
                    </Link>
                    <Link href="/contact" color="inherit" sx={{ mx: 1 }}>
                        Contact
                    </Link>
                    <Link href="#" color="inherit" sx={{ mx: 1 }}>
                        Privacy Policy
                    </Link>
                </Box>
                <Typography align='center' variant="body1" m={1}>
                    © {new Date().getFullYear()} Sports Center. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};


