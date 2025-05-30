import React, { useEffect, useState } from "react";
import { PageHeader } from "@ant-design/pro-layout";
import { Row, Col, Select, Card, Statistic, Table, Typography, Space, Tag, Divider,} from "antd";
import { ShoppingCartOutlined, DollarOutlined, ShopOutlined, HourglassOutlined, TrophyOutlined,} from "@ant-design/icons";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";
import { UserOutlined } from "@ant-design/icons";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip,
  CartesianGrid, Legend,
  ResponsiveContainer,
  AreaChart,Area,
} from 'recharts';
import { useDispatch, useSelector } from "react-redux";
import { getDashboardInfo, getInfoByTime, postDashboardRevenue } from "../features/dashboard/dashboardSlice";
import '../App.css';
import { getOrders } from "../features/auth/authSlice";



const { Option } = Select;
const { Title } = Typography;

const Dashboard = () => {
  const [filter, setFilter] = useState("DAY");
const dispatch = useDispatch();
const dashboards = useSelector((state) => state.dashboard?.dashboards);
const dashboardInfo = useSelector((state) => state.dashboard.dashboardInfo?.data);
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
const availableYears = [2023, 2024, 2025]; // hoặc tạo từ backend nếu có
const createdashboard = useSelector((state) => state.dashboard.createdashboard);
const allOrders = useSelector((state) => state.auth?.orders);

useEffect(() => {
  dispatch(postDashboardRevenue({ year: selectedYear }));
}, [selectedYear]);

useEffect(() => {
  dispatch(getOrders());
}, [dispatch]);

useEffect(() => {
  dispatch(getInfoByTime(filter.toUpperCase()));
}, [filter]);

useEffect(() => {
  dispatch(getDashboardInfo());
}, []);

const revenueExpenseData = createdashboard?.map((item) => ({
  month: item.month,
  income: item.sales,
  expense: item.import,
})) || [];

const exportOrders = allOrders
  ?.filter(order => order.statusSupplier === "ON_DELIVERY")
  ?.slice(0, 5); // chỉ lấy 5 đơn mới nhất (tuỳ bạn muốn bao nhiêu)


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
  totalSoldProducts: {
    value: dashboards.inforProductExport?.toCount || 0,
    change: calculateChange(dashboards.inforProductExport?.fromCount, dashboards.inforProductExport?.toCount),
  },
  totalUsers: {
    value: dashboards.inforUser?.toCount || 0,
    change: calculateChange(dashboards.inforUser?.fromCount, dashboards.inforUser?.toCount),
  },
  totalPosts: {
    value: dashboards.inforBlog?.toCount || 0,
    change: calculateChange(dashboards.inforBlog?.fromCount, dashboards.inforBlog?.toCount),
  },
  // Bạn có thể thêm nếu backend hỗ trợ:
  totalPriceProductInventory: { 
    value: dashboardInfo?.inforInventoryProduct?.totalValue || 0,
    change: 0,
  },
  waitingToShip: { 
    value: dashboardInfo?.inforInventoryProduct?.totalStock || 0,
    change: 0,
  },
  totalBuyers: 0,
} : {
  // fallback khi chưa có dữ liệu
  totalIncome: { value: 0, change: 0 },
  totalExpense: { value: 0, change: 0 },
  estimatedProfit: { value: 0, change: 0 },
  totalSoldProducts: { value: 0, change: 0 },
  totalUsers: { value: 0, change: 0 },
  totalPosts: { value: 0, change: 0 },
  totalPriceProductInventory: { value: 0, change: 0 },
  waitingToShip: { value: 0, change: 0 },
  totalBuyers: 0,
};

