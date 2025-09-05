const Category = require("../models/category");
const Product = require("../models/product");
const User = require("../models/user");

const createCategory = async (req, res) => {
    try {
        // name and description from req body:
        const {name, description} = req.body;

        // validate inputs:
        if (!name || !description) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        // create new category:
        const newCategory = new Category({
            name,
            description
        });

        // save to db:
        await newCategory.save();

        // return success response:
        res.status(201).json({
            success: true,
            message: "Category created successfully.",
            category: newCategory
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error while creating category.",
            error: error.message
        });
    }
}

const getAllCategories = async (req, res) => {
    try {
        // fetch all categories from db:
        const categories = await Category.find().populate("products").exec();

        // return success response:
        res.status(200).json({
            success: true,
            message: categories.length > 0 ? "Categories fetched successfully." : "No categories found.",
            categories: categories
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error while fetching categories.",
            error: error.message
        });
    }
}

// const deleteCategory = async (req, res) => {
//     try {
//         const { password } = req.body;
//         if (!password || password !== process.env.ADMIN_PASSWORD) {
//             return res.status(400).json({
//                 message: "Failed to delete category."
//             });
//         }
//         // extract category id from req params:
//         const categoryId = req.params.id;

//         // check if category exists:
//         const existingCategory = await Category.findById(categoryId);
//         if (!existingCategory) {
//             return res.status(404).json({
//                 message: "Category not found."
//             });
//         }

//         // delete all products associated with this category:
//         const productsToDelete = await Product.find({ category: categoryId }).distinct('_id');
//         await Product.deleteMany({ category: categoryId });
//         console.log(productsToDelete);

//         // delete all references in users' products arrays:
//         const users = await User.find();
//         for (let user of users) {
//             user.products = user.products.filter(productId => !productsToDelete.includes(productId));
//             await user.save();
//         }

//         // delete category from db:
//         await Category.findByIdAndDelete(categoryId);

//         // return success response:
//         res.status(200).json({
//             success: true,
//             message: "Category deleted successfully."
//         });
//     }
//     catch(error) {
//         res.status(500).json({
//             message: "Error while deleting category.",
//             error: error.message
//         });
//     }
// }

module.exports = {
    createCategory,
    getAllCategories,
    // deleteCategory
};