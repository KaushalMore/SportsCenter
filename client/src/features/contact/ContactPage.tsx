import { Box, Container, Typography, TextField, Button, Grid, useTheme } from '@mui/material';

export default function ContactPage() {
    // const theme = useTheme();

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
                We'd love to hear from you! Please fill out the form below and we'll get in touch with you as soon as possible.
            </Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="name"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="subject"
                            label="Subject"
                            name="subject"
                            autoComplete="subject"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="message"
                            label="Message"
                            name="message"
                            multiline
                            rows={4}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" fullWidth variant="contained" color="primary">
                            Send Message
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" component="h2">
                    Contact Information
                </Typography>
                <Typography variant="body1">
                    Email: contact@sportscenter.com
                </Typography>
                <Typography variant="body1">
                    Phone: +1 (123) 456-7890
                </Typography>
                <Typography variant="body1">
                    Address: 123 Sports Center Lane, City, Country
                </Typography>
            </Box>
        </Container>
    );
};

