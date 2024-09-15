import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
// import axios from "axios";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFoundError";
import Spinner from "../../app/layout/Spinner";
import { useAppDispatch, useAppSelector } from "../../app/store/configuresStore";
import { LoadingButton } from "@mui/lab";

export default function ProductDetails() {
    const { basket } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const [product, seteProduct] = useState<Product | null>();
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const item = basket?.items.find(i => i.id === product?.id);

    const extractImageName = (item: Product): string | null => {
        if (item && item.pictureUrl) {
            const parts = item.pictureUrl.split('/');
            if (parts.length > 0) {
                return parts[parts.length - 1];
            }
        }
        return null;
    }
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-In', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(price);
    }

    // useEffect(() => {
    //     axios.get(`http://localhost:8081/api/product/${id}`)
    //         .then(response => seteProduct(response.data))
    //         .catch(error => console.error(error))
    //         .finally(() => setLoading(false));
    // }, [id]);
    useEffect(() => {
        id && agent.Store.details(parseInt(id))
            .then(response => seteProduct(response))
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
    }, [id]);

    const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (!isNaN(value) && value > 0) {
            setQuantity(value);
        }
    };

    const updateQuantity = async () => {
        try {
            setSubmitting(true);
            const newItem = {
                ...product!,
                quantity: quantity
            };
            if (item) {
                const quantityDifference = quantity - item.quantity;
                if (quantityDifference > 0) {
                    // Increment the quantity of an existing item in the basket
                    await agent.Baskets.incrementItemQuantity(item.id, quantityDifference, dispatch);
                } else if (quantityDifference < 0) {
                    // Decrement the quantity of an existing item in the basket
                    await agent.Baskets.decrementItemQuantity(item.id, Math.abs(quantityDifference), dispatch);
                }
            } else {
                // Add a new item to the basket
                await agent.Baskets.addItem(newItem, dispatch);
            }
            setSubmitting(false);
        } catch (error) {
            console.error("Failed to update quantity:", error);
            // Handle error
            setSubmitting(false);
        }
    };
    // if (loading) return <h3>Loading Product...</h3>
    // if (!product) return <h3>Product Not Found</h3>
    if (loading) return <Spinner message="Loading Product..." />
    if (!product) return <NotFound />

    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={"/images/products/" + extractImageName(product)} alt={product.name} style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{product.name}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography gutterBottom color='secondary' variant="h4">{formatPrice(product.price)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.productType}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.productBrand}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            onChange={inputChange}
                            variant='outlined'
                            type='number'
                            label='Quantity in Cart'
                            fullWidth
                            value={quantity}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                            sx={{ height: '55px' }}
                            color='primary'
                            size='large'
                            variant='contained'
                            fullWidth
                            loading={submitting}
                            onClick={updateQuantity}
                        >
                            {item ? 'Update Quantity' : 'Add to Cart'}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}