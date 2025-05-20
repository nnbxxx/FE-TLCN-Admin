import React, { useEffect, useState } from "react";
import { Button, Input, Select, Table, Tooltip } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteABlog, getBlogs, resetState } from "../features/blogs/blogSlice";
import CustomModal from "../components/CustomModal";
import "../Css/CssCustomers.css";
import { delImg } from "../features/upload/uploadSlice";
import { FaSyncAlt } from "react-icons/fa";
import moment from "moment/moment";
import { DeleteOutlined, EditFilled, PlusOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Option } = Select;

const Bloglist = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10); 
    const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [blogId, setblogId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setblogId(e);
  };
const columns = [
  {
    title: "Id",
    dataIndex: "_id",
    width: 100,
    render: (id) => `${id.slice(0, 8)}...`, // Cắt ID
  },
  {
    title: 'Ảnh đại diện',
    dataIndex: 'images',
    key: 'images',
    render: (images) => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img
          src={images?.[0]}
          alt="Ảnh"
          style={{ width: 50, height: 60, objectFit: 'cover', borderRadius: 8 }}
        />
      </div>
    ),
    align: 'center',
  },
  {
    title: "Tiêu đề",
    dataIndex: "title",
    render: (title) =>
    <Tooltip title={title}>
        {title.length > 30 ? `${title.slice(0, 30)}...` : title}
      </Tooltip>  },
  {
    title: "Danh mục",
    dataIndex: "category",
  },
  {
    title: 'Tác giả',
    dataIndex: 'createdBy',
    key: 'createdBy',
    render: (user: { email: string}) => user.email,
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date) =>
      new Date(date).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }), // Thêm giờ phút giây
  },
  {
    title: "Action",
    dataIndex: "action",
    render: (index, item) => {
      return (
        <>
          <Link to={`/admin/blog/${item._id}`} className="fs-3 text-success">
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


  const hideModal = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getBlogs());
  }, []);
  const getBlogState = useSelector((state) => state.blogs.blogs);

  const deleteBlog = (e) => {
    dispatch(deleteABlog(e));
    dispatch(delImg(e));

    setOpen(false);
    setTimeout(() => {
      dispatch(getBlogs());
    }, 100);
  };

  const blogs = useSelector((state) => state?.blogs.blogs || []);
      const latestblogs = blogs.length > 0 
          ? blogs.reduce((latest, product) => 
              new Date(product.createdAt) > new Date(latest.createdAt) ? product : latest
            )
          : null;

// Lấy danh sách danh mục (không trùng lặp)
const categories = [...new Set(blogs.map((blog) => blog.category))];


// Lọc sản phẩm theo danh mục hoặc tìm kiếm
const filteredblogs = blogs?.filter((blog) => {
  const matchesCategory = selectedCategory ? blog.category === selectedCategory : true;
  
  const matchesSearch = searchText
    ? [
        blog?._id,
        blog?.title,
        blog?.category
      ].some((value) =>
        value?.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    : true;

  return matchesCategory && matchesSearch;
});

const authState = useSelector((state) => state?.auth?.user);

  return (
    <div>
                 <div className="bg-white rounded shadow-sm mb-4">
                    <div className="d-flex justify-content-between align-items-center mx-4 py-3">
                      
                      <div>
                        <h3 className="m-0">Danh sách bài viết</h3>
                        <div className="text-muted mt-1" style={{ fontSize: "14px" }}>
                          Chào {authState?.name || "bạn"}, chào mừng bạn quay trở lại trang quản trị của Sắc
                        </div>
                      </div>
                      {latestblogs && (
                        <span className="text-muted fs-6 d-flex align-items-center">
                          Dữ liệu mới nhất
                          <FaSyncAlt className="ms-2 text-primary" style={{ cursor: "pointer" }} />
                          <span className="ms-2 border px-2 py-1 rounded">
                            {moment(latestblogs.createdAt).format("HH:mm:ss DD/MM/YYYY")}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nút thêm mới sản phẩm */}
               <div style={{ display: "flex", justifyContent: "end", marginBottom: 16 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/admin/blog")}>
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

        {/* Phần danh mục và tìm kiếm nằm bên phải */}
        <div style={{ display: "flex", gap: "10px" }}>
        <Select
          placeholder="Lọc theo danh mục"
          allowClear
          style={{ width: "170px" }}
          onChange={(value) => setSelectedCategory(value)}
        >
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
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
        columns={columns} 
        // dataSource={getBlogState} 
        dataSource={filteredblogs || []}
        rowKey={(record) => record._id || record.key}
        pagination={{
          pageSize,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong tổng số ${total} bài viết`,
        }}
       

        />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteBlog(blogId);
        }}
        title="Are you sure you want to delete this blog?"
      />
    </div>
  );
};

export default Bloglist;
