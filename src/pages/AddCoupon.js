import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  createCoupon,
  getACoupon,
  resetState,
  updateACoupon,
} from "../features/coupon/couponSlice";
import { FaCopy, FaSyncAlt } from "react-icons/fa";
import moment from "moment";
import { DatePicker } from "antd";
import dayjs from "dayjs";

let schema = yup.object().shape({
  name: yup.string().required("Coupon Name is Required"),
  code: yup.string().required("Coupon Code is Required"),
  expiry: yup.date().required("Expiry Date is Required"),
  discount: yup.number().required("Discount Percentage is Required"),
});
const AddCoupon = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const getCouponId = location.pathname.split("/")[3];
  const newCoupon = useSelector((state) => state.coupon);

  const {
    isSuccess,
    isError,
    isLoading,
    createdCoupon,
    couponName,
    couponCode,
    couponDiscount,
    couponExpiry,
    updatedCoupon,
  } = newCoupon;

  const changeDateFormet = (date) => {
    const newDate = new Date(date).toLocaleDateString();
    const [month, day, year] = newDate.split("/");
    return [year, month, day].join("-");
  };

  useEffect(() => {
    if (getCouponId !== undefined) {
      dispatch(getACoupon(getCouponId));
    } else {
      dispatch(resetState());
    }
  }, [getCouponId]);

  useEffect(() => {
    if (isSuccess && createdCoupon) {
      toast.success("Coupon Added Successfullly!");
    }
    if (isSuccess && updatedCoupon) {
      toast.success("Coupon Updated Successfullly!");
      navigate("/admin/coupon-list");
    }
    if (isError && couponName && couponDiscount && couponExpiry) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: couponName || "",
      code: couponCode || "",
      expiry: changeDateFormet(couponExpiry) || "",
      discount: couponDiscount || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getCouponId !== undefined) {
        const data = { id: getCouponId, couponData: values };
        dispatch(
          updateACoupon({
            _id: getCouponId,
            code: values.code,
            name: values.name,
            type: "PRICE",
            quantity: 1000,
            couponExpired: values.expiry,
            description: {
              value: values.discount,
              pointAccept: 0,
            },
          })
        );
        dispatch(resetState());
      } else {
        dispatch(
          createCoupon({
            code: values.code,
            name: values.name,
            type: "PRICE",
            quantity: 1000,
            couponExpired: values.expiry,
            description: {
              value: values.discount,
              pointAccept: 0,
            },
          })
        );
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState);
        }, 300);
      }
    },
  });
const [accessTime, setAccessTime] = useState(moment().format("HH:mm:ss DD/MM/YYYY"));

