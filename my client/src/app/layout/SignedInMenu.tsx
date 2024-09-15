import { Button, Menu, Fade, MenuItem, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { logOut } from "../../features/acoount/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/configuresStore";
import { useState } from "react";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function SignedInMenu() {

    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.account);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <>
            <Button
                onClick={handleClick}
                color='inherit'
                sx={{ typography: 'h6' }}
            ><Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                Hi, {user?.username}
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} TransitionComponent={Fade}>
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem component={Link} to="/orders">My Orders</MenuItem>
                <MenuItem onClick={() => dispatch(logOut())}>Logout</MenuItem>
            </Menu>
        </>
    )
}