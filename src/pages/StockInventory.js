import React, { useEffect, useState } from "react";
import { PageHeader } from "@ant-design/pro-layout";
import { Row, Col, Select, Card, Statistic, Table, Typography, Space, Tag, Divider,} from "antd";
import { ShoppingCartOutlined, DollarOutlined, ShopOutlined, HourglassOutlined, TrophyOutlined,} from "@ant-design/icons";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";

import { useDispatch, useSelector } from "react-redux";
import { getDashboardInfo, getInfoByTime } from "../features/dashboard/dashboardSlice";
import { getBestSellingProducts } from "../features/warehouse/warehouseSlice";
import { getAProduct } from "../features/product/productSlice";


const { Option } = Select;
const { Title } = Typography;

const StockInventory = () => {
  const [filter, setFilter] = useState("ngày");
  const dispatch = useDispatch();

useEffect(() => {
  dispatch(getInfoByTime(filter));
}, [filter]);

useEffect(() => {
  dispatch(getDashboardInfo());
  dispatch(getBestSellingProducts());
}, []);

const dashboards = useSelector((state) => state.dashboard?.dashboards);
const dashboardInfo = useSelector((state) => state.dashboard.dashboardInfo?.data);
const bestSellingProducts = useSelector(state => state.warehouse.bestSellingProducts);
const orders = useSelector((state) => state.auth?.orders);
const preparingOrders = orders?.filter(order => order.statusSupplier === "PREPARE");
const waitingToExportCount = preparingOrders?.reduce((total, order) => {
  const orderTotal = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0);
  return total + orderTotal;
}, 0);


const calculateChange = (from, to) => {
  if (from === 0 && to > 0) return 100;
  if (from === 0) return 0;
  return Math.round(((to - from) / from) * 100);
};

const data = dashboards ? {
  totalIncome: {
    value: dashboards.inforRevenue?.toCount || 0,
    change: calculateChange(dashboards.inforRevenue?.fromCount, dashboards.inforRevenue?.toCount),
  },
  totalExpense: {
    value: dashboards.inforProductImport?.toCount || 0,
    change: calculateChange(dashboards.inforProductImport?.fromCount, dashboards.inforProductImport?.toCount),
  },
  estimatedProfit: {
    value:
      (dashboards.inforRevenue?.toCount || 0) - (dashboards.inforProductImport?.toCount || 0),
    change: calculateChange(
      (dashboards.inforRevenue?.fromCount || 0) - (dashboards.inforProductImport?.fromCount || 0),
      (dashboards.inforRevenue?.toCount || 0) - (dashboards.inforProductImport?.toCount || 0)
    ),
  },
  totalProductInventory: dashboardInfo?.inforInventoryProduct?.totalStock || 0,
  totalPriceProductInventory: dashboardInfo?.inforInventoryProduct?.totalValue || 0,
  waitingToShip: waitingToExportCount || 0,
} : {
  totalIncome: { value: 0, change: 0 },
  totalExpense: { value: 0, change: 0 },
  estimatedProfit: { value: 0, change: 0 },
  totalProductInventory: 0,
  totalPriceProductInventory: 0,
  waitingToShip: 0,
};

const [productNames, setProductNames] = useState({});

useEffect(() => {
  const fetchProductNames = async () => {
    for (const item of bestSellingProducts) {
      const id = item.productId;
      if (!productNames[id]) {
        try {
          const res = await dispatch(getAProduct(id)).unwrap();
          const name = res.data?.product?.name || `SP #${item._id.slice(-4)}`;
          setProductNames((prev) => ({ ...prev, [id]: name }));
        } catch (error) {
          console.error("Lỗi lấy tên sản phẩm:", error);
        }
      }
    }
  };

  if (bestSellingProducts?.length > 0) {
    fetchProductNames();
  }
}, [bestSellingProducts]);



