import instance from "../../utils/axios-customize";

const getInfoByTime  = async (query = "") => {
  const response = await instance.get(`dashboard/info-time?type=${query}`);
  return response;
};

const postDashboardRevenue = async (data) => {
  const response = await instance.post(`dashboard/revenue`, data);

  return response;
};

const getDashboardInfo = async () => {
  const response = await instance.get(`dashboard/info`);

  return response;
};


const dashboardService = {
  getInfoByTime ,
  postDashboardRevenue,
  getDashboardInfo,

};

export default dashboardService;
