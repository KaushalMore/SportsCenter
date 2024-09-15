import { useState, useEffect } from "react";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";
import Spinner from "../../app/layout/Spinner";
import { Grid, Paper, TextField } from "@mui/material";

export default function Catalog() {

    // const [products, setProducts] = useState<Product[]>([]);
    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       const response = await fetch('http://localhost:8081/api/product');
    //       if (!response.ok) {
    //         throw new Error("Failed to fetch the data");
    //       }
    //       const data = await response.json();
    //       setProducts(data.content);
    //     } catch (error) {
    //       console.error("Error Fetching Data");
    //     }
    //   };
    //   fetchData();
    // }, []);
    // fetching data using promise
    // useEffect(() => {
    //     fetch('http://localhost:8081/api/product')
    //         .then(response => response.json())
    //         .then(data => setProducts(data.content));
    // }, []);
    // fetching using axios 
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        agent.Store.list()
            .then(products => setProducts(products.content))
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
    }, []);
    if (!products) return <h3>Unable to load Products</h3>
    if (loading) return <Spinner message="Loading Products.." />


    return (
        <Grid container spacing={3}>

            <Grid item xs={3}>
                <Paper sx={{ mb: 2 }}>
                    <TextField
                        label="Search Products"
                        variant="outlined"
                        fullWidth
                        onKeyDown={(e) => {
                            if (e.key == 'Enter') {

                            }
                        }}
                    />
                </Paper>
            </Grid>

            <Grid item xs={9}>
                <ProductList products={products} />
            </Grid>
        </Grid>

        // <ul>
        //     {products.map(products => (
        //         <div key={products.id}>
        //             <p>Name : {products.name}</p>
        //             <p>Description : ${products.description}</p>
        //             <p>Price : ${products.price}</p>
        //             <p>PictureUrl : ${products.pictureUrl}</p>
        //             <p>ProductBrand : ${products.productBrand}</p>
        //             <p>ProductType : ${products.productType}</p>
        //         </div>
        //     ))}
        // </ul>
    )
}



