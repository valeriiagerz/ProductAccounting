import { useState, useEffect } from "react";
import { Product } from "../types";

interface ProductFormProps {
  product: Product | null;
  onSubmit: (data: Omit<Product, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
}

const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    article: "",
    price: "",
    quantity: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        article: product.article,
        price: (typeof product.price === "number"
          ? product.price
          : parseFloat(product.price)
        ).toString(),
        quantity: (typeof product.quantity === "number"
          ? product.quantity
          : parseInt(product.quantity, 10)
        ).toString(),
      });
    }
  }, [product]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Название обязательно для заполнения";
    }

    if (!formData.article.trim()) {
      newErrors.article = "Артикул обязателен для заполнения";
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = "Цена должна быть числом больше 0";
    }

    const quantity = parseInt(formData.quantity);
    if (formData.quantity === "" || isNaN(quantity) || quantity < 0) {
      newErrors.quantity = "Количество должно быть числом >= 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        name: formData.name.trim(),
        article: formData.article.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      });
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {product ? "Редактировать товар" : "Добавить новый товар"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {product
            ? "Измените информацию о товаре"
            : "Заполните форму для добавления нового товара"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Название товара <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Введите название товара"
              className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name
                  ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            />
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <span>⚠</span> {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="article"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Артикул <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="article"
              value={formData.article}
              onChange={(e) => handleChange("article", e.target.value)}
              placeholder="Например: NB-001"
              className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.article
                  ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            />
          </div>
          {errors.article && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <span>⚠</span> {errors.article}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Цена, ₽ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              ₽
            </span>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0.01"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="0.00"
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.price
                  ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            />
          </div>
          {errors.price && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <span>⚠</span> {errors.price}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Количество на складе <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              id="quantity"
              min="0"
              value={formData.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              placeholder="0"
              className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.quantity
                  ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            />
          </div>
          {errors.quantity && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <span>⚠</span> {errors.quantity}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Сохранение...
            </span>
          ) : product ? (
            "Сохранить изменения"
          ) : (
            "Добавить товар"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Отмена
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