const ChangeIndicator = ({ change, label }) => {
  const isPositive = change >= 0;
  const Icon = isPositive ? HiArrowTrendingUp : HiArrowTrendingDown;
  const color = isPositive ? "#3f8600" : "#cf1322";

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Icon style={{ color, marginRight: 6 }} />
      <span style={{ color: "#000", marginRight: 4 }}>
        {isPositive ? "Tăng" : "Giảm"}
      </span>
      <span style={{ color }}>{Math.abs(change)}%</span>
      <span style={{ color: "#000", marginLeft: 6 }}>
        so với {label} trước
      </span>
    </div>
  );
};


  const topProducts = [
     {
       key: 1,
       name: "Áo sơ mi trắng",
       price: 250000,
       sold: 120,
       remaining: 30,
     },
     {
       key: 2,
       name: "Quần jeans",
       price: 320000,
       sold: 90,
       remaining: 12,
     },
     {
       key: 3,
       name: "Váy xòe",
       price: 450000,
       sold: 85,
       remaining: 8,
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



const pieData = dashboardInfo?.inforUsersAndBuyers
  ? [
      {
        name: "Người đã mua",
        value: dashboardInfo.inforUsersAndBuyers.buyers,
      },
      {
        name: "Người chưa mua",
        value:
          dashboardInfo.inforUsersAndBuyers.totalUsers -
          dashboardInfo.inforUsersAndBuyers.buyers,
      },
    ]
  : [];



const COLORS = ['#1A3700FF', '#d9d9d9'];

const topUsers = dashboardInfo?.dataTopBuyers?.map(user => ({
  ...user,
  name: user.name || "Không tên",
  avatar: user.avatar || "https://via.placeholder.com/24",
  totalItems: user.totalItems || 0
})) || [];


const barColors = [
  "#2E7D32", // Green 800
  "#388E3C", // Green 700
  "#43A047", // Green 600
  "#4CAF50", // Green 500 (classic)
  "#66BB6A", // Green 400
  "#81C784", // Green 300
  "#A5D6A7", // Green 200
  "#C8E6C9", // Green 100
  "#B2DFDB", // Teal 100 (xanh ngọc nhạt)
  "#AED581", // Lime green nhạt
  "#689F38", // Avocado green
  "#9CCC65", // Light lime green
];

const CustomYAxisTick = ({ x, y, index }) => {
  return (
    <text x={x - 10} y={y + 6} textAnchor="end" fill="#666">
      {`Top ${index + 1}`}
    </text>
  );
};

const CustomLabel = ({ x, y, width, height, index }) => {
  const user = topUsers[index];
  return (
    <image
      href={user.avatar}
      x={x + width + 5}
      y={y + height / 2 - 12}  // căn giữa theo chiều dọc
      width={24}
      height={24}
      clipPath="circle(12px at 12px 12px)"
    />
  );
};

// Dữ liệu biểu đồ tỉ lệ đã bán / chưa bán
const soldProducts = dashboardInfo?.inforInventorySumary?.soldAtLeastOne || 0;
const totalProducts = dashboardInfo?.inforInventorySumary?.totalProducts || 0;

const pieeData = [
  {
    name: "Đã bán",
    value: soldProducts,
    color: "#0088FE",
  },
  {
    name: "Chưa bán",
    value: totalProducts - soldProducts,
    color: "#00C49F",
  },
];


const ProductYAxisTick = ({ x, y, index }) => (
  <text x={x - 10} y={y + 6} textAnchor="end" fill="#666">
    {`Top ${index + 1}`}
  </text>
);

const ProductLabel = ({ x, y, width, height, index, data, clipId }) => {
  const product = data[index];
  const imageSize = 24;
  return (
    <>
      {/* Định nghĩa clipPath hình tròn */}
      <defs>
        <clipPath id={clipId}>
          <circle cx={imageSize / 2} cy={imageSize / 2} r={imageSize / 2} />
        </clipPath>
      </defs>
      {/* Hiển thị ảnh và cắt hình tròn */}
      <image
        href={product.image}
        x={x + width + 5}
        y={y + height / 2 - imageSize / 2}
        width={imageSize}
        height={imageSize}
        clipPath={`url(#${clipId})`}
      />
    </>
  );
};



// Dữ liệu top sản phẩm yêu thích
const topFavoriteProductsWithImage = dashboardInfo?.dataTopLikeProduct?.map(product => ({
  name: product.name,
  likes: product.totalLike,
  image: product.image || "https://via.placeholder.com/24?text=IMG",
})) || [];




// Dữ liệu top sản phẩm xem nhiều nhất
const topViewedProductsWithImage = dashboardInfo?.dataTopViewProduct?.map(product => ({
  name: product.name,
  views: product.viewCount,
  image: product.image || "https://via.placeholder.com/24?text=IMG",
})) || [];



// Biểu đồ tròn tỉ lệ đã bán / chưa bán
const PieChartComponent = () => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={pieeData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={60}   // <- Thêm dòng này để tạo rỗng giữa
        outerRadius={80}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      >

        {pieeData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <text
        x="50%"
        y="40%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={16}
        fontWeight="bold"
      >
        {totalProducts > 0
          ? `${Math.round((soldProducts / totalProducts) * 100)}%`
          : "0%"}
      </text>
      <text
        x="50%"
        y="48%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12}
        fill="#555"
      >
        Sản phẩm đã bán
      </text>

      <Legend verticalAlign="bottom" height={36} />
      <Tooltip formatter={(value) => value.toLocaleString()} />
    </PieChart>
  </ResponsiveContainer>
);

// Biểu đồ cột generic (dữ liệu & key & màu)
const BarChartComponent = ({ data, dataKey, title, colors }) => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart layout="vertical" data={data} margin={{ top: 10, right: 30, left: 80, bottom: 10 }} barCategoryGap={15}>
      <XAxis type="number" />
      <YAxis
        dataKey="name"
        type="category"
        tick={({ x, y, index }) => (
          <text x={x - 10} y={y + 6} textAnchor="end" fill="#666">{`Top ${index + 1}`}</text>
        )}
        tickLine={false}
      />
      <Tooltip formatter={(value) => value.toLocaleString()} />
      <Bar dataKey={dataKey} >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const MiniProgressCircle = ({ percent, isPositive }) => {
  const angle = Math.min(Math.max(percent, 0), 100);
  const color = isPositive ? "#3f8600" : "#cf1322";

  const data = [
    { name: "filled", value: angle },
    { name: "unfilled", value: 100 - angle }
  ];

  const COLORS = [color, "#e0e0e0"];
  return (
    <div style={{ width: 40, height: 40, position: "relative" }}>
      <PieChart width={40} height={40}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={14}
          outerRadius={20}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 10,
          fontWeight: "bold",
          color,
          pointerEvents: "none"
        }}
      >
        {percent}%
      </div>
    </div>
  );
};



const formatCurrencyShort = (value) => {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + " tỷ đồng";
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + " triệu đồng";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, "") + " nghìn đồng";
  } else {
    return value.toLocaleString("vi-VN") + " đồng";
  }
};

  return (
    <div style={{ padding: '0px 24px 24px 24px' }}>
      <PageHeader
        extra={[
          <Space key="filter">
            <span style={{ color: 'white' }}>Lọc theo:</span>
            <Select value={filter} onChange={setFilter} style={{ width: 120 }}>
              <Option value="DAY">Ngày</Option>
              <Option value="WEEK">Tuần</Option>
              <Option value="MONTH">Tháng</Option>
              <Option value="YEAR">Năm</Option>
            </Select>
          </Space>,
        ]}
      />
    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      {[
        {
          title: "Tổng doanh thu",
          value: data.totalIncome.value,
          icon: <DollarOutlined />,
          change: data.totalIncome.change,
        },
        {
          title: "Tổng nhập hàng",
          value: data.totalExpense.value,
          icon: <ShopOutlined />,
          change: data.totalExpense.change,
        },
        {
          title: "Tiền lời ước tính",
          value: data.estimatedProfit.value,
          icon: <DollarOutlined />,
          change: data.estimatedProfit.change,
        },
        {
          title: "Tổng số người dùng",
          value: data.totalUsers.value,
          icon: <UserOutlined />,
          change: data.totalUsers.change,
        },
        {
          title: "Tổng sản phẩm đã bán",
          value: data.totalSoldProducts.value,
          icon: <ShoppingCartOutlined />,
          change: data.totalSoldProducts.change,
        },
        {
          title: "Tổng giá trị kho hàng",
          value: data.totalPriceProductInventory.value,
          icon: <DollarOutlined />,
          change: data.totalPriceProductInventory.change,
        },
        {
          title: "Tổng sản phẩm trong kho",
          value: data.waitingToShip.value,
          icon: <HourglassOutlined />,
          change: data.waitingToShip.change,
        },
        {
          title: "Tổng số bài viết",
          value: data.totalPosts.value,
          icon: <TrophyOutlined />,
          change: data.totalPosts.change,
        }
      ].map((item, index) => (
      <Col xs={24} sm={12} md={12} lg={8} xl={6} key={index}>
<Card>
  <Statistic
    title={
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13 }}>{item.title}</span>
        <MiniProgressCircle percent={Math.abs(item.change)} />
      </div>
    }
    value={item.value}
    prefix={item.icon}
    valueStyle={{
      color: item.change >= 0 ? "#3f8600" : "#cf1322",
      fontSize: 18,
    }}
    formatter={(value) =>
      ["Tổng doanh thu", "Tổng giá trị kho hàng", "Tiền lời ước tính", "Tổng nhập hàng"].includes(item.title)
        ? formatCurrencyShort(value)
        : value.toLocaleString("vi-VN", { minimumFractionDigits: 0 })
    }
  />
  <div style={{ fontSize: 12 }}>
    <ChangeIndicator change={item.change} label={getFilterLabel(filter)} />
  </div>
</Card>

      </Col>



      ))}
    </Row>


    <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* Biểu đồ 1: Pie chart - tổng số người mua hàng trên tổng số người dùng */}
      <Col xs={24} sm={24} md={12} lg={12} xl={6}>
        <Card title="Tỷ lệ người dùng đã mua">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              {/* Text giữa biểu đồ */}
              <text
                x="50%"
                y="40%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={16}
                fontWeight="bold"
              >
                {dashboardInfo?.inforUsersAndBuyers
                  ? `${Math.round(
                      (dashboardInfo.inforUsersAndBuyers.buyers /
                        dashboardInfo.inforUsersAndBuyers.totalUsers) *
                        100
                    )}%`
                  : "0%"}
              </text>
              <text
                x="50%"
                y="48%"   // khoảng cách theo trục y để nằm dưới phần trăm
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fill="#555"  // màu chữ hơi tối nhẹ, bạn có thể chỉnh màu
              >
                Đã mua hàng
              </text>

              {/* Tooltip khi hover */}
              <Tooltip
                formatter={(value, name) =>
                  [`${value} người`, name]
                }
              />

              {/* Legend chú thích */}
              <Legend
                verticalAlign="bottom"
                layout="horizontal"
                iconType="circle"
                wrapperStyle={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: 10,
                  fontSize: 14,
                }}
                formatter={(value) => <span>{value}</span>}
              />

            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
        {/* Biểu đồ 2: Area Chart - Tỷ lệ Doanh thu - Chi phí */}
      <Col xs={24} sm={24} md={24} lg={24} xl={12}>
        <Card
          title="Tỷ lệ Doanh thu - Chi phí theo tháng"
          extra={
            <Select
              value={selectedYear}
              onChange={(value) => setSelectedYear(value)}
              style={{ width: 100 }}
            >
              {availableYears.map((year) => (
                <Select.Option key={year} value={year}>
                  {year}
                </Select.Option>
              ))}
            </Select>
          }
        >
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={revenueExpenseData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value) => value.toLocaleString("vi-VN") + " ₫"} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorIncome)"
                name="Doanh thu"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorExpense)"
                name="Chi phí"
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </Col>
        {/* Biểu đồ 3: Bar Chart - Top 4 sản phẩm được xem nhiều nhất */}
      <Col xs={24} sm={24} md={12} lg={12} xl={6}>
        <Card title="Top người dùng mua nhiều nhất">
          {/* Biểu đồ cuộn - giữ nguyên XAxis chiều ngang */}
          <div className="hide-scrollbar" style={{ width: "100%", maxHeight: 220, overflowY: "auto" }}>
            <ResponsiveContainer width="100%" height={topUsers.length * 35}>
              <BarChart
                data={topUsers.sort((a, b) => b.totalItems - a.totalItems)}
                layout="vertical"
                margin={{ left: 0, right: 30 }}
                barCategoryGap={5}
              >
                {/* XAxis để căn chỉnh, nhưng ẩn đi */}
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={({ x, y, index }) => (
                    <CustomYAxisTick x={x} y={y} index={index} />
                  )}
                  tickLine={false}
                />
                <Tooltip
                
                  formatter={(value, name, props) => {
                    const index = props?.dataIndex;
                    const user = index !== undefined ? topUsers[index] : null;
                    return [`${value.toLocaleString()} sản phẩm`, user?.name || ""];
                  }}
                />
                <Bar dataKey="totalItems" barSize={25} label={<CustomLabel />}>
                  {topUsers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* XAxis cố định */}
          <div style={{ width: "100%", height: 30 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[{ name: "Ẩn", totalItems: 100 }]} // Dummy data
                layout="vertical"
                margin={{ left: 60, right: 30 }}
              >
                <XAxis
                  type="number"
                  tickFormatter={(value) => value.toLocaleString()}
                  axisLine
                  tickLine
                />
                <Tooltip />
                <Bar dataKey="totalItems" fill="transparent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>
    </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        {/* Hàng 2: 4 biểu đồ mới */}

        {/* Biểu đồ 1: Pie chart tỉ lệ đã bán */}
        <Col xs={24} sm={24} md={12} lg={12} xl={6}>
          <Card title="Tỉ lệ sản phẩm đã bán">
            <PieChartComponent />
          </Card>
        </Col>
        {/* Biểu đồ 3: Top sản phẩm yêu thích */}
        <Col span={9}>
          <Card title="Top sản phẩm yêu thích">
            <div className="hide-scrollbar" style={{ width: "100%", maxHeight: 220, overflowY: "auto" }}>
              <ResponsiveContainer width="100%" height={topFavoriteProductsWithImage.length * 35}>
                <BarChart
                  data={topFavoriteProductsWithImage.sort((a, b) => b.likes - a.likes)}
                  layout="vertical"
                  margin={{ left: 0, right: 30 }}
                  barCategoryGap={5}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={({ x, y, index }) => <ProductYAxisTick x={x} y={y} index={index} />}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value, name, props) => {
                      const index = props?.dataIndex;
                      const product = index !== undefined ? topFavoriteProductsWithImage[index] : null;
                      return [`${value.toLocaleString()} lượt thích`, product?.name || ""];
                    }}
                  />
                  <Bar dataKey="likes" barSize={25} label={<ProductLabel data={topFavoriteProductsWithImage} />}>
                    {topFavoriteProductsWithImage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ width: "100%", height: 30 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[{ name: "Ẩn", likes: 100 }]} // Dummy
                  layout="vertical"
                  margin={{ left: 60, right: 30 }}
                >
                  <XAxis
                    type="number"
                    tickFormatter={(value) => value.toLocaleString()}
                    axisLine
                    tickLine
                  />
                  <Tooltip />
                  <Bar dataKey="likes" fill="transparent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        {/* Biểu đồ 4: Top sản phẩm xem nhiều */}
        <Col span={9}>
          <Card title="Top sản phẩm xem nhiều nhất">
            <div className="hide-scrollbar" style={{ width: "100%", maxHeight: 220, overflowY: "auto" }}>
              <ResponsiveContainer width="100%" height={topViewedProductsWithImage.length * 35}>
                <BarChart
                  data={topViewedProductsWithImage.sort((a, b) => b.views - a.views)}
                  layout="vertical"
                  margin={{ left: 0, right: 30 }}
                  barCategoryGap={5}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={({ x, y, index }) => <ProductYAxisTick x={x} y={y} index={index} />}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value, name, props) => {
                      const index = props?.dataIndex;
                      const product = index !== undefined ? topViewedProductsWithImage[index] : null;
                      return [`${value.toLocaleString()} lượt xem`, product?.name || ""];
                    }}
                  />
                  <Bar dataKey="views" barSize={25} label={<ProductLabel data={topViewedProductsWithImage} />}>
                    {topViewedProductsWithImage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ width: "100%", height: 30 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[{ name: "Ẩn", views: 200 }]} // Dummy
                  layout="vertical"
                  margin={{ left: 60, right: 30 }}
                >
                  <XAxis
                    type="number"
                    tickFormatter={(value) => value.toLocaleString()}
                    axisLine
                    tickLine
                  />
                  <Tooltip />
                  <Bar dataKey="views" fill="transparent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <Card title="Đơn hàng cần xuất kho" extra={<a href="/admin/orders">Xem thêm</a>}>
            <Table
              columns={exportOrderColumns}
              dataSource={exportOrders}
              pagination={false}
              rowKey="_id"
              locale={{ emptyText: "Không có đơn hàng cần xuất kho" }}
            />
          </Card>

        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
        <Card title="Sản phẩm bán chạy" extra={<a href="/admin/orders">Xem thêm</a>}>
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

const exportOrderColumns = [
  {
    title: "Mã đơn hàng",
    dataIndex: "_id",
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    render: (text) => new Date(text).toLocaleString(),
  },
  {
    title: "Sản phẩm",
    dataIndex: "items",
    render: (items) => {
      const productName = items?.[0]?.product?.name || "Không rõ";
      return productName.length > 20 ? productName.slice(0, 20) + "..." : productName;
    },
  },
  {
    title: "Số lượng",
    dataIndex: "items",
    render: (items) => items?.[0]?.quantity || 0,
  },
  {
    title: "Trạng thái",
    dataIndex: "statusSupplier",
    render: (status) => (
      <span style={{ color: "orange", fontWeight: "bold" }}>{status}</span>
    ),
  },
];


export default Dashboard;
