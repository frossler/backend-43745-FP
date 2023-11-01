import { Router } from "express";
import ProductManager from "../classes/productManager.js";

const router = Router();
const productManager = new ProductManager("./data/products.json");

// Routes
router.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await productManager.getProducts();
        if (!limit) res.status(200).json(products);
        else {
            const productsByLimit = await productManager.getProductsByLimit(limit);
            res.status(200).json(productsByLimit);
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});
router.get("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const productById = await productManager.getProductById(productId);

        if (productById) {
            res.status(200).json(productById);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});
router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        let thumbnailsArray = [];

        // Thumbnail allways an Array
        if (thumbnails && !Array.isArray(thumbnails)) {
            thumbnailsArray.push(thumbnails);
        } else if (Array.isArray(thumbnails)) {
            thumbnailsArray = thumbnails;
        }

        const product = {
            title,
            description,
            code,
            price,
            status: true, // Default status
            stock,
            category,
            thumbnails: thumbnailsArray // Array typeOf
        };
        
        const isProductAdded = await productManager.addProduct(product);

        if (isProductAdded) {
            const productResponse = {
                ...product
            };
            res.status(200).json(productResponse);
        } else {
            res.status(500).json({ message: 'Failed to add the product. Please try again.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.put("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const { id, ...rest } = req.body; // Prevent changing the ID

        const isProductUpdated = await productManager.updateProduct(productId, rest);

        if (isProductUpdated) {
            res.status(200).json({ message: "Product updated successfully" });
        } else {
            res.status(404).json({ message: "Product not found or could not be updated" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.delete("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const isProductDeleted = await productManager.deleteProduct(productId);

        if (isProductDeleted) {
            res.status(200).json({ message: "Product Deleted" });
        } else {
            res.status(404).json({ message: "Product not found or could not be deleted" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;