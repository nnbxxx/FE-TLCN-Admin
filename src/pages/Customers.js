import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Form, Input, message, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  blockUser,
  unblockUser,
  updateUser,
} from "../features/cutomers/customerSlice";
import styled from "styled-components";
import { EditOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import moment from "moment/moment";
import { FaSyncAlt } from "react-icons/fa";
import "../Css/CssCustomers.css"

const { Search } = Input;

const { Option } = Select;

const RoleTag = styled(Tag)`
  &.User {
    background-color: #f3f0ff;
    color: purple;
  }
  &.Admin {
    background-color: #e6fffb;
    color: green;
  }
`;

const columns = (editUser, handleBlock, handleUnblock) => [
  {
    title: "Id",
    dataIndex: "_id",
  },
  {
    title: "Họ và tên",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
    render: (text, record) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={record.avatar || "https://via.placeholder.com/50"}
          alt={text}
          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "50%" }}
        />
        <span>{text.length > 20 ? text.substring(0, 20) + "..." : text}</span>
      </div>
    ),
  },
  
  {
    title: "Email",
    dataIndex: "email",
  },
  // {
  //   title: "Mobile",
  //   dataIndex: "mobile",
  // },
  {
    title: "Vai trò",
    dataIndex: "role",
    render: (role) => {
      let color = "";
      if (role === "admin") {
        color = "green";
      } else {
        color = "orange";
      }
      return (
        <RoleTag className={role} color={color}>
          {role}
        </RoleTag>
      );
    },
  },
  {
    title: "",
    render: (text, record) => (
      <div style={{ display: "flex", gap: "10px" }}>
        <EditOutlined
          style={{ color: "green", cursor: "pointer", fontSize: "20px" }}
          onClick={() => editUser(record)}
        />
        {record.isBlocked ? (
          <UnlockOutlined
            style={{ color: "green", cursor: "pointer", fontSize: "20px" }}
            onClick={() => handleUnblock(record._id)}
          />
        ) : (
          <LockOutlined
            style={{ color: "red", cursor: "pointer", fontSize: "20px" }}
            onClick={() => handleBlock(record._id)}
          />
        )}
      </div>
    ),
  },
];

const Customers = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const customerState = useSelector((state) => state.customer.customers);
  const data1 = customerState.map((customer, index) => ({
    _id: customer._id,
    name: `${customer.name}`,
    email: customer.email,
    role: customer.role,
    isBlocked: customer.isBlocked,
  }));

  const handleEditUser = (user) => {
    setCurrentUser({
      ...user,
    });
    setIsModalVisible(true);
  };

  const handleBlockUser = (Id) => {
    dispatch(blockUser(Id))
      .unwrap()
      .then(() => {
        message.success("User blocked successfully");
        dispatch(getUsers());
      })
      .catch((error) => {
        console.error("Failed to block user:", error);
        message.error(`Failed to block user: ${error}`);
      });
  };

  const handleUnblockUser = (Id) => {
    dispatch(unblockUser(Id))
      .unwrap()
      .then(() => {
        message.success("User unblocked successfully");
        dispatch(getUsers());
      })
      .catch((error) => {
        console.error("Failed to unblock user:", error);
        message.error(`Failed to unblock user: ${error}`);
      });
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch(updateUser({ _id: currentUser._id, role: values.role }))
          .unwrap()
          .then(() => {
            message.success("User updated successfully");
            setIsModalVisible(false);
            dispatch(getUsers());
            setCurrentUser(null);
          })
          .catch((error) => {
            console.error("Failed to update user:", error);
            message.error(`Failed to update user: ${error}`);
          });
      })
      .catch((info) => {});
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentUser(null);
  };

  const [form] = Form.useForm();

  useEffect(() => {
    if (currentUser) {
      const { name, email, ...rest } = currentUser;
      form.setFieldsValue({
        name: currentUser.name,
        email,
        ...rest,
      });
    }
  }, [currentUser, form]);

  const customers = useSelector((state) => state.customer.customers);
  const latestcustomers = customers.length > 0 
    ? customers.reduce((latest, customer) => 
        new Date(customer.createdAt) > new Date(latest.createdAt) ? customer : latest
      )
    : null;

    // Lấy danh sách danh mục (không trùng lặp)
  const user = [...new Set(customers?.map((customer) => customer.role))];

  // Lọc sản phẩm theo danh mục hoặc tìm kiếm
    const filteredUser = customers?.filter((customer) => {
    const matchesCategory = selectedCategory ? customer.role === selectedCategory : true;
    const matchesSearch = Object.values(customer)
      .some((value) => value?.toString().toLowerCase().includes(searchText.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  const authState = useSelector((state) => state?.auth?.user);

  return (
    <div>
          <div className="bg-white rounded shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-center mx-4 py-3">
             <div>
                <h3 className="m-0">Người dùng</h3>
                <div className="text-muted mt-1" style={{ fontSize: "14px" }}>
                  Chào {authState?.name || "bạn"}, chào mừng bạn quay trở lại trang quản trị của Sắc
                </div>
              </div>

              {latestcustomers && (
                <span className="text-muted fs-6 d-flex align-items-center">
                  Dữ liệu mới nhất
                  <FaSyncAlt className="ms-2 text-primary" style={{ cursor: "pointer" }} />
                  <span className="ms-2 border px-2 py-1 rounded">
                    {moment(latestcustomers.createdAt).format("HH:mm:ss DD/MM/YYYY")}
                  </span>
                </span>
              )}
            </div>
          </div>

      {/* Bộ lọc và tìm kiếm */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        {/* Phần "Hiển thị" nằm bên trái */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ marginRight: 8 }}>Hiển thị:</span>
          <Select
                  defaultValue={10}
                  style={{ width: 60 }}
                  onChange={(value) => setPageSize(value)}
                >
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={20}>20</Option>
                    <Option value={50}>50</Option>
              </Select>
        </div>

        {/* Phần danh mục và tìm kiếm nằm bên phải */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Select
            placeholder="Lọc theo danh mục"
            allowClear
            style={{ width: "170px" }}
            onChange={(value) => setSelectedCategory(value)}
          >
            {user.map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>

          <Search
            placeholder="Tìm kiếm..."
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "210px" }}
          />
        </div>
      </div>


      <div>
        <Table
          className="compact-table"
          style={{ border: "1px solid #d9d9d9", borderRadius: 4 }}
          columns={columns(handleEditUser, handleBlockUser, handleUnblockUser)}
          // dataSource={data1}
          dataSource={filteredUser || []}
          rowKey={(record) => record._id || record.key}
          pagination={{
          pageSize,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong tổng số ${total} người dùng`,
        }}
        />
      </div>
      <Modal
        title="Edit User"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input the email!" }]}
          >
            <Input disabled />
          </Form.Item>
          {/* <Form.Item
            name="mobile"
            label="Mobile"
            rules={[
              { required: true, message: "Please input the mobile number!" },
            ]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select placeholder="Select a role">
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Customers;
