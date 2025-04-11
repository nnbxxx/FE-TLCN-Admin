import instance from "../../utils/axios-customize";

const getInventoryProduct = async (query = "") => {
  const response = await instance.get(`inventory-product?${query}`);
  return response;
};

const createWarehouse = async (warehouse) => {
  const response = await instance.post(`inventory-product/import-stock`, warehouse);

  return response;
};

const warehouseService = {
  getInventoryProduct,
  createWarehouse
};

export default warehouseService;
