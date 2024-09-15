import { Container, CssBaseline, Box, Typography, TextField, Button, FilledInput, MenuItem, Select, InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import agent from '../../app/api/agent';

export default function AddProduct() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        photo: null,
        name: '',
        price: '',
        description: '',
        brand: '',
        type: '',
    });

    const [brands, setBrands] = useState([]);
    const [types, setTypes] = useState([]);
    const [newBrand, setNewBrand] = useState('');
    const [newType, setNewType] = useState('');
    const [openBrandDialog, setOpenBrandDialog] = useState(false);
    const [openTypeDialog, setOpenTypeDialog] = useState(false);

    useEffect(() => {
        // Fetch brands and types from the backend using agent
        const fetchBrandsAndTypes = async () => {
            try {
                const brandsResponse = await agent.Store.brands();
                const typesResponse = await agent.Store.types();
                setBrands(brandsResponse.filter(brand => brand.id !== 0));
                setTypes(typesResponse.filter(type => type.id !== 0));
            } catch (error) {
                toast.error("Failed to fetch brands and types");
            }
        };
        fetchBrandsAndTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ ...formData, [name]: files ? files[0] : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.photo || !formData.name || !formData.price || !formData.description || !formData.brand || !formData.type) {
            toast.error("All fields are required!");
            return;
        }

        const data = new FormData();
        data.append('photo', formData.photo);
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('brand', formData.brand);
        data.append('type', formData.type);

        try {
            await agent.Store.createProduct(data);
            navigate("/store");
        } catch (error) {
            console.error('There was an error!', error);
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
                    Add New Product
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Product Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="price"
                        label="Product Price"
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="description"
                        label="Description"
                        type="text"
                        id="description"
                        autoComplete="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="brand-label">Brand</InputLabel>
                        <Select
                            labelId="brand-label"
                            id="brand"
                            name="brand"
                            value={formData.brand}
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
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            labelId="type-label"
                            id="type"
                            name="type"
                            value={formData.type}
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
                        fullWidth
                        required
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add
                    </Button>
                </Box>
            </Box>

            {/* Dialog for adding new brand */}
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

            {/* Dialog for adding new type */}
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
}
