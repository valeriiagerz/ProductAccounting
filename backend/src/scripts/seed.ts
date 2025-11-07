import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    const productRepository = AppDataSource.getRepository(Product);

    const count = await productRepository.count();
    if (count > 0) {
      console.log("Database already has data, skipping seed");
      await AppDataSource.destroy();
      return;
    }

    const testProducts = [
      { article: "NB-001", name: "Хлеб", price: 899.0, quantity: 5 },
      { article: "NB-002", name: "Молоко", price: 1200.0, quantity: 10 },
      { article: "NB-003", name: "Яйца", price: 1500.0, quantity: 20 },
      { article: "NB-004", name: "Масло", price: 2500.0, quantity: 8 },
      { article: "NB-005", name: "Сахар", price: 1800.0, quantity: 15 },
      { article: "NB-006", name: "Соль", price: 450.0, quantity: 30 },
      { article: "NB-007", name: "Мука", price: 2200.0, quantity: 12 },
      { article: "NB-008", name: "Макароны", price: 950.0, quantity: 25 },
      { article: "NB-009", name: "Рис", price: 2100.0, quantity: 18 },
      { article: "NB-010", name: "Гречка", price: 1900.0, quantity: 14 },
    ];

    for (const productData of testProducts) {
      const product = new Product();
      product.article = productData.article;
      product.name = productData.name;
      product.price = productData.price;
      product.quantity = productData.quantity;
      await productRepository.save(product);
    }

    console.log("Test data seeded successfully");
    await AppDataSource.destroy();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
