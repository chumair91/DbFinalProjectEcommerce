import { createContext, useEffect, useState } from "react";
import { products } from "../assets/frontend_assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext();
import axios from 'axios'
const ShopContextProvider = (props) => {
    const currency = 'Rs';
    const delivery_fee = 145;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [cartCount, setCartCount] = useState(0)
    const [products, setProducts] = useState([])
    const navigate = useNavigate();
    const [token, setToken] = useState('')

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Plz select size")
            return;
        }
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData)
        if (token) {
            try {
                const res = await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
                if (res.data.success) {
                    toast.success(res.data.message)

                }
            } catch (error) {
                console.log(error);
                toast.error(error.message);

            }
        }
    }
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }
    }
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (let item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);

                }

            }
        }

        setCartCount(totalCount);
        /*Another Approach*/
        // const count=Object.values(cartItems).reduce((total,sizes)=>{
        //     return total+Object.values(sizes).reduce((tempTotal,values)=>tempTotal+values,0)
        // },0)
        // setCartCount(count)
    }
    const getCartAmount = () => {
        let totalPrice = 0;
        for (const items in cartItems) {
            for (let item in cartItems[items]) {
                const productData = products.find(product => product._id === items);
                if (productData) {
                    totalPrice += productData.price * cartItems[items][item]
                }
            }
        }
        return totalPrice;
    }

    const getProductsData = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/product/list')
            if (res.data.success) {
                setProducts(res.data.products)
            } else {
                toast.error(res.data.message);
            }


        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }
    }

    const getUserCart = async (token) => {
        try {
            const res = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
            if (res.data.success) {
                setCartItems(res.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }
    useEffect(() => {
        getCartCount()
        getCartAmount()

    }, [cartItems])

    useEffect(() => {

        getProductsData();
    }, []);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
    }, [])

    const value = {
        products, currency, delivery_fee, search, setSearch, showSearch, setShowSearch, cartItems, setCartItems, addToCart, cartCount, updateQuantity, getCartAmount, navigate, backendUrl, token, setToken
    }
    return (
        <ShopContext.Provider value={value} >
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;