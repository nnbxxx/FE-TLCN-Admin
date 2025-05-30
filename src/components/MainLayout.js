import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined, WechatOutlined } from "@ant-design/icons";
import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineBgColors,
  AiOutlineLogout,
} from "react-icons/ai";

import { RiCoupon3Line, RiCouponLine } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";
import { ImBlog } from "react-icons/im";
import { FaClipboardList, FaBloggerB, FaWarehouse } from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import { BiCategoryAlt } from "react-icons/bi";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/LogoS.png";
import instance from "../../src/utils/axios-customize";
import { TbBuildingWarehouse, TbTruckDelivery } from "react-icons/tb";
import { VscGraphLine } from "react-icons/vsc";
import "../App.css";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const authState = useSelector((state) => state?.auth?.user);

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.clear();
    window.location.reload();
    const res = await instance.post("auth/logout");
    if (res && res.data) {
      toast.success({ content: "Logout Success" });
    }
  };
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} 
      style={{
        background: 'radial-gradient(circle, rgba(0,82,72,1) 0%, rgba(0,46,41,1) 66%, rgba(0,0,0,1) 100%)',
      }}>
       <div
        className="logo"
        style={{
        background: 'radial-gradient(circle, rgba(0,82,72,1) 0%, rgba(0,46,41,1) 66%, rgba(0,0,0,1) 100%)',
          padding: "10px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ width: "80px", height: "auto" }}
        />
        <div
          style={{
            width: "80%",
            borderBottom: "1px solid white",
            marginTop: "10px"
          }}
        ></div>
      </div>

        <Menu
          theme="dark"
          mode="inline"
          className="custom-admin-menu"
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            if (key === "signout") {
              handleLogout();
            } else {
              navigate(key);
            }
          }}
          items={[
            {
              key: "",
              icon: <AiOutlineDashboard className="fs-4" />,
              label: "Dashboard",
            },
            {
              key: "customers",
              icon: <AiOutlineUser className="fs-4" />,
              label: "Customers",
            },
            {
              key: "messages",
              icon: <WechatOutlined className="fs-4" />,
              label: "Messages",
            },
            {
              key: "Catalog",
              icon: <AiOutlineShoppingCart className="fs-4" />,
              label: "Catalog",
              children: [
                {
                  key: "product",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Add Product",
                },
                {
                  key: "list-product",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Product List",
                },
                {
                  key: "brand",
                  icon: <SiBrandfolder className="fs-4" />,
                  label: "Brand",
                },
                {
                  key: "list-brand",
                  icon: <SiBrandfolder className="fs-4" />,
                  label: "Brand List ",
                },
                {
                  key: "category",
                  icon: <BiCategoryAlt className="fs-4" />,
                  label: "Category",
                },
                {
                  key: "list-category",
                  icon: <BiCategoryAlt className="fs-4" />,
                  label: "Category List",
                },
                {
                  key: "color",
                  icon: <AiOutlineBgColors className="fs-4" />,
                  label: "Color",
                },
                {
                  key: "list-color",
                  icon: <AiOutlineBgColors className="fs-4" />,
                  label: "Color List",
                },
              ],
            },
            {
              key: "warehouse",
              icon: <FaWarehouse className="fs-4" />,
              label: "WareHouse",
              children: [
                {
                  key: "stock-inventory",
                  icon: <VscGraphLine className="fs-4" />,
                  label: "Inventory Statistics",
                },
                {
                  key: "warehouse",
                  icon: <ImBlog className="fs-4" />,
                  label: "Import Products",
                },
                {
                  key: "warehouse-list",
                  icon: <TbBuildingWarehouse  className="fs-4" />,
                  label: "Inbound History",
                },
                {
                  key: "history-delivery",
                  icon: <TbTruckDelivery  className="fs-4" />,
                  label: "Outbound History",
                },
              ],
            },
            {
              key: "orders",
              icon: <FaClipboardList className="fs-4" />,
              label: "Orders",
            },
            {
              key: "marketing",
              icon: <RiCouponLine className="fs-4" />,
              label: "Marketing",
              children: [
                
                {
                  key: "coupon",
                  icon: <ImBlog className="fs-4" />,
                  label: "Add Coupon",
                },
                {
                  key: "coupon-list",
                  icon: <RiCouponLine className="fs-4" />,
                  label: "Coupon List",
                },
              ],
            },
            {
              key: "blogs",
              icon: <FaBloggerB className="fs-4" />,
              label: "Blogs",
              children: [
                {
                  key: "blog",
                  icon: <ImBlog className="fs-4" />,
                  label: "Add Blog",
                },
                {
                  key: "blog-list",
                  icon: <FaBloggerB className="fs-4" />,
                  label: "Blog List",
                },
                {
                  key: "blog-category",
                  icon: <ImBlog className="fs-4" />,
                  label: "Add Blog Category",
                },
                {
                  key: "blog-category-list",
                  icon: <FaBloggerB className="fs-4" />,
                  label: "Blog Category List",
                },
              ],
            },
            {
              key: "enquiries",
              icon: <FaClipboardList className="fs-4" />,
              label: "Enquiries",
            },
            {
              key: "signout",
              icon: <AiOutlineLogout className="fs-4" />,
              label: "Sign Out",
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="d-flex gap-4 align-items-center">
            <div className="d-flex gap-3 align-items-center">
              {/* Dropdown content */}
              <div>
                <img
                  width={60}
                  height={60}
                  src={authState?.avatar}
                  alt=""
                  style={{
                    borderRadius: "50%", // Làm ảnh thành hình tròn
                    objectFit: "cover", // Đảm bảo ảnh vừa khung
                  }}
                />
              </div>
              <div className="dropdownMenuLink">
                <h5 className="mb-0">{authState?.name}</h5>
                <p className="mb-0">{authState?.email}</p>
              </div>
            </div>
          </div>

        </Header>
        <Content
          style={{
            // margin: "24px 16px",
            padding: 40,
            minHeight: 280,
            background: "radial-gradient(circle, rgba(0,82,72,1) 0%, rgba(0,46,41,1) 66%, rgba(0,0,0,1) 100%)",
           backgroundClip: "padding-box",
             }}
        >
          <ToastContainer
            position="top-right"
            autoClose={250}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
