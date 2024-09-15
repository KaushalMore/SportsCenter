import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Grid, Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Order } from '../../app/models/order'; // Adjust the import path as needed
import agent from '../../app/api/agent';
import { useAppSelector } from '../../app/store/configureStore';
import { formatDate, formatPrice } from '../../app/util/util';

const OrderDetails: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAppSelector(state => state.account);
    const { order } = location.state as { order: Order };
    const [open, setOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'cancel' | 'return' | 'delete' | null>(null); // New state

    if (!order) {
        return <p>No order data available</p>;
    }

    const { id, basketId, shippingAddress, subTotal, deliveryFee, total, orderDate, orderStatus } = order;

    const handleCancel = async () => {
        try {
            await agent.Orders.cancel(user?.id, id);
            navigate('/orders'); // Redirect to the order list page after cancellation
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
        setOpen(false); // Close the dialog after action
    };

    const handleDelete = async () => {
        try {
            await agent.Orders.delete(id);
            navigate('/orders'); // Redirect to the order list page after deletion
        } catch (error) {
            console.error('Error deleting order:', error);
        }
        setOpen(false); // Close the dialog after action
    };

    const handleReturn = async () => {
        try {
            await agent.Orders.return(user?.id, id);
            navigate('/orders'); // Redirect to the order list page after return
        } catch (error) {
            console.error('Error returning order:', error);
        }
        setOpen(false); // Close the dialog after action
    };

    const handleClickOpen = (type: 'cancel' | 'return' | 'delete') => {
        setDialogType(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setDialogType(null); // Reset dialog type
    };

    return (
        <>
            <Container>
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Order Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Order ID: {id}</Typography>
                            <Typography>Basket ID: {basketId}</Typography>
                            <Typography>Order Date: {formatDate(orderDate)}</Typography>
                            <Typography>Order Status: {orderStatus}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Shipping Address</Typography>
                            <Typography>{shippingAddress.name}</Typography>
                            <Typography>{shippingAddress.address1}</Typography>
                            {shippingAddress.address2 && <Typography>{shippingAddress.address2}</Typography>}
                            <Typography>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipcode}</Typography>
                            <Typography>{shippingAddress.country}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Order Summary</Typography>
                            <Typography>Subtotal: {formatPrice(subTotal.toFixed(2))}</Typography>
                            <Typography>Delivery Fee: {formatPrice(deliveryFee.toFixed(2))}</Typography>
                            <Typography>Total: {formatPrice(total.toFixed(2))}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            {order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled" ?
                                <Button variant="contained" color="warning" onClick={() => handleClickOpen('cancel')}>
                                    Cancel Order
                                </Button> :
                                <Button variant="contained" color="warning" onClick={() => handleClickOpen('return')}>
                                    Return Order
                                </Button>}
                            {user?.role === 'ADMIN' &&
                                <Button sx={{ marginLeft: 2 }} variant="contained" color="error" onClick={() => handleClickOpen('delete')}>
                                    Delete Order
                                </Button>}
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            {/* Conditional Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {dialogType === 'cancel' && 'Confirm Order Cancel'}
                    {dialogType === 'return' && 'Confirm Order Return'}
                    {dialogType === 'delete' && 'Confirm Delete Order'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogType === 'cancel' && 'Are you sure you want to cancel this order?'}
                        {dialogType === 'return' && 'Are you sure you want to return this order?'}
                        {dialogType === 'delete' && 'Are you sure you want to delete this order?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Back</Button>
                    {dialogType === 'cancel' && <Button onClick={handleCancel} color="primary">Confirm</Button>}
                    {dialogType === 'return' && <Button onClick={handleReturn} color="primary">Confirm</Button>}
                    {dialogType === 'delete' && <Button onClick={handleDelete} color="primary">Confirm</Button>}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OrderDetails;
