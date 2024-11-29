import instance from "../../utils/axios-customize";

const getColors = async (query = "") => {
  const response = await instance.get(`color?${query}`);

  return response;
};
const createColor = async (color) => {
  const response = await instance.post(`color`, color);

  return response;
};

const updateColor = async (color) => {
  const response = await instance.patch(`color`, color);

  return response;
};
const getColor = async (id) => {
  const response = await instance.get(`color/${id}`);

  return response;
};

const deleteColor = async (id) => {
  const response = await instance.delete(`color/${id}`);
  return response;
};
const colorService = {
  getColors,
  createColor,
  updateColor,
  getColor,
  deleteColor,
};

export default colorService;
