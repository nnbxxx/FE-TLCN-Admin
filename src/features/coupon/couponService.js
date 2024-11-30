import instance from "../../utils/axios-customize";

const getCoupons = async (query = "") => {
  const response = await instance.get(`coupons?${query}`);

  return response;
};

const createCoupons = async (coupon) => {
  const response = await instance.post(`coupons`, coupon);

  return response;
};
const updateCoupon = async (coupon) => {
  const response = await instance.patch(`coupons`, coupon);

  return response;
};
const getCoupon = async (id) => {
  const response = await instance.get(`coupons/${id}`);

  return response;
};

const deleteCoupon = async (id) => {
  const response = await instance.delete(`coupons/${id}`);

  return response;
};
const couponService = {
  getCoupons,
  createCoupons,
  deleteCoupon,
  getCoupon,
  updateCoupon,
};

export default couponService;
