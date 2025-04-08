import instance from "../../utils/axios-customize";


const createWarehouse = async (warehouse) => {
  const response = await instance.post(`inventory-product/import-stock`, warehouse);

  return response;
};

const warehouseService = {

createWarehouse
};

export default warehouseService;
