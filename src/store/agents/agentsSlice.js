import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/api"; // Your configured axios instance
import api from "../../api/api";

// Fetch agents with pagination and search
export const fetchAgents = createAsyncThunk(
    "agents/fetchAgents",
    async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
        try {
            const response = await axios.get("/agents", {
                params: { page, limit, search }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Server Error" });
        }
    }
);

// Create a new agent
export const createAgent = createAsyncThunk(
    "agents/createAgent",
    async (agentData, { rejectWithValue }) => {
        try {
            const response = await axios.post("/agents/create", agentData);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Server Error" });
        }
    }
);

// Edit an agent
export const editAgent = createAsyncThunk(
    "agents/editAgent",
    async ({ agentId, updateData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/agents/edit/${agentId}`, updateData);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Server Error" });
        }
    }
);

// ✅ Create Transaction (Admin add/remove balance)
export const createAgentTransaction = createAsyncThunk(
    "agentTransactions/create",
    async ({ agentId, type, amount }, { rejectWithValue }) => {
        try {
            const res = await api.post(`/agents/${agentId}/balance`, { type, amount });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to create transaction");
        }
    }
);

// Create User
export const createAgentUser = createAsyncThunk(
    "agent/userCreate",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post("agents/user/create", userData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

// Get All Users
export const getagentUsers = createAsyncThunk(
    "agent/getUser",
    async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({ page, limit });
            if (search) params.append("search", search);

            const response = await api.get(`agents/users?${params.toString()}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

// Edit User
export const updateAgentUser = createAsyncThunk(
    "agent/editUser",
    async ({ userId, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`agents/users/${userId}`, data);
            return response.data
        } catch (error) {
            rejectWithValue(error.response?.data || { message: "Server Error" })
        }
    }
)

// balance transaction of user
export const updateUserFund = createAsyncThunk(
    "agent/updateUserFund",
    async ({ userId, amount, type }, { rejectWithValue }) => {
        try {
            const response = await api.put(`agents/users/${userId}/fund`, {
                amount,
                type, // "add" or "remove"
            });
            return response.data; // contains { message, agent, user }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update user fund"
            );
        }
    }
);

// Transaction History 
export const transactionHistory = createAsyncThunk(
    "agent/transaction",
    async ({ page = 1, limit = 10, type, userId, userName }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            params.append("page", page);
            params.append("limit", limit);
            if (type) params.append("type", type);
            if (userId) params.append("userId", userId);
            if (userName) params.append("userName", userName); // 🔎 add userName search

            const response = await api.get(`agents/transactions/history?${params.toString()}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch transactions"
            );
        }
    }
);

export const userTransactionHistory = createAsyncThunk(
    "transactions/history",
    async ({ userId, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get(
                `/agents/user/${userId}/transactions?page=${page}&limit=${limit}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch transactions"
            );
        }
    }
);


const agentsSlice = createSlice({
    name: "agents",
    initialState: {
        agents: [],
        total: 0,
        pagination: {
            page: 1,
            limit: 10,
            totalPages: 0
        },
        loading: false,
        error: null,
        userList: [],
        transactions: [],
        transactionsPagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0
        },
        userTransactions: [],
        userTransactionsPagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0
        }
    },
    reducers: {
        clearAgentsError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch agents
            .addCase(fetchAgents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAgents.fulfilled, (state, action) => {
                state.loading = false;
                state.agents = action.payload.data;
                state.total = action.payload.pagination.total;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchAgents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch agents";
            })

            // Create agent
            .addCase(createAgent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAgent.fulfilled, (state, action) => {
                state.loading = false;
                state.agents.unshift(action.payload); // Add new agent at top
                state.total += 1;
            })
            .addCase(createAgent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to create agent";
            })

            // Edit agent
            .addCase(editAgent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editAgent.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.agents.findIndex(a => a.agent_id === action.payload.agent_id);
                if (index !== -1) state.agents[index] = action.payload;
            })
            .addCase(editAgent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to update agent";
            })

            .addCase(createAgentTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAgentTransaction.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createAgentTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // create user 
            .addCase(createAgentUser.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(createAgentUser.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(createAgentUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || "Failed to Create user";
            })

            // Get All Users
            .addCase(getagentUsers.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(getagentUsers.fulfilled, (state, action) => {
                state.loading = false
                state.userList = action.payload.users
            })
            .addCase(getagentUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || "Failed to Create user";
            })

            // edit user 
            .addCase(updateAgentUser.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateAgentUser.fulfilled, (state, action) => {
                state.loading = false
                // state.userList = action.payload.users
            })
            .addCase(updateAgentUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || "Failed to Create user";
            })

            .addCase(updateUserFund.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserFund.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateUserFund.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // transactions 
            .addCase(transactionHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(transactionHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload.transactions;
                state.transactionsPagination = {
                    page: action.payload.page,
                    limit: state.transactionsPagination.limit,
                    total: action.payload.total,
                    totalPages: action.payload.pages
                };
            })
            .addCase(transactionHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(userTransactionHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(userTransactionHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.userTransactions = action.payload.transactions;
                state.userTransactionsPagination = {
                    page: action.payload.page,
                    limit: state.transactionsPagination.limit,
                    total: action.payload.total,
                    totalPages: action.payload.totalPages
                };
            })
            .addCase(userTransactionHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearAgentsError } = agentsSlice.actions;
export default agentsSlice.reducer;
