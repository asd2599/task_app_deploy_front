import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  POST_TASKS_API_URL,
  GET_TASKS_API_URL,
  UPDATE_COMPLETED_TASK_API_URL,
  UPDATE_TASK_API_URL,
  DELETE_TASK_API_URL,
} from "../../utils/apiUrls";
import {
  postRequest,
  getRequest,
  patchRequest,
  deleteRequest,
  putRequest,
} from "../../utils/requests";

const postItemFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (postData) => {
    const options = {
      body: JSON.stringify(postData),
    };

    return await postRequest(apiURL, options);
  });
};

const getItemFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (userId) => {
    const fullPath = `${apiURL}/${userId}`;
    return await getRequest(fullPath);
  });
};

const updateCompletedTaskFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (options) => {
    return await patchRequest(apiURL, options);
  });
};

const deleteItemFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (itemId) => {
    const options = {
      method: "DELETE",
    };

    const fullPath = `${apiURL}/${itemId}`;
    return await deleteRequest(fullPath, options);
  });
};

const updateItemFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (updateData) => {
    const options = {
      body: JSON.stringify(updateData),
    };

    return await putRequest(apiURL, options);
  });
};

export const fetchPostItem = postItemFetchThunk(
  "fetchPostItem",
  POST_TASKS_API_URL,
);
export const fetchGetItem = getItemFetchThunk(
  "fetchGetItem",
  GET_TASKS_API_URL,
);
export const fetchUpdateCompletedTask = updateCompletedTaskFetchThunk(
  "fetchUpdateCompletedTask",
  UPDATE_COMPLETED_TASK_API_URL,
);

export const fetchDeleteItem = deleteItemFetchThunk(
  "fetchDeleteItem",
  DELETE_TASK_API_URL,
);

export const fetchUpdateItem = updateItemFetchThunk(
  "fetchUpdateItem",
  UPDATE_TASK_API_URL,
);

const handleFulfilled = (key) => (state, action) => {
  state[key] = action.payload;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const apiSlice = createSlice({
  name: "api",
  initialState: {
    postItemData: [],
    getItemData: [],
    updateCompletedTaskData: [],
    deleteItemData: [],
    updateItemData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostItem.fulfilled, handleFulfilled("postItemData"))
      .addCase(fetchPostItem.rejected, handleRejected)
      .addCase(fetchGetItem.fulfilled, handleFulfilled("getItemData"))
      .addCase(fetchGetItem.rejected, handleRejected)
      .addCase(
        fetchUpdateCompletedTask.fulfilled,
        handleFulfilled("updateCompletedTaskData"),
      )
      .addCase(fetchUpdateCompletedTask.rejected, handleRejected)
      .addCase(fetchDeleteItem.fulfilled, handleFulfilled("deleteItemData"))
      .addCase(fetchDeleteItem.rejected, handleRejected)
      .addCase(fetchUpdateItem.fulfilled, handleFulfilled("updateItemData"))
      .addCase(fetchUpdateItem.rejected, handleRejected);
  },
});

export default apiSlice.reducer;
