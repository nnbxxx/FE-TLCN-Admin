import instance from "../../utils/axios-customize";

const getProducts = async (query = "") => {
  const response = await instance.get(`products?${query}`);
  return response;
};
const createProduct = async (product) => {
  const response = await instance.post(`products`, product);

  return response;
};

const getProduct = async (id) => {
  const response = await instance.get(`products/${id}`);

  return response;
};

const updateProduct = async (product) => {
  const response = await instance.patch(`products`, product);

  return response;
};

const deleteproduct = async (id) => {
  const response = await instance.delete(`products/${id}`);

  return response;
};

const productService = {
  getProducts,
  createProduct,
  deleteproduct,
  updateProduct,
  getProduct,
};

export default productService;
