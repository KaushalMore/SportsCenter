import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import Header from "./Header";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBasketFromLocalStorage } from "../util/util";
import { useAppDispatch } from "../store/configuresStore";
import { fetchCurrentUser } from "../../features/acoount/accountSlice";
import agent from "../api/agent";
import { setBasket } from "../../features/basket/basketSlice";
import Spinner from "./Spinner";

function App() {

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    // const theme = getThemeFromLocalStorage();
    // if (theme) {
    //   setDarkMode(true);
    // }
    const basket = getBasketFromLocalStorage();
    dispatch(fetchCurrentUser);
    if (basket) {
      agent.Baskets.get()
      .then(basket=>dispatch(setBasket(basket)))
      .catch(error => console.log(error))
      .finally(()=> setLoading(false));
    }else{
      setLoading(false);
    }
  })

  const theme = createTheme({
    palette: {
      mode: paletteType,
    }
  })
  function handleThemeChange() {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', JSON.stringify(!darkMode))
  }

  if (loading) return <Spinner message="Geting Basket..."/>
  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
        <CssBaseline />
        <Header darkMode={darkMode} handelDarkMode={handleThemeChange} />
        <Container sx={{ paddingTop: "64px" }}>
          {/* <Catalog /> */}
          <Outlet />
        </Container>
      </ThemeProvider>
    </Fragment>
  );
}

export default App;

