import { createSlice } from "@reduxjs/toolkit";
import { StringLiteral } from "typescript";
import { localDataName } from "../../constants/appInfos";


export interface AuthState {
    token: string;
    _id: string;
    name: string;
    rule: number;
};

const initialState = {
    token: '',
    _id: '',
    name: '',
    rule: 0
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        data: initialState
    },
    reducers: {
        addAuth: (state, action) => {
            state.data = action.payload;
            syncLocal(action.payload);
        },

        removeAuth: (state, _action) => {
            state.data = initialState;
            syncLocal({});
        },

        refreshtoken: (state, action) => {
            state.data.token = action.payload;
        },
    },
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth, refreshtoken } = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.data;

const syncLocal = (data: any) => {
    localStorage.setItem(localDataName.authData, JSON.stringify(data));
};