import { Router } from "express";
import CartsManager from "../classes/cartsManager.js";

const router = Router();
const cartManager = new CartsManager("./data/carts.json");

// Routes
router.post("/", async (req, res) => {
    try {
        const { id, products } = req.body;
        let productsArray = [];

        // Products allways an Array
        if (products && !Array.isArray(products)) {
            productsArray.push(products);
        } else if (Array.isArray(products)) {
            productsArray = products;
        }

        const cart = {
            id,
            products: productsArray // Array typeOf
        };
        
        const isCartValid = await cartManager.addCart(cart);

        if (isCartValid) {
            const cartResponse = {
                ...cart
            };
            res.status(200).json(cartResponse);
        } else {
            res.status(500).json({ message: 'Failed to add the product. Please try again.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get("/:cid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cartById = await cartManager.getCartById(cartId);

        if (cartById) {
            res.status(200).json(cartById);
        } else {
            res.status(404).json({ message: "CART not found" });
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        const isProductAdded = await cartManager.addProductToCart(cartId, productId);

        if (isProductAdded) {
            res.status(200).json({ message: "Product added to cart successfully" });
        } else {
            res.status(404).json({ message: "Cart not found or Product not added" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;