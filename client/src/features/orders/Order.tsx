import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Grid, Box, Pagination, Typography, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import agent from "../../app/api/agent";
import Spinner from "../../app/layout/Spinner";
import { Order } from "../../app/models/order";
import { useAppSelector } from "../../app/store/configureStore";
import { RemoveRedEye, Update } from '@mui/icons-material';
import UpdateOrderStatusDialog from "./UpdateOrderStatusDialog";
import { formatDate } from "../../app/util/util";
import { toast } from "react-toastify";

export default function Order() {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAppSelector(state => state.account);
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchOrders(currentPage, pageSize); // Fetch paginated data for admin
        } else {
            agent.Orders.list(user?.id)  // Fetch orders for a regular user
                .then(orders => setOrders(orders))
                .catch(error => console.log(error))
                .finally(() => setLoading(false));
        }
    }, [user?.id, currentPage]);

    const fetchOrders = (page: number, pageSize: number) => {
        setLoading(true);
        agent.Orders.page(page - 1, pageSize)
            .then(response => {
                setOrders(response.content);  // Set the orders data
                setTotalItems(response.totalElements);  // Set the total items count for pagination
            })
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    };

    if (loading) return <Spinner message="Loading orders..." />

    const handleViewClick = (order: Order) => {
        navigate('/order-details', { state: { order } });
    };

    const handleUpdateStatus = (id: number, value: string) => {
        agent.Orders.updateStatus(id, value)
            .then(response => {
                setOrders(prevOrders =>
                    prevOrders?.map(order =>
                        order.id === id ? { ...order, orderStatus: value } : order
                    ) || null
                );
                toast.success("Order status has been updated to " + response.orderStatus);
            })
            .catch(error => console.error('Error updating order status:', error));
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);  // Update the current page and trigger data fetch
    };

    const handleDialogOpen = (order: Order) => {
        setSelectedOrder(order);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedOrder(null);
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="order table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="right">Order Date</TableCell>
                            <TableCell align="right">Order Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders?.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell align="right">{order.total}</TableCell>
                                <TableCell align="right">{formatDate(order.orderDate)}</TableCell>
                                <TableCell align="right">{order.orderStatus}</TableCell>
                                <TableCell align="right">
                                    <Tooltip color="primary" sx={{ marginRight: 2 }} onClick={() => handleViewClick(order)} title="View">
                                        <RemoveRedEye />
                                    </Tooltip>
                                    {user?.role === 'ADMIN' && (
                                        <Tooltip color="warning" onClick={() => handleDialogOpen(order)} title="Update">
                                            <Update />
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {orders && user?.role === 'ADMIN' && (
                <Grid item xs={12}>
                    <Box mb={2} textAlign="center">
                        <Typography variant="subtitle1">
                            Displaying {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
                        </Typography>
                    </Box>
                    <Box mt={4} display="flex" justifyContent="center">
                        <Pagination
                            count={Math.ceil(totalItems / pageSize)}  // Total pages
                            color="primary"
                            page={currentPage}  // Current page
                            onChange={handlePageChange}  // Page change handler
                        />
                    </Box>
                </Grid>
            )}

            {selectedOrder && (
                <UpdateOrderStatusDialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    currentStatus={selectedOrder.orderStatus}
                    onUpdate={(newStatus) => handleUpdateStatus(selectedOrder.id, newStatus)}
                />
            )}
        </>
    );
}
