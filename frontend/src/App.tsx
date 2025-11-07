import { useState, useEffect } from "react";
import ProductTable from "./components/ProductTable";
import ProductForm from "./components/ProductForm";
import Pagination from "./components/Pagination";
import { Product } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const limit = 50;

  const fetchProducts = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/products?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      const normalizedProducts = data.data.map((product: any) => ({
        ...product,
        price:
          typeof product.price === "number"
            ? product.price
            : parseFloat(product.price || 0),
        quantity:
          typeof product.quantity === "number"
            ? product.quantity
            : parseInt(product.quantity || 0, 10),
      }));
      setProducts(normalizedProducts);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Ошибка при загрузке товаров");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот товар?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProducts(currentPage);
      } else {
        const error = await response.json();
        alert(error.error || "Ошибка при удалении товара");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Ошибка при удалении товара");
    }
  };

  const handleFormSubmit = async (
    productData: Omit<Product, "id" | "createdAt">
  ) => {
    try {
      const url = editingProduct
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products`;
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingProduct(null);
        fetchProducts(currentPage);
      } else {
        console.log(await response.text());
        const error = await response.json();
        throw new Error(error.error || "Ошибка при сохранении товара");
      }
    } catch (error: any) {
      if (error.error === "Article must be unique") {
        alert("Артикул должен быть уникальным");
      } else {
        alert(error.error || "Ошибка при сохранении товара");
      }
      throw error;
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg border-2 border-gray-300">
          <div className="px-6 py-4 border-b-2 border-gray-300 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Учет товаров</h1>
            {!showForm && (
              <button
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Добавить товар
              </button>
            )}
          </div>

          {showForm ? (
            <div className="p-6">
              <ProductForm
                product={editingProduct}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          ) : (
            <>
              {loading ? (
                <div className="p-8 text-center text-gray-500">Загрузка...</div>
              ) : (
                <ProductTable
                  products={products}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                total={total}
                limit={limit}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
