import instance from "../../utils/axios-customize";
const getBrands = async (query = "") => {
  const response = await instance.get(`brand?${query}`);

  return response;
};

const createBrand = async (brand) => {
  const response = await instance.post(`brand`, brand);

  return response;
};
const updateBrand = async (brand) => {
  const response = await instance .patch(`brand`, brand);
  return response;
};
const getBrand = async (id) => {
  const response = await instance.get(`brand/${id}`);

  return response;
};

const deleteBrand = async (id) => {
  const response = await instance.delete(`brand/${id}`);

  return response;
};

const brandService = {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
};

export default brandService;
