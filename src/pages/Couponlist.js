import React, { useEffect, useState } from "react";
import { Button, Input, Select, Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteACoupon,
  getAllCoupon,
  resetState,
} from "../features/coupon/couponSlice";
import CustomModal from "../components/CustomModal";
import { render } from "@testing-library/react";
import { convertISOToDate } from "../utils/dayUltils";
import moment from "moment/moment";
import { FaSyncAlt } from "react-icons/fa";
import { DeleteOutlined, EditFilled, PlusOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Option } = Select;

const Couponlist = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10); 
    const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [couponId, setcouponId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setcouponId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getAllCoupon());
  }, []);
  const couponState = useSelector((state) => state.coupon.coupons);

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      width: 100,
    },

    {
      title: "Code",
      dataIndex: "code",
      sorter: (a, b) => a.code.length - b.code.length,
    },
    {
      title: "Discount",
      dataIndex: "description",
      sorter: (a, b) => a.discount - b.discount,
      render: (index, item) => {
        return item.description.value;
      },
    },
    {
      title: "Expiry",
      dataIndex: "couponExpired",
      sorter: (a, b) => a.couponExpired.length - b.couponExpired.length,
      render: (index, item) => {
        return convertISOToDate(item.couponExpired);
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (index, item) => {
        return (
          <>
            <Link
              to={`/admin/coupon/${item._id}`}
              className=" fs-3 text-danger"
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

  const deleteCoupon = (e) => {
    dispatch(deleteACoupon(e));

    setOpen(false);
    setTimeout(() => {
      dispatch(getAllCoupon());
    }, 100);
  };


   const discounts = useSelector((state) => state.coupon.coupons);
    const latestdiscounts = discounts.length > 0 
      ? discounts.reduce((latest, customer) => 
          new Date(customer.createdAt) > new Date(latest.createdAt) ? customer : latest
        )
      : null;

       // Lấy danh sách danh mục (không trùng lặp)
 const discountes = [...new Set(discounts?.map((coupon) => coupon.coupons))];

 // Lọc sản phẩm theo danh mục hoặc tìm kiếm
 const filteredcoupons = discounts?.filter((coupon) => {
   const matchesCategory = selectedCategory ? coupon.coupons === selectedCategory : true;
   const matchesSearch = Object.values(coupon)
     .some((value) => value?.toString().toLowerCase().includes(searchText.toLowerCase()));
   return matchesCategory && matchesSearch;
 });

  return (
    <div>
    <div className="bg-white p-3 rounded shadow-sm mb-4">
          <div className="d-flex justify-content-between align-items-center mx-4 py-3">
            <h3 className="m-0">Danh sách mã giảm giá</h3>
              {latestdiscounts && (
                <span className="text-muted fs-6 d-flex align-items-center">
                  Dữ liệu mới nhất
                  <FaSyncAlt className="ms-2 text-primary" style={{ cursor: "pointer" }} />
                <span className="ms-2 border px-2 py-1 rounded">
                    {moment(latestdiscounts.createdAt).format("HH:mm:ss DD/MM/YYYY")}
                </span>
                </span>
               )}
              </div>
          </div> 

          <div style={{ display: "flex", justifyContent: "end", marginBottom: 16 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/admin/coupon")}>
                    Thêm mới
                  </Button>
                </div>

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
        // dataSource={couponState} 
        dataSource={filteredcoupons || []}
         rowKey={(record) => record._id || record.key}
          pagination={{
          pageSize,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong tổng số ${total} danh mục giảm giá`,
        }}
        />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteCoupon(couponId);
        }}
        title="Are you sure you want to delete this Coupon?"
      />
    </div>
  );
};

export default Couponlist;
