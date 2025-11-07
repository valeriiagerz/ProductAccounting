import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";

const router = Router();

// GET /products - список товаров
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const productRepository = AppDataSource.getRepository(Product);
    const [data, total] = await productRepository.findAndCount({
      skip,
      take: limit,
      order: {
        id: "ASC",
      },
    });

    res.json({
      data,
      total,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /products - создание товара
router.post("/", async (req: Request, res: Response) => {
  try {
    const { article, name, price, quantity } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!price || price <= 0) {
      return res.status(400).json({ error: "Price must be > 0" });
    }

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: "Quantity must be >= 0" });
    }

    if (!article || article.trim() === "") {
      return res.status(400).json({ error: "Article is required" });
    }

    const productRepository = AppDataSource.getRepository(Product);

    const existingProduct = await productRepository.findOne({
      where: { article },
    });

    if (existingProduct) {
      return res.status(400).json({ error: "Article must be unique" });
    }

    const product = new Product();
    product.article = article;
    product.name = name;
    product.price = parseFloat(price);
    product.quantity = parseInt(quantity);

    const savedProduct = await productRepository.save(product);
    res.status(201).json(savedProduct);
  } catch (error: any) {
    console.error("Error creating product:", error);
    if (error.code === "23505") {
      return res.status(400).json({ error: "Article must be unique" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /products/:id - обновление товара
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { article, name, price, quantity } = req.body;

    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name cannot be empty" });
    }
    product.name = name;

    if (!price || price <= 0) {
      return res.status(400).json({ error: "Price must be > 0" });
    }
    product.price = parseFloat(price);

    if (!quantity || quantity < 0) {
      return res.status(400).json({ error: "Quantity must be >= 0" });
    }
    product.quantity = parseInt(quantity);

    if (!article || article.trim() === "") {
      return res.status(400).json({ error: "Article cannot be empty" });
    }
    if (article !== product.article) {
      const existingProduct = await productRepository.findOne({
        where: { article },
      });
      if (existingProduct) {
        return res.status(400).json({ error: "Article must be unique" });
      }
    }
    product.article = article;

    const updatedProduct = await productRepository.save(product);
    res.json(updatedProduct);
  } catch (error: any) {
    console.error("Error updating product:", error);
    if (error.code === "23505") {
      return res.status(400).json({ error: "Article must be unique" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /products/:id - удаление товара
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await productRepository.remove(product);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
