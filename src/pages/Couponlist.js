import React, { useEffect, useState } from "react";
import { Button, Input, Select, Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete, AiOutlineCopy } from "react-icons/ai";
import { RiCoupon3Line } from "react-icons/ri";
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
import { message } from "antd";
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
      title: "Têm khuyến mãi",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <span title={text}>
          {text && text.length > 15 ? `${text.slice(0, 15)}...` : text}
        </span>
      ),
    },
    {
      title: "Mã khuyến mãi",
      dataIndex: "code",
      sorter: (a, b) => a.code.length - b.code.length,
      render: (code) => {
        const handleCopy = () => {
          navigator.clipboard.writeText(code);
          message.success("Đã sao chép mã khuyến mãi");
        };
    
        return (
          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "8px 12px",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <RiCoupon3Line style={{ color: "red", fontSize: "18px" }} />
              <span style={{ color: "red", fontWeight: 600 }}>{code}</span>
            </div>
            <button
              onClick={handleCopy}
              style={{
                background: "transparent",
                border: "none",
                color: "#888",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              <AiOutlineCopy />
            </button>
          </div>
        );
      },
    },
    {
      title: "Giá trị",
      dataIndex: "description",
      sorter: (a, b) => a.description.value - b.description.value,
      render: (_, item) => {
        const { value } = item.description || {};
        const type = item.type;
    
        if (type === "PRICE") {
          return `${value.toLocaleString()} VND`;
        } else if (type === "PERCENT") {
          return `${value}%`;
        } else {
          return value ?? "—";
        }
      },
    },     
    {
      title: "Mức giảm tối đa",
      dataIndex: "description",
      render: (_, item) => {
        const { maxDiscount, value } = item.description || {};
        const type = item.type;
    
        if (type === "PERCENT") {
          return maxDiscount ? `${maxDiscount.toLocaleString()} VND` : "Không giới hạn";
        }
    
        // Nếu type không phải là PERCENT, hiển thị giá trị của PRICE
        return value ? `${value.toLocaleString()} VND` : "—";
      },
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "couponExpired",
      sorter: (a, b) => a.couponExpired.length - b.couponExpired.length,
      render: (index, item) => {
        return convertISOToDate(item.couponExpired);
      },
    },
    {
      title: "Còn lại (ngày)",
      dataIndex: "couponExpired",
      render: (index, item) => {
        const expiryDate = new Date(item.couponExpired);
        const currentDate = new Date();
        const diffTime = expiryDate - currentDate; // Sự chênh lệch thời gian
        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)); // Chuyển đổi thành số ngày
    
        // Nếu hết hạn, hiển thị "Hết hạn", nếu còn thì hiển thị số ngày
        if (diffDays < 0) {
          return "Hết hạn";
        } else {
          return `${diffDays} ngày`;
        }
      },
    },
    
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) => {
        const isExpired = new Date(record.couponExpired) < new Date();
        const statusText = isExpired ? "Hết hạn" : "Còn hạn";
        const color = isExpired ? "#ff4d4f" : "#52c41a"; // đỏ / xanh
    
        return (
          <span
            style={{
              backgroundColor: `${color}20`, // màu nền nhạt hơn
              color: color,
              padding: "4px 8px",
              borderRadius: "6px",
              fontWeight: 500,
            }}
          >
            {statusText}
          </span>
        );
      },
    },
    // {
    //   title: "Đã sử dụng",
    //   dataIndex: "used",
    //   render: (index, item) => {
    //     // Tạm mặc định 0 cho đến khi có API
    //     return <span>{item?.usedCount || 0}</span>;
    //   },
    // },
    
    {
      title: "Action",
      dataIndex: "action",
      render: (index, item) => {
        return (
          <>
            <Link
              to={`/admin/coupon/${item._id}`}
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
