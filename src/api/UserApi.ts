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

// 👉 1. 发送 OTP Payload
export interface SendOTPPayload {
  email: string;
}

// 👉 2. 验证 OTP Payload
export interface VerifyOTPPayload {
  email: string;
  otp: string;
}

// 👉 3. 重设密码 Payload
export interface ResetPasswordPayload {
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

export const sendOTP = async (payload: SendOTPPayload) => {
  try {
    const res = await axios.post(`${BASE_URL}/forget/otp/send`, payload);
    return res.data;
  } catch (error: any) {
    console.error("Send OTP error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// =============================
// 2) 验证 OTP
// =============================
export const verifyOTP = async (payload: VerifyOTPPayload) => {
  try {
    const res = await axios.post(`${BASE_URL}/forget/otp/verify`, payload);
    return res.data;
  } catch (error: any) {
    console.error("Verify OTP error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// =============================
// 3) 重设密码
// =============================
export const resetPassword = async (payload: ResetPasswordPayload) => {
  try {
    const res = await axios.post(`${BASE_URL}/forget/password/reset`, payload);
    return res.data;
  } catch (error: any) {
    console.error("Reset Password error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
