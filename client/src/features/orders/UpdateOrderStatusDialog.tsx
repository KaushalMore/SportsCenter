import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid } from '@mui/material';

interface UpdateOrderStatusDialogProps {
    open: boolean;
    onClose: () => void;
    currentStatus: string;
    onUpdate: (newStatus: string) => void;
}

const statusOptions = [
    'Pending',
    'PaymentReceived',
    'PaymentFailed',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Returned',
    'Refunded'
];

const UpdateOrderStatusDialog: React.FC<UpdateOrderStatusDialogProps> = ({ open, onClose, currentStatus, onUpdate }) => {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
    };

    const handleConfirm = () => {
        onUpdate(selectedStatus);
        onClose();
    };

    const isDisabled = (status: string) => {
        const currentIndex = statusOptions.indexOf(currentStatus);
        const statusIndex = statusOptions.indexOf(status);

        if (status === 'Shipped' && currentStatus !== 'PaymentReceived') return true;
        if (status === 'Delivered' && currentStatus !== 'Shipped') return true;
        if (status === 'Returned' && currentStatus !== 'Delivered') return true;
        if (status === 'Refunded' && currentStatus !== 'PaymentReceived' && currentStatus !== 'Cancelled') return true;
        if (status === 'Cancelled' && currentStatus === 'Delivered') return true;
        if (statusIndex < currentIndex) return true;

        return false;
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {statusOptions.map((status) => (
                        <Grid item xs={12} key={status}>
                            <Button
                                variant={selectedStatus === status ? 'contained' : 'outlined'}
                                color="primary"
                                fullWidth
                                onClick={() => handleStatusChange(status)}
                                disabled={isDisabled(status)}
                            >
                                {status}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleConfirm} color="primary">Confirm</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateOrderStatusDialog;
