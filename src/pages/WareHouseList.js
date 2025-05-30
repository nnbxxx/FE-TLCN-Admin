import React, { useEffect, useState } from "react";
import { Button, Input, Select, Table } from "antd";
import { FaSyncAlt } from "react-icons/fa";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getInventoryProducts } from "../features/warehouse/warehouseSlice";
import { getProducts } from "../features/product/productSlice";

import { Row, Col, Card, Statistic } from "antd";
import { DollarOutlined, ShopOutlined, InboxOutlined } from "@ant-design/icons";
import { HiArrowTrendingDown, HiArrowTrendingUp } from "react-icons/hi2";
import "../Css/CssWareHouseList.css"

const { Search } = Input;
const { Option } = Select;

const WareHouseList = () => {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInventoryProducts());
    dispatch(getProducts());
  }, [dispatch]);

  const inventoryProducts = useSelector(state => state.warehouse?.warehouses || []);

  const products = useSelector(state => state.product?.products || []);

  const productMap = products.reduce((acc, product) => {
    acc[product._id] = {
      name: product.name,
      image: product.images?.[0],
      variants: product.variants || []
    };
    return acc;
  }, {});
  
  

  // Chuyển đổi dữ liệu thành danh sách stockHistory flatted
  const stockHistoryList = inventoryProducts.flatMap(product =>
    product.stockHistory.map((history, index) => ({
      key: `${product._id}-${index}`,
      productId: product.productId,
      productName: productMap[product.productId]?.name || "Không rõ",
      productImage: productMap[product.productId]?.image || "",
      productVariants: productMap[product.productId]?.variants || [],
      email: product.createdBy?.email || '', 
      action: history.action,
      userId: history.userId,
      date: new Date(history.date).toLocaleString(), // chuyển date cho dễ đọc
      variants: Array.isArray(history.variants) ? history.variants : [],
      totalQuantity: product.totalQuantity,
      importPrice: product.importPrice,  
      exportPrice: product.exportPrice,  
      discount: product.discount        
    }))
  );

  const filteredData = stockHistoryList
  .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sắp xếp theo thời gian mới nhất
  .filter((item) =>
    Object.values(item).some((val) =>
      val?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );


  const columns = [
    {
      title: "ID sản phẩm",
      dataIndex: "productId",
      key: "productId",
      width: 120,
      ellipsis: {
        showTitle: true,
      },
    },

   {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      width: 250,
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {record.productImage && (
            <img
              src={record.productImage}
              alt="product"
              style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
            />
          )}
          <span
            title={text} // Tooltip hiện full tên khi hover
            style={{
              maxWidth: 160,         // Giới hạn chiều rộng phần tên
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline-block",
            }}
          >
            {text}
          </span>
        </div>
      ),
    },
    
    {
      title: "Người tạo",
      dataIndex: "email",
      key: "email",
      width: 150,
    },
    {
      title: "Tổng tồn kho",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
       width: 100,
    },
    {
      title: "Thời gian",
      dataIndex: "date",
      key: "date",
      width: 150,
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: 120,
      render: (text) => {
        const action = text?.toLowerCase(); // chuyển về chữ thường để so sánh
        const isImport = action === "import";

        const styles = {
          padding: "4px 8px",
          borderRadius: "8px",
          fontWeight: "500",
          fontSize: "13px",
          display: "inline-block",
          color: isImport ? "#389e0d" : "#d46b08",                // xanh lá / cam
          backgroundColor: isImport ? "#f6ffed" : "#fff7e6",     // nền nhạt
          border: `1px solid ${isImport ? "#b7eb8f" : "#ffd591"}` // viền
        };

        return (
          <span style={styles}>
            {isImport ? "Nhập hàng" : "Xuất hàng"}
          </span>
        );
      },
    }

  ];

  
    const [accessTime, setAccessTime] = useState(moment().format("HH:mm:ss DD/MM/YYYY"));
  
    useEffect(() => {
      setAccessTime(moment().format("HH:mm:ss DD/MM/YYYY"));
    }, []);


    // Hàm lọc theo thời gian
