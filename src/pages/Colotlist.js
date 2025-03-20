import React, { useEffect, useState } from "react";
import { Button, Input, Select, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteAColor, getColors } from "../features/color/colorSlice";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import CustomModal from "../components/CustomModal";
import { render } from "@testing-library/react";
import { FaSyncAlt } from "react-icons/fa";
import moment from "moment/moment";
import { DeleteOutlined, EditFilled, PlusOutlined } from "@ant-design/icons";


const Colorlist = () => {
  const [open, setOpen] = useState(false);
  const [colorId, setcolorId] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("");
   const [searchText, setSearchText] = useState("");
     const [pageSize, setPageSize] = useState(10); 
  const showModal = (e) => {
    setOpen(true);
    setcolorId(e);
  };
const navigate = useNavigate();
  const hideModal = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  const { Search } = Input;
const { Option } = Select;
  useEffect(() => {
    dispatch(getColors());
  }, []);
  const colorState = useSelector((state) => state.color.colors);
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      width: 100,
    },
    {
      title: "Color",
      dataIndex: "Color",
      render: (index, item) => {
        return (
          <div className="col-3">
            <ul
              className="colors ps-0"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                marginBottom: "10px",

                backgroundColor: item.color,
              }}
            ></ul>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (index, item) => {
        return (
          <>
            <Link to={`/admin/color/${item._id}`} className=" fs-3 text-danger">
              <BiEdit />
            </Link>
            <button
              className="ms-3 fs-3 text-danger bg-transparent border-0"
              onClick={() => showModal(item._id)}
            >
              <AiFillDelete />
            </button>
          </>
        );
      },
    },
  ];

  const deleteColor = (e) => {
    dispatch(deleteAColor(e));

    setOpen(false);
    setTimeout(() => {
      dispatch(getColors());
    }, 100);
  };
  const colors = useSelector((state) => state?.color.colors || []);
    const latestcolors = colors.length > 0 
        ? colors.reduce((latest, product) => 
            new Date(product.createdAt) > new Date(latest.createdAt) ? product : latest
          )
        : null;

      // Lấy danh sách danh mục (không trùng lặp)
  const colores = [...new Set(colors?.map((color) => color.color))];

  // Lọc sản phẩm theo danh mục hoặc tìm kiếm
  const filteredbrand = colors?.filter((color) => {
    const matchesCategory = selectedCategory ? color.color === selectedCategory : true;
    const matchesSearch = Object.values(color)
      .some((value) => value?.toString().toLowerCase().includes(searchText.toLowerCase()));
    return matchesCategory && matchesSearch;
  });    
  return (
    <div>
              <div className="bg-white p-3 rounded shadow-sm mb-4">
                <div className="d-flex justify-content-between align-items-center mx-4 py-3">
                  <h3 className="m-0">Danh sách màu sắc</h3>
                  {latestcolors && (
                    <span className="text-muted fs-6 d-flex align-items-center">
                      Dữ liệu mới nhất
                      <FaSyncAlt className="ms-2 text-primary" style={{ cursor: "pointer" }} />
                      <span className="ms-2 border px-2 py-1 rounded">
                        {moment(latestcolors.createdAt).format("HH:mm:ss DD/MM/YYYY")}
                      </span>
                    </span>
                  )}
                </div>
              </div>
                 {/* Nút thêm mới sản phẩm */}
                 <div style={{ display: "flex", justifyContent: "end", marginBottom: 16 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/admin/color")}>
                    Thêm mới
                  </Button>
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

       
      </div>               
      
      <div>
        <Table columns={columns} 
        dataSource={filteredbrand || []}
         rowKey={(record) => record._id || record.key}
          pagination={{
          pageSize,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong tổng số ${total} màu sắc`,
        }}
        />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteColor(colorId);
        }}
        title="Are you sure you want to delete this color?"
      />
    </div>
  );
};

export default Colorlist;
