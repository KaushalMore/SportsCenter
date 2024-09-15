import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, Typography, Grid, Pagination,
  Tooltip
} from '@mui/material';
import agent from '../../app/api/agent';
import { Product } from '../../app/models/product';
import { useNavigate } from 'react-router-dom';
import { DeleteForever, Update } from '@mui/icons-material';
import { extractImageName, formatPrice } from '../../app/util/util';

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = (page: number) => {
    agent.Store.list(page, pageSize)
      .then(response => {
        console.log('Fetched products:', response);
        if (response && Array.isArray(response.content)) {
          setProducts(response.content);
          setTotalItems(response.totalElements);
        } else {
          console.error('Expected an array but got:', response);
        }
      })
      .catch(error => console.error('Error fetching products:', error));
  };

  const handleClickOpen = (id: number) => {
    setSelectedProductId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProductId(null);
  };

  const handleDelete = () => {
    if (selectedProductId !== null) {
      agent.Store.deleteProduct(selectedProductId.toString())
        .then(() => {
          setProducts(products.filter(product => product.id !== selectedProductId));
          handleClose();
        })
        .catch(error => console.error('Error deleting product:', error));
    }
  };

  const handleUpdate = (id: number) => {
    navigate(`/update/${id}`);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };


  return (
    <div>
      <Typography margin={2} component="h1" variant="h4" align='center'>All Products</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Picture</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell><img src={"/images/products/" + extractImageName(product)} alt={product.name} width="50" /></TableCell>
                <TableCell>{product.productBrand}</TableCell>
                <TableCell>{product.productType}</TableCell>
                <TableCell>
                  <Button onClick={() => handleUpdate(product.id)}>
                    <Tooltip title="Update"><Update color='warning' /></Tooltip>
                  </Button>
                  <Button onClick={() => handleClickOpen(product.id)}>
                    <Tooltip title="Delete"><DeleteForever color='error' /></Tooltip>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid item xs={12}>
        <Box mb={2} textAlign="center">
          <Typography variant="subtitle1">
            Displaying {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
          </Typography>
        </Box>
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination count={Math.ceil(totalItems / pageSize)} color="primary" onChange={handlePageChange} page={currentPage} />
        </Box>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductTable;