const [filterType, setFilterType] = useState("all");

const filterByTime = (data) => {
  const now = new Date();
  return data.filter(item => {
    const itemDate = new Date(item.date);
    switch (filterType) {
      case "day":
        return itemDate.toDateString() === now.toDateString();
      case "week":
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        return itemDate >= startOfWeek;
      case "month":
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      case "year":
        return itemDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });
};


const filteredStockHistory = filterByTime(stockHistoryList);

// Tổng số lần nhập hàng
const totalImports = filteredStockHistory.filter(item => item.action === "import").length;

// Tổng số sản phẩm trong kho (cộng dồn số lượng từ các biến thể)
const totalStock = filteredStockHistory.reduce((sum, item) => {
  const variantTotal = item.variants?.reduce((vSum, v) => vSum + (v.quantity || 0), 0);
  return sum + (variantTotal || 0);
}, 0);

// Tính tổng giá trị kho (giá nhập * số lượng của từng biến thể)
const totalWarehouseValue = filteredStockHistory.reduce((sum, item) => {
  const variantValue = item.variants?.reduce((vSum, v) => {
    const quantity = v.quantity || 0;
    const importPrice = v.importPrice || 0;
    return vSum + quantity * importPrice;
  }, 0);
  return sum + variantValue;
}, 0);


// Lấy dữ liệu giai đoạn trước để so sánh
const getPreviousPeriodData = (type) => {
  const now = new Date();
  return stockHistoryList.filter(item => {
    const itemDate = new Date(item.date);
    switch (type) {
      case "day": {
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        return itemDate.toDateString() === yesterday.toDateString();
      }
      case "week": {
        const thisWeekStart = new Date(now);
        thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
        const lastWeekStart = new Date(thisWeekStart);
        lastWeekStart.setDate(lastWeekStart.getDate() - 7);
        const lastWeekEnd = new Date(thisWeekStart);
        lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
        return itemDate >= lastWeekStart && itemDate <= lastWeekEnd;
      }
      case "month": {
        const prevMonth = now.getMonth() - 1;
        const year = prevMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
        const month = (prevMonth + 12) % 12;
        return itemDate.getMonth() === month && itemDate.getFullYear() === year;
      }
      case "year": {
        return itemDate.getFullYear() === now.getFullYear() - 1;
      }
      default:
        return false;
    }
  });
};

const previousData = getPreviousPeriodData(filterType);

// Tổng số lần nhập hàng kỳ trước
const previousImports = previousData.filter(item => item.action === "import").length;

// Tổng số sản phẩm trong kho kỳ trước
const previousStock = previousData.reduce((sum, item) => {
  const variantTotal = item.variants?.reduce((vSum, v) => vSum + (v.quantity || 0), 0);
  return sum + (variantTotal || 0);
}, 0);

// Tổng giá trị kho kỳ trước
const previousWarehouseValue = previousData.reduce((sum, item) => {
  const variantValue = item.variants?.reduce((vSum, v) => {
    const quantity = v.quantity || 0;
    const importPrice = v.importPrice || 0;
    return vSum + quantity * importPrice;
  }, 0);
  return sum + variantValue;
}, 0);

// Hàm tính phần trăm thay đổi
const calculateChangePercent = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

// Tính phần trăm thay đổi thực tế
const totalImportsChange = calculateChangePercent(totalImports, previousImports);
const totalStockChange = calculateChangePercent(totalStock, previousStock);
const totalWarehouseChange = calculateChangePercent(totalWarehouseValue, previousWarehouseValue);


const getFilterLabel = (type) => {
  switch (type) {
    case "day":
      return "hôm qua";
    case "week":
      return "tuần trước";
    case "month":
      return "tháng trước";
    case "year":
      return "năm trước";
    default:
      return "trước đó";
  }
};


  return (
    <div>
       <div className="bg-white p-3 rounded shadow-sm mb-4">
              <div className="d-flex justify-content-between align-items-center mx-4 py-3">
                <h3 className="m-0">Danh sách lịch sử nhập hàng</h3>
                {accessTime && (
                  <span className="text-muted fs-6 d-flex align-items-center">
                    Thời gian truy cập
                    <FaSyncAlt className="ms-2 text-primary" style={{ cursor: "pointer" }} />
                    <span className="ms-2 border px-2 py-1 rounded">{accessTime}</span>
                  </span>
                )}
              </div>
            </div>
            

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              
            <span style={{ marginRight: 8, lineHeight: "32px", color: "white"}}>Lọc theo:</span>
            <Select
                defaultValue="all"
                value={filterType}
                onChange={setFilterType}
                style={{ width: 120 }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="day">Trong ngày</Option>
                <Option value="week">Trong tuần</Option>
                <Option value="month">Trong tháng</Option>
                <Option value="year">Trong năm</Option>
              </Select>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Tổng số lần nhập hàng"
                    value={totalImports}
                    prefix={<ShopOutlined />}
                    valueStyle={{
                      color: totalImportsChange > 0 ? "#3f8600" : totalImportsChange < 0 ? "#cf1322" : "#8c8c8c",
                    }}
                    formatter={(value) => value.toLocaleString("vi-VN")}
                  />
                  <div style={{ marginTop: 8 }}>
                    {totalImportsChange > 0 ? (
                      <>
                        <HiArrowTrendingUp style={{ color: "#3f8600", marginRight: 4 }} />
                        Tăng {totalImportsChange}% so với {getFilterLabel(filterType)}
                      </>
                    ) : totalImportsChange < 0 ? (
                      <>
                        <HiArrowTrendingDown style={{ color: "#cf1322", marginRight: 4 }} />
                        Giảm {Math.abs(totalImportsChange)}% so với {getFilterLabel(filterType)}
                      </>
                    ) : (
                      <>
                        <HiArrowTrendingUp style={{ color: "#8c8c8c", marginRight: 4 }} />
                        Không thay đổi so với {getFilterLabel(filterType)}
                      </>
                    )}
                  </div>
                </Card>
              </Col>

              <Col span={8}>
                <Card>
                  <Statistic
                    title="Tổng sản phẩm trong kho"
                    value={totalStock}
                    prefix={<InboxOutlined />}
                    valueStyle={{
                      color: totalImportsChange > 0 ? "#3f8600" : totalImportsChange < 0 ? "#cf1322" : "#8c8c8c",
                    }}
                    formatter={(value) => value.toLocaleString("vi-VN")}
                  />
                  <div style={{ marginTop: 8 }}>
                    {totalImportsChange > 0 ? (
                      <>
                        <HiArrowTrendingUp style={{ color: "#3f8600", marginRight: 4 }} />
                        Tăng {totalImportsChange}% so với {getFilterLabel(filterType)}
                      </>
                    ) : totalImportsChange < 0 ? (
                      <>
                        <HiArrowTrendingDown style={{ color: "#cf1322", marginRight: 4 }} />
                        Giảm {Math.abs(totalImportsChange)}% so với {getFilterLabel(filterType)}
                      </>
                    ) : (
                      <>
                        <HiArrowTrendingUp style={{ color: "#8c8c8c", marginRight: 4 }} />
                        Không thay đổi so với {getFilterLabel(filterType)}
                      </>
                    )}
                  </div>
                </Card>
              </Col>

              <Col span={8}>
                <Card>
                  <Statistic
                    title="Tổng giá trị kho"
                    value={totalWarehouseValue}
                    prefix={<DollarOutlined />}
                    suffix="₫"
                    valueStyle={{
                      color: totalImportsChange > 0 ? "#3f8600" : totalImportsChange < 0 ? "#cf1322" : "#8c8c8c",
                    }}
                    formatter={(value) =>
                      value.toLocaleString("vi-VN", { minimumFractionDigits: 0 })
                    }
                  />
                  <div style={{ marginTop: 8 }}>
                    {totalImportsChange > 0 ? (
                      <>
                        <HiArrowTrendingUp style={{ color: "#3f8600", marginRight: 4 }} />
                        Tăng {totalImportsChange}% so với {getFilterLabel(filterType)}
                      </>
                    ) : totalImportsChange < 0 ? (
                      <>
                        <HiArrowTrendingDown style={{ color: "#cf1322", marginRight: 4 }} />
                        Giảm {Math.abs(totalImportsChange)}% so với {getFilterLabel(filterType)}
                      </>
                    ) : (
                      <>
                        <HiArrowTrendingUp style={{ color: "#8c8c8c", marginRight: 4 }} />
                        Không thay đổi so với {getFilterLabel(filterType)}
                      </>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>


      
 
      <div style={{ display: "flex", justifyContent: "end", marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/admin/warehouse")}>
          Thêm mới
        </Button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "white" }} >Hiển thị:</span>
          <Select defaultValue={10} style={{ width: 70 }} onChange={(value) => setPageSize(value)}>
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={50}>50</Option>
          </Select>
        </div>

        <Search
          placeholder="Tìm kiếm..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "210px" }}
        />
      </div>

      <Table
        className="compact-table"
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) => record.key}
        scroll={{ x: "max-content" }}
        pagination={{
          pageSize,
          showSizeChanger: false,
          showTotal: (total, range) => (
            <span style={{ color: "white" }}>
              {range[0]}-{range[1]} trong tổng số {total} lịch sử
            </span>
          )

        }}
        expandable={{
         expandedRowRender: (record) => (
          <div className="expanded-row-content">
            {record.variants && record.variants.length > 0 ? (
              <Table
                dataSource={record.variants
                .map((variant, i) => {
                  const matchingVariant = record.productVariants.find(
                    v => v.attributes?.color?.name?.toLowerCase() === variant.color?.toLowerCase() &&
                        v.attributes?.size?.name?.toLowerCase() === variant.size?.toLowerCase()
                  );

                  const colorImage = matchingVariant?.attributes?.color?.desc || "";

                  return {
                    key: i,
                    color: variant.color,
                    size: variant.size,
                    quantity: variant.quantity,
                    price: variant.price,
                    importPrice: variant.importPrice,
                    exportPrice: variant.exportPrice,
                    discount: variant.discount,
                    colorImage,
                  };
                })
                .filter(item => {
                  const { quantity, importPrice, exportPrice, discount } = item;
                  return !(quantity === 0 && importPrice === 0 && exportPrice === 0 && discount === 0);
                })}

                columns={[
                  {
                    title: "Màu sắc",
                    dataIndex: "color",
                    key: "color",
                    render: (color, record) => (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {record.colorImage && (
                          <img src={record.colorImage} alt={color} style={{ width: 30, height: 30, objectFit: "cover", borderRadius: 4 }} />
                        )}
                        <span>{color}</span>
                      </div>
                    )
                  },
                  { title: "Kích cỡ", dataIndex: "size", key: "size" },
                  { title: "Số lượng (Cái)", dataIndex: "quantity", key: "quantity" , render: (text) => `${text} cái` },
                  { title: "Giá nhập (VND)", dataIndex: "importPrice", key: "importPrice", render: (text) => `${text} VND` },
                  { title: "Lợi nhuận (%)", dataIndex: "exportPrice", key: "exportPrice", render: (text) => `${text} %` },
                  { title: "Giảm giá (%)", dataIndex: "discount", key: "discount", render: (text) => `${text} %`, },
                ]}
                pagination={false}
              />
            ) : (
              <p>Không có biến thể nào</p>
            )}
          </div>
        ),
          rowExpandable: (record) => record.variants && record.variants.length > 0,
        }}
      />
    </div>
  );
};

export default WareHouseList;
