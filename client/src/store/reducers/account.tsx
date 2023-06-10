import { createSlice, configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import { accountService, ILoginRequest, IRegisterRequest } from '../../api/services/accountService';
import { tokenUtility } from '../../utils/tokenUtility';
import { IUser } from '../../react-app-env.d';



interface IState {
    isAuth: boolean;
    user?: IUser;
    status: 'idle' | 'pending' | 'rejected' | 'fulfilled'
}

const initialState: IState = {
    user: undefined,
    isAuth: false,
    status: 'idle'
};

export const loginActionAsync = createAsyncThunk('loginActionAsync', async (request: ILoginRequest) => {
    let response;
    try {
        response = await accountService.loginAsync(request);
    }
    catch (error) {
        throw new Error("Invalid credentials");
    }
    tokenUtility.setToken(response.data.token);
    return response.data.user;
});

export const registerActionAsync = createAsyncThunk('registerActionAsync', async (request: IRegisterRequest) => {
    let response;
    try {
        response = await accountService.registerAsync(request);
    }
    catch (error) {
        throw new Error("Invalid credentials");
    }
    tokenUtility.setToken(response.data.token);
    return response.data.user;
})

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        logoutAction: (state) => {
            state.user = undefined;
        },
        loginAction: (state, action) => {
            state.isAuth = action.payload;
        }
    },
    extraReducers: {
        // login
        [loginActionAsync.pending.type]: (state, action) => {
            state.status = 'pending';
        },
        [loginActionAsync.rejected.type]: (state, action) => {
            state.status = 'rejected';
        },
        [loginActionAsync.fulfilled.type]: (state, action) => {
            state.user = action.payload;
            state.status = 'fulfilled';
        },
        // register
        [registerActionAsync.pending.type]: (state, action) => {
            state.status = 'pending';
        },
        [registerActionAsync.rejected.type]: (state, action) => {
            state.status = 'rejected';
        },
        [registerActionAsync.fulfilled.type]: (state, action) => {
            state.user = action.payload;
            state.status = 'fulfilled';
        }
    }
});

export const { logoutAction, loginAction } = accountSlice.actions;

export default accountSlice.reducer;

