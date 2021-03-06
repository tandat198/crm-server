const { Product } = require("../../../models/Product");
const { Category } = require("../../../models/Category");
const isInt = require("validator/lib/isInt");
const isUrl = require("validator/lib/isURL");
const ObjectId = require("mongoose").Types.ObjectId;

const getProducts = async (req, res) => {
    const { pageSize, pageIndex, category } = req.query;
    const limit = isInt(pageSize + "") && pageSize > 0 ? parseInt(pageSize) : 4;
    const skip = isInt(pageIndex + "") && pageIndex > 0 ? (pageIndex - 1) * limit : 0;

    try {
        let foundProducts;

        if (typeof category == "string") {
            const categoryRegEx = new RegExp(category, "i");
            foundProducts = await Product.find({ "category.name": categoryRegEx }).limit(limit).skip(skip);
        } else {
            foundProducts = await Product.find().limit(limit).skip(skip);
        }

        const products = foundProducts.map((product) => ({
            ...product.transform(),
            category: product.category && product.category.transform(),
        }));
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const getProductById = async (req, res) => {
    const { productId } = req.params;
    if (!ObjectId.isValid(productId)) return res.status(400).json({ error: "productId is invalid" });
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });
        return res.status(200).json(product.transform());
    } catch (error) {
        return res.status(500).json(error);
    }
};

const createProduct = async (req, res) => {
    const { name, category, remainingQuantity, price, chipset, screenSize, memory, storage, thumbnailUrl, imageUrl } = req.body;
    const errors = {};

    if (!name) errors.name = "name is required";
    if (!category) errors.category = "category is required";
    if (!price) errors.price = "price is required";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    if (!ObjectId.isValid(category + "")) errors.category = "categoryId is invalid";

    if (typeof remainingQuantity != "undefined" && (typeof remainingQuantity != "number" || !isInt(remainingQuantity + ""))) {
        errors.remainingQuantity = "remainingQuantity is invalid";
    }
    if (typeof price != "number" || !isInt(price + "")) {
        errors.price = "price is invalid";
    }
    if (typeof chipset != "undefined" && typeof chipset != "string") {
        errors.chipset = "chipset is invalid";
    }
    if (typeof screenSize != "undefined" && typeof screenSize != "number") {
        errors.screenSize = "screenSize is invalid";
    }
    if (typeof memory != "undefined" && typeof memory != "number") {
        errors.memory = "memory is invalid";
    }
    if (typeof storage != "undefined" && typeof storage != "number") {
        errors.storage = "storage is invalid";
    }
    if (typeof thumbnailUrl != "undefined" && (typeof thumbnailUrl != "string" || !isUrl(thumbnailUrl))) {
        errors.thumbnailUrl = "thumbnailUrl is invalid";
    }
    if (typeof imageUrl != "undefined" && (typeof imageUrl != "string" || !isUrl(imageUrl))) {
        errors.imageUrl = "imageUrl is invalid";
    }
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    try {
        const foundCategory = await Category.findById(category);
        if (!foundCategory) return res.status(404).json({ error: "Category not found" });
        const product = new Product({
            name,
            remainingQuantity,
            price,
            chipset,
            screenSize,
            memory,
            storage,
            imageUrl,
            thumbnailUrl,
            category: foundCategory,
        });
        await product.save();
        return res.status(201).json({
            ...product.transform(),
            category: foundCategory.transform(),
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, category, remainingQuantity, price, chipset, screenSize, memory, storage, thumbnailUrl, imageUrl } = req.body;
    const errors = {};

    if (!name) errors.name = "name is required";
    if (!category) errors.category = "category is required";
    if (!price) errors.price = "price is required";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    if (!ObjectId.isValid(category + "")) errors.category = "categoryId is invalid";

    if (typeof remainingQuantity != "undefined" && (typeof remainingQuantity != "number" || !isInt(remainingQuantity + ""))) {
        errors.remainingQuantity = "remainingQuantity is invalid";
    }
    if (typeof price != "number" || !isInt(price + "")) {
        errors.price = "price is invalid";
    }
    if (typeof chipset != "undefined" && typeof chipset != "string") {
        errors.chipset = "chipset is invalid";
    }
    if (typeof screenSize != "undefined" && typeof screenSize != "number") {
        errors.screenSize = "screenSize is invalid";
    }
    if (typeof memory != "undefined" && typeof memory != "number") {
        errors.memory = "memory is invalid";
    }
    if (typeof storage != "undefined" && typeof storage != "number") {
        errors.storage = "storage is invalid";
    }
    if (typeof thumbnailUrl != "undefined" && (typeof thumbnailUrl != "string" || !isUrl(thumbnailUrl))) {
        errors.thumbnailUrl = "thumbnailUrl is invalid";
    }
    if (typeof imageUrl != "undefined" && (typeof imageUrl != "string" || !isUrl(imageUrl))) {
        errors.imageUrl = "imageUrl is invalid";
    }
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    try {
        const foundCategory = await Category.findById(category);

        if (!foundCategory) return res.status(404).json({ error: "Category not found" });
        await Product.updateOne(
            { _id: productId },
            {
                name,
                remainingQuantity,
                price,
                chipset,
                screenSize,
                memory,
                storage,
                imageUrl,
                thumbnailUrl,
                category: foundCategory,
            }
        );

        return res.status(201).json({
            ...product.transform(),
            category: foundCategory.transform(),
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    if (!ObjectId.isValid(productId)) return res.status(400).json({ productId: "ProductId is invalid" });

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });
        await Product.deleteOne({ _id: productId });
        return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