const topProducts = bestSellingProducts.map((item) => ({
  key: item._id,
  name: productNames[item.productId] || "Đang tải...",
  price: item.productVariants?.[0]?.sellPrice || 0,
  sold: item.totalQuantitySell,
  remaining: item.totalQuantity,
}));

   

  const orderColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Chờ xuất" ? "orange" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      render: (value) => value.toLocaleString("vi-VN") + " ₫",
    },
  ];

  const orderData = [
    {
      key: 1,
      code: "ORD1234",
      status: "Chờ xuất",
      quantity: 3,
      total: 1500000,
    },
    {
      key: 2,
      code: "ORD5678",
      status: "Đã xuất",
      quantity: 2,
      total: 800000,
    },
  ];

  // Thêm function để chuyển filter sang tiếng Việt
const getFilterLabel = (filter) => {
     switch (filter) {
       case "week":
         return "tuần";
       case "month":
         return "tháng";
       case "year":
         return "năm";
       default:
         return "";
     }
   };



  return (
    <div style={{ padding: 24 }}>
      <PageHeader
        title={<span style={{ color: "white" }}>Quản lý kho hàng</span>}
        extra={[
          <Space key="filter">
            <span style={{ color: "white" }}>Lọc theo:</span>
            <Select value={filter} onChange={setFilter} style={{ width: 120 }}>
              <Option value="week">Ngày</Option>
              <Option value="week">Tuần</Option>
              <Option value="month">Tháng</Option>
              <Option value="year">Năm</Option>
            </Select>
          </Space>,
        ]}
      />
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Nhập hàng"
              value={data.totalIncome.value}
              prefix={<DollarOutlined />}
              suffix="₫"
              valueStyle={{ color: "#3f8600" }}
              precision={0}
              formatter={(value) =>
                value.toLocaleString("vi-VN", { minimumFractionDigits: 0 })
              }
            />
            <div>
              <HiArrowTrendingUp style={{ color: "#3f8600" }} />
              Tăng {data.totalIncome.change}% so với {getFilterLabel(filter)} trước
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={data.totalExpense.value}
              prefix={<ShopOutlined />}
              suffix="₫"
              valueStyle={{ color: "#cf1322" }}
              formatter={(value) =>
                value.toLocaleString("vi-VN", { minimumFractionDigits: 0 })
              }
            />
            <div>
              <HiArrowTrendingDown style={{ color: "#cf1322" }} />
              Giảm {Math.abs(data.totalExpense.change)}% so với {getFilterLabel(filter)} trước 
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tiền lời ước tính"
              value={data.estimatedProfit.value}
              prefix={<DollarOutlined />}
              suffix="₫"
              valueStyle={{ color: "#3f8600" }}
              formatter={(value) =>
                value.toLocaleString("vi-VN", { minimumFractionDigits: 0 })
              }
            />
            <div>
              <HiArrowTrendingUp style={{ color: "#3f8600" }} />
              Tăng {data.estimatedProfit.change}% so với {getFilterLabel(filter)} trước
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng sản phẩm còn trong kho"
              value={data.totalProductInventory}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng giá trị hàng trong kho"
              value={data.totalPriceProductInventory}
              suffix="₫"
              formatter={(value) =>
                value.toLocaleString("vi-VN", { minimumFractionDigits: 0 })
              }
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Sản phẩm chờ xuất kho"
              value={data.waitingToShip}
              prefix={<HourglassOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Đơn hàng cần xuất kho" extra={<a>Xem thêm</a>}>
            <Table
              columns={orderColumns}
              dataSource={orderData}
              pagination={false}
              rowKey="key"
              locale={{
                emptyText: "Không có dữ liệu",
              }}
            />
          </Card>
        </Col>

        <Col span={12}>
        <Card title="Sản phẩm bán chạy" extra={<a>Xem thêm</a>}>
          <Table
          columns={[
               {
               title: "Tên sản phẩm",
               dataIndex: "name",
               key: "name",
               },
               {
               title: "Giá",
               dataIndex: "price",
               key: "price",
               render: (value) =>
                    value.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    }),
               },
               {
               title: "Đã bán",
               dataIndex: "sold",
               key: "sold",
               },
               {
               title: "Còn lại",
               dataIndex: "remaining",
               key: "remaining",
               },
          ]}
          dataSource={topProducts}
          pagination={false}
          rowKey="key"
          locale={{
               emptyText: "Không có dữ liệu",
          }}
          />
     </Card>

        </Col>
      </Row>
    </div>
  );
};

export default StockInventory;
