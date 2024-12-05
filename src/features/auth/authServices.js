import instance from "../../utils/axios-customize";


const login = async (user) => {
  return await instance.post(`auth/login`, user);
};
const getOrders = async (query = "") => {
  const response = await instance.get(`receipts/admin?${query}`);
  return response;
};
const getOrder = async (id) => {
  const response = await instance.get(`receipts/${id}`);

  return response;
};

const updateOrder = async (data) => {
  const response = await instance.patch(`receipts/status`, data);
  return response;
};

const getMonthlyOrders = async (data) => {
  const response = await instance.get(
    `user/getMonthWiseOrderIncome`,

    data
  );

  return response;
};

const getYearlyStats = async (data) => {
  const response = await instance.get(
    `user/getyearlyorders`,

    data
  );

  return response;
};

const authService = {
  login,
  getOrders,
  getOrder,
  updateOrder,
  getMonthlyOrders,
  getYearlyStats,
};

export default authService;
