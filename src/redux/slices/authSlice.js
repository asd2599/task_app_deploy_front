import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authData: JSON.parse(localStorage.getItem('authData')) || null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.authData = action.payload.authData; //로그인 성공 시 상태값 업데이트            
            localStorage.setItem('authData', JSON.stringify(action.payload.authData)); //로컬스토리지에 저장
        },
        logout: (state) => {
            state.authData = null; //로그아웃 시 상태값 초기화
            localStorage.removeItem('authData'); //로컬스토리지에서 삭제
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
