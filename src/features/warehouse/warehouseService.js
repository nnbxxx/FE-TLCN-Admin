import instance from "../../utils/axios-customize";

const getInventoryProduct = async (query = "") => {
  const response = await instance.get(`inventory-product?${query}`);
  return response;
};

const createWarehouse = async (warehouse) => {
  const response = await instance.post(`inventory-product/import-stock`, warehouse);

  return response;
};
const getBestSellingProducts = async () => {
  const response = await instance.get(
    "inventory-product?current=1&pageSize=5&sort=-totalQuantitySell"
  );
  return response;
};

const warehouseService = {
  getInventoryProduct,
  createWarehouse,
  getBestSellingProducts
};

export default warehouseService;
