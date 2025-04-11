import React, { useEffect, useState } from "react";
import { Button, Input, Select, Table } from "antd";
import { FaSyncAlt } from "react-icons/fa";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getInventoryProducts } from "../features/warehouse/warehouseSlice";
const { Search } = Input;
const { Option } = Select;

const WareHouseList = () => {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInventoryProducts());
  }, [dispatch]);

  const inventoryProducts =useSelector(state => state.warehouse?.warehouses);

  console.log("🚀 ~ WareHouseList ~ inventoryProducts:", inventoryProducts);




  const latestEntry = inventoryProducts.length > 0
    ? inventoryProducts.reduce((latest, item) =>
        new Date(item.createdAt) > new Date(latest.createdAt) ? item : latest
      )
    : null;

  // Lọc dữ liệu theo tìm kiếm
  const filteredData = inventoryProducts.filter((item) => {
    return Object.values(item)
      .some((val) =>
        val?.toString().toLowerCase().includes(searchText.toLowerCase())
      );
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      width: 100,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá nhập",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price?.toLocaleString()} đ`,
    },
    {
      title: "Ngày nhập",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("HH:mm:ss DD/MM/YYYY"),
    },
  ];

  return (
    <div>
      <div className="bg-white p-3 rounded shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mx-4 py-3">
          <h3 className="m-0">Danh sách lịch sử nhập hàng</h3>
          {latestEntry && (
            <span className="text-muted fs-6 d-flex align-items-center">
              Dữ liệu mới nhất
              <FaSyncAlt className="ms-2 text-primary" style={{ cursor: "pointer" }} />
              <span className="ms-2 border px-2 py-1 rounded">
                {moment(latestEntry.createdAt).format("HH:mm:ss DD/MM/YYYY")}
              </span>
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "end", marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/admin/warehouse")}>
          Thêm mới
        </Button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>Hiển thị:</span>
          <Select defaultValue={10} style={{ width: 70 }} onChange={(value) => setPageSize(value)}>
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={50}>50</Option>
          </Select>
        </div>

        <div>
          <Search
            placeholder="Tìm kiếm..."
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "210px" }}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) => record._id}
        pagination={{
          pageSize,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong tổng số ${total} bản ghi`,
        }}
      />
    </div>
  );
};

export default WareHouseList;
