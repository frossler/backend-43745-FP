import fs from 'fs';

export default class CartsManager {
    constructor(filePath) {
        this.path = filePath;
    };
    //    Methods
    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const cartsJSON = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(cartsJSON);
            } else {
                return [];
            }
        } catch (error) {
            console.error(error);
        }
    };
    async isCartCodeUnique(id) {
        try {
            const carts = await this.getCarts();
            const foundProduct = carts.find(cart => cart.id === id);

            if (foundProduct) {
                console.error(`ERROR: Cart with code '${id}' already exists`);
                return false;
            }

            return true;
        } catch (error) {
            console.error('ERROR: Failed to check cart id is unique:', error);
            return false;
        }
    };
    async addCart(cart) {
        try {
            const mandatoryKeys = ['products'];
            const missingKeys = mandatoryKeys.filter((key) => !cart.hasOwnProperty(key));

            if (missingKeys.length > 0) {
                console.error('ERROR: CART is missing mandatory keys:', missingKeys);
                return false;
            }

            const carts = await this.getCarts();

            const maxId = carts.length > 0 ? Math.max(...carts.map(cart => cart.id)) : 0;
            const newId = maxId + 1;

            const newCart = {
                id: newId,
                products: cart.products
            };

            carts.push(newCart); // Push the new cart object to the array

            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            console.log('SUCCESS: CART created and persisted successfully');
            return true;
        } catch (error) {
            console.error('ERROR: Failed to create Cart:', error);
            return false;
        }
    };
    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getCarts();

            const index = carts.findIndex(cart => cart.id === cartId);

            if (index === -1) {
                console.error(`ERROR: Cart with ID ${cartId} not found`);
                return false;
            }

            const cart = carts[index];
            const existingProductIndex = cart.products.findIndex(item => item.id === productId);

            if (existingProductIndex === -1) {
                cart.products.push({ id: productId, quantity: 1 });
            } else {
                cart.products[existingProductIndex].quantity += 1;
            }

            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            console.log(`SUCCESS: Product with ID ${productId} added to cart with ID ${cartId}`);
            return true;
        } catch (error) {
            console.error('ERROR: Failed to add product to cart:', error);
            return false;
        }
    };
    async getCartById(id) {
        const carts = await this.getCarts();
        const cart = carts.find((c) => c.id === id);
        if (cart) {
            console.log(`SUCCESS: CART found >>> ID: ${id}\n`, cart);
            return cart;
        } else {
            console.error(`ERROR: Can't find CART with ID: ${id}`);
            return null;
        }
    };
}