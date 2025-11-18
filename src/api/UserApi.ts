// src/api/UserApi.ts
import axios from "axios";

const BASE_URL = "https://prelabial-lustrously-michaela.ngrok-free.dev/api"; // 替换成你的后端地址

// Register payload 用手机号
export interface RegisterPayload {
  name: string;     // 昵称
  phone: string;    // 手机号
  password: string; // 密码
}

// Login payload
export interface LoginPayload {
  phone: string;
  password: string;
}

export interface ResetPayload {
  phone: string;
  password: string;
}

// 注册 API
export const register = async (payload: RegisterPayload) => {
  try {
    
    const res = await axios.post(`${BASE_URL}/users/new`, payload);
    return res.data;
  } catch (error: any) {
    console.error("Register error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// 登录 API
export const login = async (payload: LoginPayload) => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, payload);
    return res.data; // 假设返回 { token: "xxx" }
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const ResetPassword = async (payload: ResetPayload) => {
  try {
    const res = await axios.post(`${BASE_URL}/users/reset-password`, payload);
    return res.data;
  } catch (error: any) {
    console.error("Reset password error:", error.response?.data || error.message);
    throw error.response?.data || error;
  } 
};
