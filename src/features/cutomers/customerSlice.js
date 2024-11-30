import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerService from "./customerService";

// Async Thunks
export const getUsers = createAsyncThunk(
  "customer/all-users",
  async (_, thunkAPI) => {
    const re = await customerService.getUsers();
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const blockUser = createAsyncThunk(
  "customer/block-user",
  async (userId, thunkAPI) => {
    const re = await customerService.blockUser(userId);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const unblockUser = createAsyncThunk(
  "customer/unblock-user",
  async (userId, thunkAPI) => {
    const re = await customerService.unblockUser(userId);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

export const updateUser = createAsyncThunk(
  "customer/edit-user",
  async (user, thunkAPI) => {
    const re = await customerService.updateUser(user);
    if (re && re.data) {
      return re;
    } else {
      return thunkAPI.rejectWithValue(re);
    }
  }
);

const initialState = {
  customers: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.customers = action.payload.data.result;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.customers = state.customers.map((customer) =>
          customer._id === action.payload._id ? action.payload : customer
        );
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        state.customers = state.customers.map((customer) =>
          customer._id === action.payload._id ? action.payload : customer
        );
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.customers = state.customers.map((customer) =>
          customer._id === action.payload._id ? action.payload : customer
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default customerSlice.reducer;
