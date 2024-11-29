import instance from "../../utils/axios-customize";

const getProductCategories = async (query = "") => {
  const response = await instance.get(`categories?${query}`);
  return response;
};
const createCategory = async (category) => {
  const response = await instance.post(`categories`, category);

  return response;
};

const getProductCategory = async (id) => {
  const response = await instance.get(`categories/${id}`);

  return response;
};

const deleteProductCategory = async (id) => {
  const response = await instance.delete(`categories/${id}`);

  return response;
};
const updateProductCategory = async (category) => {
  const response = await instance.patch(`categories`, category);
  return response;
};
const pCategoryService = {
  getProductCategories,
  createCategory,
  getProductCategory,
  deleteProductCategory,
  updateProductCategory,
};

export default pCategoryService;
