import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import { Product } from './entity/Product';
import productsRouter from './routes/products';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/products', productsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize database and start server
AppDataSource.initialize()
  .then(async () => {
    console.log('Database connected successfully');
    
    // Seed test data if database is empty
    const productRepository = AppDataSource.getRepository(Product);
    const count = await productRepository.count();
    if (count === 0) {
      console.log('Seeding test data...');
      const testProducts = [
        { article: 'NB-001', name: 'Хлеб', price: 899.00, quantity: 5 },
        { article: 'NB-002', name: 'Молоко', price: 1200.00, quantity: 10 },
        { article: 'NB-003', name: 'Яйца', price: 1500.00, quantity: 20 },
        { article: 'NB-004', name: 'Масло', price: 2500.00, quantity: 8 },
        { article: 'NB-005', name: 'Сахар', price: 1800.00, quantity: 15 },
        { article: 'NB-006', name: 'Соль', price: 450.00, quantity: 30 },
        { article: 'NB-007', name: 'Мука', price: 2200.00, quantity: 12 },
        { article: 'NB-008', name: 'Макароны', price: 950.00, quantity: 25 },
        { article: 'NB-009', name: 'Рис', price: 2100.00, quantity: 18 },
        { article: 'NB-010', name: 'Гречка', price: 1900.00, quantity: 14 },
        { article: 'NB-011', name: 'Овсянка', price: 1750.00, quantity: 22 },
        { article: 'NB-012', name: 'Пшено', price: 1650.00, quantity: 16 },
        { article: 'NB-013', name: 'Перловка', price: 1450.00, quantity: 19 },
        { article: 'NB-014', name: 'Фасоль', price: 2800.00, quantity: 13 },
        { article: 'NB-015', name: 'Горох', price: 1950.00, quantity: 17 },
        { article: 'NB-016', name: 'Чечевица', price: 3200.00, quantity: 11 },
        { article: 'NB-017', name: 'Огурцы', price: 850.00, quantity: 35 },
        { article: 'NB-018', name: 'Помидоры', price: 1200.00, quantity: 28 },
        { article: 'NB-019', name: 'Лук', price: 650.00, quantity: 40 },
        { article: 'NB-020', name: 'Чеснок', price: 1500.00, quantity: 32 },
        { article: 'NB-021', name: 'Морковь', price: 750.00, quantity: 38 },
        { article: 'NB-022', name: 'Картофель', price: 550.00, quantity: 50 },
        { article: 'NB-023', name: 'Капуста', price: 680.00, quantity: 30 },
        { article: 'NB-024', name: 'Свекла', price: 720.00, quantity: 25 },
        { article: 'NB-025', name: 'Перец', price: 1100.00, quantity: 20 },
        { article: 'NB-026', name: 'Бананы', price: 1350.00, quantity: 24 },
        { article: 'NB-027', name: 'Яблоки', price: 980.00, quantity: 33 },
        { article: 'NB-028', name: 'Апельсины', price: 1250.00, quantity: 27 },
        { article: 'NB-029', name: 'Мандарины', price: 1400.00, quantity: 29 },
        { article: 'NB-030', name: 'Груши', price: 1150.00, quantity: 21 },
        { article: 'NB-031', name: 'Виноград', price: 1800.00, quantity: 18 },
        { article: 'NB-032', name: 'Клубника', price: 2200.00, quantity: 15 },
        { article: 'NB-033', name: 'Малина', price: 2800.00, quantity: 12 },
        { article: 'NB-034', name: 'Черника', price: 3200.00, quantity: 10 },
        { article: 'NB-035', name: 'Сметана', price: 1650.00, quantity: 22 },
        { article: 'NB-036', name: 'Творог', price: 1850.00, quantity: 19 },
        { article: 'NB-037', name: 'Сыр', price: 3200.00, quantity: 14 },
        { article: 'NB-038', name: 'Йогурт', price: 950.00, quantity: 26 },
        { article: 'NB-039', name: 'Кефир', price: 880.00, quantity: 28 },
        { article: 'NB-040', name: 'Ряженка', price: 920.00, quantity: 23 },
        { article: 'NB-041', name: 'Колбаса', price: 2800.00, quantity: 16 },
        { article: 'NB-042', name: 'Сосиски', price: 1850.00, quantity: 20 },
        { article: 'NB-043', name: 'Курица', price: 2200.00, quantity: 17 },
        { article: 'NB-044', name: 'Говядина', price: 4500.00, quantity: 12 },
        { article: 'NB-045', name: 'Свинина', price: 3800.00, quantity: 13 },
        { article: 'NB-046', name: 'Рыба', price: 3200.00, quantity: 15 },
        { article: 'NB-047', name: 'Консервы', price: 850.00, quantity: 30 },
        { article: 'NB-048', name: 'Тунец', price: 1450.00, quantity: 18 },
        { article: 'NB-049', name: 'Лосось', price: 5800.00, quantity: 8 },
        { article: 'NB-050', name: 'Креветки', price: 4200.00, quantity: 11 },
        { article: 'NB-051', name: 'Чай', price: 450.00, quantity: 45 },
        { article: 'NB-052', name: 'Кофе', price: 1850.00, quantity: 25 },
        { article: 'NB-053', name: 'Какао', price: 750.00, quantity: 32 },
        { article: 'NB-054', name: 'Соки', price: 980.00, quantity: 28 },
        { article: 'NB-055', name: 'Вода', price: 450.00, quantity: 60 },
        { article: 'NB-056', name: 'Лимонад', price: 680.00, quantity: 35 },
        { article: 'NB-057', name: 'Печенье', price: 1250.00, quantity: 22 },
        { article: 'NB-058', name: 'Шоколад', price: 1850.00, quantity: 19 },
        { article: 'NB-059', name: 'Конфеты', price: 1450.00, quantity: 24 },
        { article: 'NB-060', name: 'Мед', price: 3200.00, quantity: 13 },
        { article: 'NB-061', name: 'Варенье', price: 1650.00, quantity: 17 },
        { article: 'NB-062', name: 'Орехи', price: 2800.00, quantity: 14 },
        { article: 'NB-063', name: 'Сухофрукты', price: 2200.00, quantity: 16 },
        { article: 'NB-064', name: 'Семечки', price: 850.00, quantity: 29 },
        { article: 'NB-065', name: 'Масло растительное', price: 1250.00, quantity: 21 },
        { article: 'NB-066', name: 'Уксус', price: 550.00, quantity: 38 },
        { article: 'NB-067', name: 'Майонез', price: 980.00, quantity: 26 },
        { article: 'NB-068', name: 'Кетчуп', price: 750.00, quantity: 31 },
        { article: 'NB-069', name: 'Горчица', price: 650.00, quantity: 33 },
        { article: 'NB-070', name: 'Хрен', price: 850.00, quantity: 27 },
      ];
      
      for (const productData of testProducts) {
        const product = new Product();
        product.article = productData.article;
        product.name = productData.name;
        product.price = productData.price;
        product.quantity = productData.quantity;
        await productRepository.save(product);
      }
      console.log('Test data seeded successfully');
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error during database initialization:', error);
    process.exit(1);
  });


