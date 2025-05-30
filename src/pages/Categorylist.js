import React, { useEffect, useState } from "react";
import { Button, Input, Select, Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteAProductCategory,
  getCategories,
  resetState,
} from "../features/pcategory/pcategorySlice";
import CustomModal from "../components/CustomModal";
import { render } from "@testing-library/react";
import { FaSyncAlt } from "react-icons/fa";
import moment from "moment/moment";
import { DeleteOutlined, EditFilled, PlusOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Option } = Select;

const Categorylist = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10); 
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [pCatId, setpCatId] = useState("");
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (index, item) => {
        return (
          <>
            <Link
              to={`/admin/category/${item._id}`}
              className=" fs-3 text-success"
            >
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
  const showModal = (e) => {
    setOpen(true);
    setpCatId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getCategories());
  }, []);
  const pCatStat = useSelector((state) => state.pCategory.pCategories);

  const deleteCategory = (e) => {
    dispatch(deleteAProductCategory(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getCategories());
    }, 100);
  };

  const categorys = useSelector((state) => state?.pCategory?.pCategories || []);
    const latestcategorys = categorys.length > 0 
        ? categorys.reduce((latest, product) => 
            new Date(product.createdAt) > new Date(latest.createdAt) ? product : latest
          )
        : null;

 // Lấy danh sách danh mục (không trùng lặp)
 const categoryss = [...new Set(categorys?.map((pCategory) => pCategory.pCategories))];

 // Lọc sản phẩm theo danh mục hoặc tìm kiếm
 const filteredcategory = categorys?.filter((pCategory) => {
   const matchesCategory = selectedCategory ? pCategory.pCategories === selectedCategory : true;
   const matchesSearch = Object.values(pCategory)
     .some((value) => value?.toString().toLowerCase().includes(searchText.toLowerCase()));
   return matchesCategory && matchesSearch;
 });

  return (
    <div>
              <div className="bg-white p-3 rounded shadow-sm mb-4">
                <div className="d-flex justify-content-between align-items-center mx-4 py-3">
                  <h3 className="m-0">Danh sách danh mục sản phẩm</h3>
                  {latestcategorys && (
                    <span className="text-muted fs-6 d-flex align-items-center">
                      Dữ liệu mới nhất
                      <FaSyncAlt className="ms-2 text-primary" style={{ cursor: "pointer" }} />
                      <span className="ms-2 border px-2 py-1 rounded">
                        {moment(latestcategorys.createdAt).format("HH:mm:ss DD/MM/YYYY")}
                      </span>
                    </span>
                  )}
                </div>
              </div>

               {/* Nút thêm mới sản phẩm */}
               <div style={{ display: "flex", justifyContent: "end", marginBottom: 16 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/admin/category")}>
                    Thêm mới
                  </Button>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  {/* Phần "Hiển thị" nằm bên trái */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ marginRight: 8, color: "white"}}>Hiển thị:</span>
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
                    

                    <Search
                      placeholder="Tìm kiếm..."
                      allowClear
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: "210px" }}
                    />
                  </div>
                </div> 

      <div>
        <Table columns={columns}
        //  dataSource={pCatStat} 
        className="compact-table"
          dataSource={filteredcategory || []}
         rowKey={(record) => record._id || record.key}
          pagination={{
          pageSize,
          showSizeChanger: false,
          showTotal: (total, range) => (
            <span style={{ color: "white" }}>
              {range[0]}-{range[1]} trong tổng số {total} danh mục sản phẩm
            </span>
          )

        }}

        />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteCategory(pCatId);
        }}
        title="Are you sure you want to delete this Product Category?"
      />
    </div>
  );
};

export default Categorylist;
