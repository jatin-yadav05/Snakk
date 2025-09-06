const User = require('../models/user');
const Product = require('../models/product');
const Category = require('../models/category');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const fs = require('fs');

// Create a new product
const addProduct = async (req, res) => {
    
    // upload image to cloudinary:
    let uploadedImage = null;
    
    try {
        // Extract product details from request body
        const { name, quantity, description, isAvailable, category, price, tags } = req.body;
        const productImage = req.files ? req.files.productImage : null;

        // validate inputs:
        if (!name || !quantity || !category || !price || !tags) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        // validate quantity and price:
        if (quantity < 1) {
            return res.status(400).json({
                message: "Invalid quantity."
            });
        }
        if (price < 0) {
            return res.status(400).json({
                message: "Invalid price."
            });
        }

        // validate image:
        if (productImage !== null && (!productImage || productImage.size > 5 * 1024 * 1024)) {
            return res.status(400).json({
                message: "Invalid image. Image must be less than 5MB."
            });
        }

        // extract the user which is adding the product:
        const user = req.user;

        // extract user from db:
        const existingUser = await User.findById(user._id);

        // chec if product name already exists for this user:
        const existingProduct = await Product.findOne({name: name, user: existingUser._id});
        if(existingProduct) {
            return res.status(400).json({
                message: "Product with this name already exists."
            });
        }

        // extract the category from db:
        const existingCategory = await Category.findOne({name: category});

        if(!existingCategory) {
            return res.status(400).json({
                message: "Category does not exist."
            });
        }

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        
        // if image is provided, upload to cloudinary:
        if (productImage !== null && (productImage || productImage.length > 0)) {
            // upload to cloudinary and get the url and public id
            uploadedImage = await uploadImageToCloudinary(
                productImage,
                process.env.FOLDER_NAME,
                1000,
                1000
            );

            // delete from tmp folder:
            fs.unlinkSync(productImage.tempFilePath);

            // if image is not uploaded successfully, return error:
            if (!uploadedImage) {
                throw new Error("Cloudinary upload failed");
            }
        }

        // create a new product instance:
        const newProduct = await Product.create({
            user: existingUser._id,
            name,
            quantity,
            description,
            isAvailable,
            category: existingCategory._id,
            price,
            tags,
            image: uploadedImage === null ? "" : uploadedImage.secure_url
        });

        // add product to the category's products array:
        existingCategory.products.push(newProduct._id);
        await existingCategory.save();

        // update user's products array:
        existingUser.products.push(newProduct._id);
        await existingUser.save();

        res.status(201).json({
            success: true,
            message: "Product added successfully.",
            product: newProduct
        });
    }
    catch (error) {
        // handle error while uploading image to cloudinary:
        if (error.message === "Cloudinary upload failed") {
            // destroy the uploaded image if exists:
            if (uploadedImage && uploadedImage.public_id) {
                await cloudinary.uploader.destroy(uploadedImage.public_id);
            }
        }

        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error while adding product."
        });
    }
}

// Get all products
const getAllProducts = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find().populate('user', 'name email').populate('category', 'name');
        res.status(200).json({
            success: true,
            message: products.length > 0 ? "Products fetched successfully." : "No products found.",
            products: products
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error while fetching products."
        });
    }
}

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        // fetch product from db:
        const product = await Product.findById(productId).populate('user', 'name email').populate('category', 'name');
        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully.",
            product: product
        });
    }
    catch(error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error while fetching product."
        });
    }
}

// Update product
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const userUpdating = req.user;

        // check if the user is the owner of the product:
        const productToBeUpdated = await Product.findById(productId);

        if(!productToBeUpdated || productToBeUpdated.user.toString() !== userUpdating._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this product."
            });
        }

        // extract fields to be updated:
        const { quantity, isAvailable, price } = req.body;

        // if no fields are provided to update, return error:
        if(quantity === undefined && isAvailable === undefined && price === undefined) {
            return res.status(400).json({
                message: "At least one field is required to update."
            });
        }


        // fetching the product from db:
        const existingProduct = await Product.findById(productId);
        if(!existingProduct) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        // update the quantity if provided:
        if(quantity !== undefined) {
            if(quantity < 1) {
                return res.status(400).json({
                    message: "Invalid quantity."
                });
            }
            existingProduct.quantity = quantity;
        }


        // update the price if provided:
        if(price !== undefined) {
            if(price < 0) {
                return res.status(400).json({
                    message: "Invalid price."
                });
            }
            existingProduct.price = price;
        }


        // update the availability if provided:
        if(isAvailable !== undefined) {
            existingProduct.isAvailable = isAvailable;
        }

        // save the updated product:
        await existingProduct.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            product: existingProduct
        });

    }
    catch(error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error while updating product."
        });
    }
}

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const userDeleting = req.user;

        // check if the user is the owner of the product:
        const productToBeDeleted = await Product.findById(productId);
        if(!productToBeDeleted || productToBeDeleted.user.toString() !== userDeleting._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this product."
            });
        }

        // we have to delete product from category's products array and user's products array also:
        // finding the category in which this product is present:
        const category = await Category.findById(productToBeDeleted.category);
        category.products = category.products.filter(prodId => prodId.toString() !== productId.toString()); // removing the product from category's products array
        await category.save();

        // finding the user who added this product:
        const user = await User.findById(productToBeDeleted.user);
        user.products = user.products.filter(prodId => prodId.toString() !== productId.toString()); // removing the product from user's products array
        await user.save();

        // delete the product:
        await Product.findByIdAndDelete(productId);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully."
        });
    }
    catch(error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error while deleting product."
        });
    }
}

// Get products by user
const getProductsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        // fetch user from db:
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // fetch products added by this user:
        const products = await Product.find({ user: userId }).populate('category', 'name');

        res.status(200).json({
            success: true,
            message: products.length > 0 ? "Products fetched successfully." : "No products found for this user.",
            products: products
        });
    }
    catch(error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error while fetching products."
        });
    }
}

// Get products by hostel
const getProductsByHostel = async (req, res) => {
    try {
        const user = req.user;
        const hostel = user.hostel;

        if(!hostel) {
            return res.status(400).json({
                success: false,
                message: "User does not belong to any hostel."
            });
        }


        // fetch all users in this hostel:
        const usersInHostel = await User.find({ hostel: hostel }).select('_id');

        // fetch products added by these users:
        const products = await Product.find({ user: { $in: usersInHostel } }).populate('category', 'name');

        res.status(200).json({
            success: true,
            message: products.length > 0 ? "Products fetched successfully." : "No products found for this hostel.",
            products: products
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error while fetching products."
        });
    }
}

// Get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        // fetch category from db:
        const category = await Category.findById(categoryId);
        if(!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        // fetch products in this category:
        const products = await Product.find({ category: categoryId }).populate('user', 'name');

        res.status(200).json({
            success: true,
            message: products.length > 0 ? "Products fetched successfully." : "No products found in this category.",
            products: products
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error while fetching products."
        });
    }
}

module.exports = {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByUser,
    getProductsByCategory,
    getProductsByHostel
};