const generateCouponCode = () => {
  const numbers = "0123456789";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  const getRandom = (source, length) =>
    Array.from({ length }, () => source[Math.floor(Math.random() * source.length)]).join("");

  const numericPart = getRandom(numbers, 2); // 2 số đầu
  const letterPart = getRandom(letters, 6); // 6 chữ cái sau

  return numericPart + letterPart;
};


  return (
    <div>
          <div className="bg-white p-3 rounded shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-center mx-4 py-3">
              <h3 className="m-0">
              {getCouponId !== undefined ? "Sửa" : "Thêm"} giảm giá
              </h3>
              {accessTime && (
                <span className="text-muted fs-6 d-flex align-items-center">
                  Thời gian truy cập
                  <FaSyncAlt className="ms-2 text-primary" style={{ cursor: "pointer" }} />
                  <span className="ms-2 border px-2 py-1 rounded">{accessTime}</span>
                </span>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
            
              <div className="bg-white p-4 rounded shadow-sm">
                <h5 className="mb-2">Tổng quan</h5>
                <p className="text-muted small mb-4">Các thông tin cơ bản của mã giảm giá</p>
                  <form action="" onSubmit={formik.handleSubmit}>
                  
                  <label htmlFor="name" className="form-label fw-semibold mb-0">
                    Tiêu đề giảm giá <span className="text-danger">*</span>
                  </label>
                    <CustomInput
                      type="text"
                      name="name"
                      onChng={formik.handleChange("name")}
                      onBlr={formik.handleBlur("name")}
                      val={formik.values.name}
                      label="Nhập tiêu đề giảm giá"
                      id="name"
                    />
                    <div className="error">
                      {formik.touched.name && formik.errors.name}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <label htmlFor="code" className="form-label fw-semibold mb-0">
                        Mã giảm giá <span className="text-danger">*</span>
                      </label>
                      <button
                        type="button"
                        className="btn btn-link p-0 text-decoration-none text-primary"
                        onClick={() => formik.setFieldValue("code", generateCouponCode())}
                        style={{ fontSize: "0.875rem" }}
                      >
                        Tạo mã ngẫu nhiên
                      </button>
                    </div>

                    <CustomInput
                      type="text"
                      name="code"
                      onChng={formik.handleChange("code")}
                      onBlr={formik.handleBlur("code")}
                      val={formik.values.code}
                      label="Nhập mã giảm giá"
                      id="code"
                    />
                    <div className="error">
                      {formik.touched.code && formik.errors.code}
                    </div>

                  <label htmlFor="name" className="form-label fw-semibold mb-0 mt-3">
                    Thời gian bắt đầu <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    className="form-control mt-3 "
                    showTime
                    format="HH:mm DD-MM-YYYY"
                    id="expiry"
                    name="expiry"
                    style={{ width: "100%", height: "60px" , display: "flex", alignItems: "center"}}
                    value={
                      formik.values.expiry && dayjs(formik.values.expiry).isValid()
                        ? dayjs(formik.values.expiry)
                        : null
                    }
                    onChange={(value) => {
                      formik.setFieldValue("expiry", value ? value.toISOString() : null);
                    }}
                    onBlur={() => formik.setFieldTouched("expiry", true)}
                    placeholder="Chọn thời gian bắt đầu"
                  />
                    <div className="error">
                      {formik.touched.expiry && formik.errors.expiry}
                    </div>

                  <label htmlFor="name" className="form-label fw-semibold mb-0 mt-3">
                    Mức giảm giá (%) <span className="text-danger">*</span>
                  </label>
                    <CustomInput
                      type="number"
                      name="discount"
                      onChng={formik.handleChange("discount")}
                      onBlr={formik.handleBlur("discount")}
                      val={formik.values.discount}
                      label="Nhập mức giảm giá"
                      id="discount"
                    />
                    <div className="error">
                      {formik.touched.discount && formik.errors.discount}
                    </div>
                    <button
                      className="btn btn-success border-0 rounded-3 my-3"
                      type="submit"
                    >
                      {getCouponId !== undefined ? "Sửa" : "Thêm"} giảm giá
                    </button>
                  </form>
                </div>
            </div>

            <div className="col-md-4">
              <div className="bg-light p-4 rounded shadow-sm mb-4">
                <h5 className="mb-2">Tóm tắt</h5>
                <p className="text-muted small mb-4">Tổng hợp giảm giá</p>

                <div className="mt-3 mb-4">
                  <div className="d-flex align-items-center justify-content-between bg-white border rounded px-3 py-2">
                    <span className="text-danger small ">{formik.values.code || "(Chưa có mã)"}</span>
                    <FaCopy
                      style={{ cursor: "pointer" }}
                      title="Sao chép mã"
                      className="text-primary"
                      onClick={() => {
                        navigator.clipboard.writeText(formik.values.code || "");
                        toast.success("Đã sao chép mã!");
                      }}
                    />
                  </div>
                </div>

                <ul className="list-unstyled text-muted small">
                  <li className="d-flex justify-content-between">
                    <span><strong>Tên giảm giá:</strong></span>
                    <span>{formik.values.name || "(Chưa nhập)"}</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span><strong>Mã giảm giá:</strong></span>
                    <span>{formik.values.code || "(Chưa nhập)"}</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span><strong>Ngày hết hạn:</strong></span>
                    <span>{formik.values.expiry || "(Chưa chọn)"}</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span><strong>Giảm giá:</strong></span>
                    <span>{formik.values.discount ? `${formik.values.discount}%` : "(Chưa nhập)"}</span>
                  </li>
                </ul>

              </div>
            </div>
          </div>
    </div>
  );
};

export default AddCoupon;
