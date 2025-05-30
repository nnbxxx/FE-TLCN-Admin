import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import dashboardService from "./dashboardService";

export const getInfoByTime = createAsyncThunk(
  "dashboard/get-info-by-time",
  async (data, thunkAPI) => {
    const re = await dashboardService.getInfoByTime(data);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);
export const postDashboardRevenue = createAsyncThunk(
  "dashboard/post-dashboard-revenue",
  async (data, thunkAPI) => {
    const re = await dashboardService.postDashboardRevenue(data);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const getDashboardInfo = createAsyncThunk(
  "dashboard/get-dashboard-info",
  async (_, thunkAPI) => {
    const re = await dashboardService.getDashboardInfo();
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
  dashboards: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const dashboardSlice = createSlice({
  name: "dashboards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInfoByTime.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInfoByTime.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.dashboards = action.payload.data;
      })
      .addCase(getInfoByTime.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(postDashboardRevenue.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postDashboardRevenue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdashboard = action.payload.data;
      })
      .addCase(postDashboardRevenue.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      
      .addCase(getDashboardInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.dashboardInfo = action.payload;
        // state.couponName = action.payload.data.name;
        // state.couponCode = action.payload.data.code;
        // state.couponExpiry = action.payload.data.couponExpired;
        // state.couponDiscount = action.payload.data.description.value;
        // state.couponPointAccept = action.payload.data.description.pointAccept;
        // state.couponQuantity = action.payload.data.quantity;
        // state.couponType = action.payload.data.type;
        // state.couponMaxDiscount = action.payload.data.description.maxDiscount;

      })
      .addCase(getDashboardInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
     
      .addCase(resetState, () => initialState);
  },
});

export default dashboardSlice.reducer;
