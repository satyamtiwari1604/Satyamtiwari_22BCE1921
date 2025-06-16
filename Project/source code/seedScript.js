import mongoose from "mongoose";
import Product from "./src/models/products.js";
import Category from "./src/models/category.js";
import { categories, products } from "./seedData.js";
import "dotenv/config.js"



async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany({});
    await Category.deleteMany({});


    const categoryDocs = await Category.insertMany(categories);

    const categoryMap = categoryDocs.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {})

    const productWithCategoryIds = products.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }))

    await Product.insertMany(productWithCategoryIds);

    console.log("DATABASE SEEDED SUCCESSFULLY");
  } catch (error) {
    console.log("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }

}


seedDatabase();