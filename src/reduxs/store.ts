import { configureStore } from '@reduxjs/toolkit'
import React from 'react'
import { authReducer } from './reducers/authReducer';

const store = configureStore({
    reducer: {
        authReducer,
    },
});

export default store
