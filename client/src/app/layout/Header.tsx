import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography, Drawer, ListItemText, Button, Menu, MenuItem, Fade } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import { useEffect, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { logOut } from '../../features/account/accountSlice';

const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Store', path: '/store' },
    { title: 'Contact', path: '/contact' }
];
const adminLinks = [
    { title: 'All Products', path: '/all-product' },
    { title: 'Add Product', path: '/add-product' }
];
const accountLinks = [
    { title: 'Login', path: '/login' },
    { title: 'Register', path: '/register' }
];
const navStyles = {
    color: "inherit",
    typography: "h6",
    textDecoration: "none",
    "&:hover": {
        color: "secondary.main"
    },
    "&:active": {
        color: "text.secondary"
    }
};
interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
}

export default function Header({ darkMode, handleThemeChange }: Props) {
    const { basket } = useAppSelector(state => state.basket);
    const { user } = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        console.log('Basket Items:', basket?.items);
    }, [basket]);

    const itemCount = basket?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            {/* Only show the logo in the drawer */}
            <Box display='flex' justifyContent='center' alignItems='center' sx={{ my: 2 }}>
                <Box component={Link} to="/" display='flex' alignItems='center'>
                    <img src="images/file.png" alt="Sports Center Logo" style={{ width: '40px', height: '40px' }} />
                </Box>
            </Box>
            <List>
                <ListItem button>
                    <ListItemText primary={`Hi, ${user?.username.substring(0, 11)}`} />
                </ListItem>
                {user?.role === 'admin' ? (
                    adminLinks.map(({ title, path }) => (
                        <ListItem button component={NavLink} to={path} key={path}>
                            <ListItemText primary={title} />
                        </ListItem>
                    ))
                ) : (
                    navLinks.map(({ title, path }) => (
                        <ListItem button component={NavLink} to={path} key={path}>
                            <ListItemText primary={title} />
                        </ListItem>
                    ))
                )}
                {/* Show ShoppingCart and user menu links in the drawer when it's open */}
                <ListItem button component={Link} to="/basket">
                    <ListItemText primary="Shopping Cart" />
                </ListItem>
                {user ? (
                    <>
                        <ListItem button component={Link} to="/orders">
                            <ListItemText primary="My Orders" />
                        </ListItem>
                        <ListItem button onClick={() => dispatch(logOut())}>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </>
                ) : (
                    accountLinks.map(({ title, path }) => (
                        <ListItem button component={NavLink} to={path} key={path}>
                            <ListItemText primary={title} />
                        </ListItem>
                    ))
                )}
            </List>
        </Box>
    );

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                {/* Logo and Sports Center in Navbar */}
                <Box display='flex' alignItems='center'>
                    <Box
                        component={Link}
                        to="/"
                        display='flex'
                        alignItems='center'
                        sx={{
                            textDecoration: 'none', // Remove link underline
                            color: 'inherit' // Keep default color
                        }}
                    >
                        <img src="images/file.png" alt="Sports Center Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                        {/* Show text only on medium or larger screens */}
                        <Typography variant="h6" sx={{ display: { xs: 'none', md: 'block' } }}>
                            Sports Center
                        </Typography>
                    </Box>
                    <Switch checked={darkMode} onChange={handleThemeChange} />
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    {user?.role === 'admin' ? (
                        adminLinks.map(({ title, path }) => (
                            <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                                {title}
                            </ListItem>
                        ))
                    ) : (
                        navLinks.map(({ title, path }) => (
                            <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                                {title}
                            </ListItem>
                        ))
                    )}
                </Box>
                <Box display='flex' alignItems='center'>
                    {/* Hide ShoppingCart and user info when the drawer is active (on mobile) */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton component={Link} to='/basket' size='large' edge='start' color='inherit' sx={{ mr: 2 }}>
                            <Badge badgeContent={itemCount} color="secondary">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                        {user ? (
                            <>
                                <Button
                                    onClick={handleClick}
                                    color='inherit'
                                    sx={{ typography: 'h6' }}
                                >
                                    Hi, {user?.username.substring(0, 11)}
                                </Button>
                                <Menu anchorEl={anchorEl} open={open} onClose={handleClose} TransitionComponent={Fade}>
                                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                                    <MenuItem component={Link} to="/orders">My Orders</MenuItem>
                                    <MenuItem onClick={() => dispatch(logOut())}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            accountLinks.map(({ title, path }) => (
                                <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                                    {title}
                                </ListItem>
                            ))
                        )}
                    </Box>
                    {/* Show MenuIcon when screen size is small */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton color="inherit" edge="end" onClick={handleDrawerToggle}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Toolbar>
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    )
}
