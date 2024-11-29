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
const getOrders = async (data) => {
  const response = await axios.get(`${base_url}user/getallorders`, data);

  return response.data;
};
const getOrder = async (id) => {
  const response = await axios.get(
    `${base_url}user/getaOrder/${id}`,

    config
  );

  return response.data;
};

const updateOrder = async (data) => {
  const response = await axios.put(
    `${base_url}user/updateOrder/${data.id}`,
    { status: data.status },
    config
  );

  return response.data;
};

const getMonthlyOrders = async (data) => {
  const response = await axios.get(
    `${base_url}user/getMonthWiseOrderIncome`,

    data,
    {
      headers: {
        "ngrok-skip-browser-warning": "69420",
      },
    }
  );

  return response.data;
};

const getYearlyStats = async (data) => {
  const response = await axios.get(
    `${base_url}user/getyearlyorders`,

    data,
    {
      headers: {
        "ngrok-skip-browser-warning": "69420",
      },
    }
  );

  return response.data;
};

const authService = {
  login,
  getOrders,
  getOrder,
  getMonthlyOrders,
  getYearlyStats,
  updateOrder,
};

export default authService;
