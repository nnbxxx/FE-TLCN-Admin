import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";
import instance from "../../utils/axios-customize";

// const getTokenFromLocalStorage = localStorage.get("user")
//   ? JSON.parse(localStorage.getItem("user"))
//   : null;

const login = async (user) => {
  return await instance.post(`auth/login`, user);
};
const getOrders = async (query = "") => {
  const response = await instance.get(`receipts/admin`);
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
