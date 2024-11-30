import instance from "../../utils/axios-customize";

const getBlogs = async (query = "") => {
  const response = await instance.get(`blog?${query}`);
  return response;
};
const createBlog = async (blog) => {
  const response = await instance.post(`blog/`, blog);
  return response;
};
const updateBlog = async (blog) => {
  const response = await instance.patch(`blog`, blog);
  return response;
};
const getBlog = async (id) => {
  const response = await instance.get(`blog/${id}`);
  return response;
};

const deleteBlog = async (id) => {
  const response = await instance.delete(`blog/${id}`);
  return response;
};
const blogService = {
  getBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
};

export default blogService;
