import Slider from "react-slick";
import { Box, Container, Grid, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { CardGiftcard, LocalShipping, Lock, Replay, SupportAgent, TrackChanges } from "@mui/icons-material";

const services = [
    { icon: <LocalShipping />, title: "Free Delivery", description: "Get free delivery on all orders." },
    { icon: <Replay />, title: "Easy Returns", description: "Product returns without any questions." },
    { icon: <SupportAgent />, title: "24/7 Support", description: "We offer 24/7 customer support." },
    { icon: <Lock />, title: "Secure Payments", description: "All transactions are secure and encrypted." },
    { icon: <TrackChanges />, title: "Order Tracking", description: "Track your orders in real-time." },
    { icon: <CardGiftcard />, title: "Gift Wrapping", description: "Gift wrapping services for special occasions." },
    // { icon: <Loyalty />, title: "Loyalty Programs", description: "Earn points and discounts on your purchases." },
    // { icon: <Star />, title: "Personalized Recommendations", description: "Get product recommendations based on your preferences." }
];

const heroImages = [
    "images/hero2.jpg",
    "images/hero3.jpg",
    "images/hero4.jpg",
    "images/hero5.jpg",
];

const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000
};

export default function HomePage() {
    return (
        <>
            <Box sx={{ width: '100%', overflow: 'hidden', mb: 4}}>
                <Slider {...sliderSettings}>
                    {heroImages.map((image, index) => (
                        <Box key={index} sx={{ cursor: 'pointer' }} onClick={() => window.location.href = '/store'}>
                            <img src={image} alt={`Hero ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                        </Box>
                    ))}
                </Slider>
            </Box>
            <Container>
                <Box sx={{ textAlign: 'center', my: 4 }}>
                    <Typography variant="h4" sx={{ my: 2 }}>
                        Welcome to Sports Center
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4 }}>
                        Your one-stop shop for all sports equipment and apparel.
                    </Typography>
                    <Button variant="contained" color="primary" component={Link} to="/store">
                        Shop Now
                    </Button>
                </Box>
                <Grid container spacing={4} mb={2}>
                    {services.map((service, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Box sx={{ textAlign: 'center' }}>
                                {service.icon}
                                <Typography variant="h6" sx={{ mt: 2 }}>
                                    {service.title}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    {service.description}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>

    );
}