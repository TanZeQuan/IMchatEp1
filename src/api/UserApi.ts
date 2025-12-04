// src/api/UserApi.ts
import axios from "axios";
import { API_BASE_URL } from "./config";

// ============================================
// 类型定义 - 认证相关
// ============================================

// 注册
export interface RegisterPayload {
  name: string;     // 昵称
  phone: string;    // 手机号
  email: string;    // 邮箱
  password: string; // 密码
}

// 登录
export interface LoginPayload {
  phone: string;
  password: string;
}

// ============================================
// 类型定义 - 忘记密码流程
// ============================================

// 发送 OTP
export interface SendOTPPayload {
  email: string;
}

// 验证 OTP
export interface VerifyOTPPayload {
  email: string;
  otp: string;
}

// 重设密码
export interface ResetPasswordPayload {
  password: string;
}

// ============================================
// 类型定义 - 个人资料管理
// ============================================

// 修改邮箱
export interface ChangeEmailPayload {
  user_id: string;
  email: string;
}

// 更新个人资料
export interface UpdateProfilePayload {
  user_id: string;  // 必填
  name?: string;    // 可选
  about?: string;   // 可选
  image?: {
    uri: string;
    name?: string;
    type?: string;
  };                // 可选
}

// ============================================
// API 函数 - 认证相关
// ============================================

// 注册 API
export const register = async (payload: RegisterPayload) => {
  try {
    const formData = new FormData();

    // 后端要求把所有参数放在 data 字段(JSON字符串)
    formData.append(
      "data",
      JSON.stringify({
        phone: payload.phone,
        passcode: payload.password, // 后端叫 passcode
        email: payload.email,
        roles: "user",
        status: 1,
        name: payload.name,
      })
    );

    const res = await axios.post(`${API_BASE_URL}/users/new`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;

  } catch (error: any) {
    console.error("Register error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// 登录 API
export const login = async (payload: LoginPayload) => {
  try {
    const formData = new FormData();

    formData.append(
      "data",
      JSON.stringify({
        phone: payload.phone,
        passcode: payload.password,
      })
    );

    const res = await axios.post(`${API_BASE_URL}/login`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ============================================
// API 函数 - 忘记密码流程
// ============================================

// 发送 OTP
export const sendOTP = async (payload: SendOTPPayload) => {
  try {
    const formData = new FormData();

    formData.append(
      "data",
      JSON.stringify({
        email: payload.email,
      })
    );

    const res = await axios.post(`${API_BASE_URL}/forget/otp/send`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error: any) {
    console.error("Send OTP error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// 验证 OTP
export const verifyOTP = async (payload: VerifyOTPPayload) => {
  try {
    const formData = new FormData();

    formData.append("data", JSON.stringify({
      email: payload.email,
      otp: payload.otp,
    }));

    const res = await axios.post(`${API_BASE_URL}/forget/otp/verify`, payload);
    return res.data;
  } catch (error: any) {
    console.error("Verify OTP error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// 重设密码
export const resetPassword = async (payload: ResetPasswordPayload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/forget/password/reset`, payload);
    return res.data;
  } catch (error: any) {
    console.error("Reset Password error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ============================================
// 

// ============================================

// 修改邮箱
export const changeEmail = async (payload: ChangeEmailPayload) => {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify({
      user_id: payload.user_id,
      email: payload.email,
    }));

    const res = await axios.post(`${API_BASE_URL}/users/email/change`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error: any) {
    console.error("Change Email Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// 更新个人资料
export const updateProfile = async (payload: any) => {
  try {
    const formData = new FormData();

    formData.append(
      "data",
      JSON.stringify({
        user_id: payload.user_id,
        name: payload.name || "",
        about: payload.about || "",
      })
    );

    if (payload.image) {
      formData.append("image", {
        uri: payload.image.uri,
        name: payload.image.name || "avatar.jpg",
        type: payload.image.type || "image/jpeg",
      } as any);
    }

    const res = await fetch(
      `${API_BASE_URL}/users/info/update`,
      {
        method: "POST",
        body: formData,
      }
    );

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "更新失败");

    return json;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};
