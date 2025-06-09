import React, { useEffect } from 'react';
import CustomInput from '../components/CustomInput';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import logo from '../assets/Logo_Sac.png'; // Adjust the path as needed
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './../Css/Login.css'
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

let schema = yup.object().shape({
  email: yup
    .string()
    .email('Email should be valid')
    .required('Email is Required'),
  password: yup.string().required('Password is Required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(
        login({
          username: values.email,
          password: values.password,
        }),
      );
    },
  });
  const authState = useSelector((state) => state);
  console.log(authState);

  const { user, isError, isSuccess, isLoading, message } = authState.auth;

  useEffect(() => {
    if (isSuccess) {
      window.location.href = '/admin';
    }
  }, [user, isError, isSuccess, isLoading]);

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
      />
      <div className="login-container">
      {/* <div className="login-image-wrapper">
          <img
            src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1749462206/Kho%CC%82ng_Co%CC%81_Tie%CC%82u_%C4%90e%CC%82%CC%8018_20250609163901_tbpcbf.png"
            alt="Decor"
            className="login-side-image"
          />
        </div> */}
        <div className="login-box">
        <img
          src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1749462206/Kho%CC%82ng_Co%CC%81_Tie%CC%82u_%C4%90e%CC%82%CC%8018_20250609163901_tbpcbf.png"
          alt="Decor"
          className="login-side-image-inside"
        />
        <img
          src="https://res.cloudinary.com/dy7jzx0wn/image/upload/v1749464942/Photoroom_20250609_172744_qtpgpn.png"
          alt="Decor Right"
          className="login-side-image-right"
        />

          <img src={logo} alt="Sac Logo" className="login-logo" />
          <h3 className="login-title">Chào mừng bạn đến với Sắc</h3>
          <form onSubmit={formik.handleSubmit}>
            <div className="input-icon-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="text"
                id="email"
                name="email"
                className="form-control"
                placeholder="Email"
                onChange={formik.handleChange('email')}
                onBlur={formik.handleBlur('email')}
                value={formik.values.email}
              />
            </div>
            <div className="login-error">
              {formik.touched.email && formik.errors.email}
            </div>
            <div className="input-icon-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="pass"
                name="password"
                className="form-control"
                placeholder="Mật khẩu"
                onChange={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                value={formik.values.password}
              />
              <span
                className="toggle-password-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="login-error">
              {formik.touched.password && formik.errors.password}
            </div>

            <div className="remember-me">
              <input type="checkbox" id="rememberMe" name="rememberMe" />
              <label htmlFor="rememberMe" className="ms-2">Ghi nhớ tôi</label>
            </div>

            <button className="custom-login-button" type="submit">
              Đăng Nhập
            </button>
          </form>
        </div>
      </div>

    </>
  );
};



export default Login;
