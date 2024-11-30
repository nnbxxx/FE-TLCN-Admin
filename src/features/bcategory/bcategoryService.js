import instance from "../../utils/axios-customize";

const getBlogCategories = async (query = "") => {
  const response = await instance.get(`blog-category?${query}`);

  return response;
};
const createBlogCategory = async (bcat) => {
  const response = await instance.post(`blog-category`, bcat);

  return response;
};
const updateBlogCategory = async (blogCat) => {
  const response = await instance.patch(`blog-category`, blogCat);

  return response;
};
const getBlogCategory = async (id) => {
  const response = await instance.get(`blog-category/${id}`);

  return response;
};

const deleteBlogCategory = async (id) => {
  const response = await instance.delete(`blog-category/${id}`);

  return response;
};
const bCategoryService = {
  getBlogCategories,
  createBlogCategory,
  deleteBlogCategory,
  getBlogCategory,
  deleteBlogCategory,
  updateBlogCategory,
};

export default bCategoryService;
