import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authServices';
import { toast } from 'react-toastify';

const getUserfromLocalStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;
const initialState = {
  user: getUserfromLocalStorage,
  orders: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
};
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    const re = await authService.login(userData);
    console.log(re);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  },
);

export const getOrders = createAsyncThunk(
  'order/get-orders',
  async (data, thunkAPI) => {
    const re = await authService.getOrders(data);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  },
);
export const getaOrder = createAsyncThunk(
  'order/get-order',
  async (id, thunkAPI) => {
    const re = await authService.getOrder(id);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  },
);

export const updateAOrder = createAsyncThunk(
  'order/update-order',
  async (data, thunkAPI) => {
    const re = await authService.updateOrder(data);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  },
);

export const getMonthlyData = createAsyncThunk(
  'orders/monlthdata',
  async (data, thunkAPI) => {
    try {
      return await authService.getMonthlyOrders(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getYearlyData = createAsyncThunk(
  'orders/yearlydata',
  async (data, thunkAPI) => {
    try {
      return await authService.getYearlyStats(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const confirmPayments = createAsyncThunk(
  'product/create-products',
  async (data, thunkAPI) => {
    const re = await authService.confirmPayment(data);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: (buildeer) => {
    buildeer
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;

        state.message = 'success';
        if (action.payload.data.user.role === 'admin') {
          state.isSuccess = true;
          localStorage.setItem(
            'access_token',
            action.payload.data.access_token,
          );
          localStorage.setItem(
            'user',
            JSON.stringify(action.payload.data.user),
          );
          state.user = action.payload.data.user;
          toast.success('Đăng nhập thành công!');
        } else {
          toast.error('User không thể đăng nhập');
          state.isSuccess = false;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload.message;
        state.isLoading = false;
        if (state.isError === true) {
          toast.error(action.payload.message);
        }
      })
      .addCase(confirmPayments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(confirmPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdProduct = action.payload;
      })
      .addCase(confirmPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload.data.result;
        state.message = 'success';
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(updateAOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAOrder.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.updateorder = action.payload;
        if (state.isSuccess === true) {
          toast.success('Đã thay đổi trạng thái đơn hàng');
        }
      })
      .addCase(updateAOrder.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(getaOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getaOrder.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.singleorder = action.payload.data;
        state.message = 'success';
      })
      .addCase(getaOrder.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(getMonthlyData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMonthlyData.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.monthlyData = action.payload;
        state.message = 'success';
      })
      .addCase(getMonthlyData.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(getYearlyData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getYearlyData.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.yearlyData = action.payload;
        state.message = 'success';
      })
      .addCase(getYearlyData.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
