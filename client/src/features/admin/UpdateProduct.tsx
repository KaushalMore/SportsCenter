import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Container, CssBaseline, Typography, FilledInput, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { toast } from 'react-toastify';
import agent from '../../app/api/agent';

const UpdatePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState({ name: '', description: '', price: 0, brandId: '', typeId: '' });
    const [photo, setPhoto] = useState<File | null>(null);
    const [brands, setBrands] = useState<{ id: number, name: string }[]>([]);
    const [types, setTypes] = useState<{ id: number, name: string }[]>([]);
    const [updatedFields, setUpdatedFields] = useState<{ [key: string]: any }>({});
    const [newBrand, setNewBrand] = useState('');
    const [newType, setNewType] = useState('');
    const [openBrandDialog, setOpenBrandDialog] = useState(false);
    const [openTypeDialog, setOpenTypeDialog] = useState(false);

    useEffect(() => {
        // Fetch product details
        if (id) {
            agent.Store.details(parseInt(id))
                .then(response => setProduct(response))
                .catch(error => console.error('Error fetching product:', error));
        }

        // Fetch brands and types
        const fetchBrandsAndTypes = async () => {
            try {
                const brandsResponse = await agent.Store.brands();
                const typesResponse = await agent.Store.types();
                setBrands(brandsResponse.filter(brand => brand.id !== 0));
                setTypes(typesResponse.filter(type => type.id !== 0));
            } catch (error) {
                console.error('Error fetching brands and types:', error);
            }
        };

        fetchBrandsAndTypes();

    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name!]: value });
        setUpdatedFields({ ...updatedFields, [name!]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPhoto(e.target.files[0]);
            setUpdatedFields({ ...updatedFields, photo: e.target.files[0] });
        }
    };

    const handleAddBrand = async () => {
        try {
            const response = await agent.Store.createBrand({ name: newBrand });
            setBrands([...brands, response]);
            setNewBrand('');
            setOpenBrandDialog(false);
        } catch (error) {
            toast.error("Failed to add brand");
        }
    };

    const handleAddType = async () => {
        try {
            const response = await agent.Store.createType({ name: newType });
            setTypes([...types, response]);
            setNewType('');
            setOpenTypeDialog(false);
        } catch (error) {
            toast.error("Failed to add type");
        }
    };

    const handleSubmit = () => {
        if (Object.keys(updatedFields).length === 0) {
            toast.error("Please update at least one field");
            return;
        }

        const formData = new FormData();
        Object.keys(updatedFields).forEach(key => {
            formData.append(key, updatedFields[key]);
        });

        agent.Store.updateProduct(Number(id), formData)
            .then(() => navigate('/store'))
            .catch(error => console.error('Error updating product:', error));
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Update Product
                </Typography>
                <TextField
                    label="Name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="brand-label">Brand</InputLabel>
                    <Select
                        labelId="brand-label"
                        id="brandId"
                        name="brandId"
                        value={product.brandId}
                        onChange={handleChange}
                    >
                        {brands.map((brand) => (
                            <MenuItem key={brand.id} value={brand.id}>
                                {brand.name}
                            </MenuItem>
                        ))}
                        <MenuItem value="" onClick={() => setOpenBrandDialog(true)}>Add New Brand</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="type-label">Type</InputLabel>
                    <Select
                        labelId="type-label"
                        id="typeId"
                        name="typeId"
                        value={product.typeId}
                        onChange={handleChange}
                    >
                        {types.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name}
                            </MenuItem>
                        ))}
                        <MenuItem value="" onClick={() => setOpenTypeDialog(true)}>Add New Type</MenuItem>
                    </Select>
                </FormControl>
                <FilledInput
                    name='photo'
                    id='photo'
                    type='file'
                    onChange={handleFileChange}
                    fullWidth
                    style={{ margin: '20px 0' }}
                />
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Update Product
                </Button>
            </Box>

            {/* Dialogs for adding new brand and type */}
            <Dialog open={openBrandDialog} onClose={() => setOpenBrandDialog(false)}>
                <DialogTitle>Add New Brand</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the name of the new brand.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="newBrand"
                        label="Brand Name"
                        type="text"
                        fullWidth
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBrandDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddBrand}>Add</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openTypeDialog} onClose={() => setOpenTypeDialog(false)}>
                <DialogTitle>Add New Type</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the name of the new type.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="newType"
                        label="Type Name"
                        type="text"
                        fullWidth
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenTypeDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddType}>Add</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UpdatePage;
