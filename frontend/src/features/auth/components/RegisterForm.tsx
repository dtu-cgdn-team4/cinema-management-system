import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import useRegister from "../hooks/useRegister";
import { GenderType } from "../types";

export const RegisterForm: React.FC = () => {
  const {
    formData,
    errors,
    touched,
    isSubmitting,
    serverError,
    successMessage,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full max-w-[504px] flex flex-col gap-5 text-[#f5f2ed]">
      {/* Header Info */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold text-[#e04445] tracking-[2.2px] uppercase">
          THÀNH VIÊN GALAXY
        </span>
        <h1 className="text-3xl font-semibold text-[#f5f2ed] tracking-[-1px]">
          Tạo tài khoản mới.
        </h1>
        <p className="text-[13px] text-[#9d9ea5]">
          Điền đầy đủ thông tin để hoàn tất đăng ký.
        </p>
      </div>

      {/* Backend Alert Messages */}
      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-3 p-3.5 bg-red-950/40 border border-[#ca3538]/50 rounded-lg text-sm text-[#f87171] animate-fadeIn"
        >
          <AlertCircle className="w-5 h-5 shrink-0 text-[#ca3538]" />
          <span className="flex-1 leading-snug">{serverError}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="alert"
          className="flex items-center gap-3 p-3.5 bg-emerald-950/40 border border-emerald-500/50 rounded-lg text-sm text-emerald-300 animate-fadeIn"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span className="flex-1 leading-snug">{successMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-3.5"
      >
        {/* Username */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="username"
            className="text-xs font-medium text-[#f5f2ed]"
          >
            Tài khoản
          </label>
          <div
            className={`flex items-center gap-2.5 h-12 px-3.5 rounded-lg bg-[#17181b] border transition-colors ${
              touched.username && errors.username
                ? "border-red-500 ring-1 ring-red-500"
                : "border-[#303135] focus-within:border-[#ca3538] focus-within:ring-1 focus-within:ring-[#ca3538]"
            }`}
          >
            <User className="w-4 h-4 text-[#9d9ea5] shrink-0" />
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              onBlur={() => handleBlur("username")}
              placeholder="Nhập tài khoản để đăng ký"
              autoComplete="username"
              disabled={isSubmitting}
              className="w-full bg-transparent text-sm text-[#f5f2ed] placeholder-[#74767e] outline-none"
            />
          </div>
          {touched.username && errors.username && (
            <p className="text-xs text-red-500 mt-0.5">{errors.username}</p>
          )}
        </div>

        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="fullName"
            className="text-xs font-medium text-[#f5f2ed]"
          >
            Họ và tên
          </label>
          <div
            className={`flex items-center gap-2.5 h-12 px-3.5 rounded-lg bg-[#17181b] border transition-colors ${
              touched.fullName && errors.fullName
                ? "border-red-500 ring-1 ring-red-500"
                : "border-[#303135] focus-within:border-[#ca3538] focus-within:ring-1 focus-within:ring-[#ca3538]"
            }`}
          >
            <User className="w-4 h-4 text-[#9d9ea5] shrink-0" />
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              placeholder="Nhập họ và tên người dùng"
              autoComplete="name"
              disabled={isSubmitting}
              className="w-full bg-transparent text-sm text-[#f5f2ed] placeholder-[#74767e] outline-none"
            />
          </div>
          {touched.fullName && errors.fullName && (
            <p className="text-xs text-red-500 mt-0.5">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-medium text-[#f5f2ed]">
            Email
          </label>
          <div
            className={`flex items-center gap-2.5 h-12 px-3.5 rounded-lg bg-[#17181b] border transition-colors ${
              touched.email && errors.email
                ? "border-red-500 ring-1 ring-red-500"
                : "border-[#303135] focus-within:border-[#ca3538] focus-within:ring-1 focus-within:ring-[#ca3538]"
            }`}
          >
            <Mail className="w-4 h-4 text-[#9d9ea5] shrink-0" />
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="Nhập địa chỉ email"
              autoComplete="email"
              disabled={isSubmitting}
              className="w-full bg-transparent text-sm text-[#f5f2ed] placeholder-[#74767e] outline-none"
            />
          </div>
          {touched.email && errors.email && (
            <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>
          )}
        </div>

        {/* Row: Ngày sinh & Giới tính */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Ngày sinh */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="dateOfBirth"
              className="text-xs font-medium text-[#f5f2ed]"
            >
              Ngày sinh
            </label>
            <div
              className={`flex items-center gap-2.5 h-12 px-3.5 rounded-lg bg-[#17181b] border transition-colors ${
                touched.dateOfBirth && errors.dateOfBirth
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-[#303135] focus-within:border-[#ca3538] focus-within:ring-1 focus-within:ring-[#ca3538]"
              }`}
            >
              <Calendar className="w-4 h-4 text-[#9d9ea5] shrink-0" />
              <input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                onBlur={() => handleBlur("dateOfBirth")}
                disabled={isSubmitting}
                className="w-full bg-transparent text-sm text-[#f5f2ed] placeholder-[#74767e] outline-none [color-scheme:dark]"
              />
            </div>
            {touched.dateOfBirth && errors.dateOfBirth && (
              <p className="text-xs text-red-500 mt-0.5">
                {errors.dateOfBirth}
              </p>
            )}
          </div>

          {/* Giới tính */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[#f5f2ed]">
              Giới tính
            </span>
            <div className="flex h-12 items-center rounded-lg bg-[#17181b] border border-[#303135] overflow-hidden p-1">
              {(
                [
                  { label: "Nam", value: "MALE" },
                  { label: "Nữ", value: "FEMALE" },
                  { label: "Khác", value: "OTHER" },
                ] as const
              ).map((option, idx) => {
                const isSelected = formData.gender === option.value;
                return (
                  <React.Fragment key={option.value}>
                    {idx > 0 && (
                      <div className="h-6 w-px bg-[#303135] shrink-0" />
                    )}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() =>
                        handleChange("gender", option.value as GenderType)
                      }
                      className={`flex-1 flex items-center justify-center gap-1.5 h-full text-xs font-medium rounded transition-all ${
                        isSelected
                          ? "bg-[#303135]/60 text-[#f5f2ed]"
                          : "text-[#9d9ea5] hover:text-[#f5f2ed]"
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-[#ca3538] bg-[#ca3538]"
                            : "border-[#74767e]"
                        }`}
                      >
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </span>
                      <span>{option.label}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="phoneNumber"
            className="text-xs font-medium text-[#f5f2ed]"
          >
            Số điện thoại
          </label>
          <div
            className={`flex items-center gap-2.5 h-12 px-3.5 rounded-lg bg-[#17181b] border transition-colors ${
              touched.phoneNumber && errors.phoneNumber
                ? "border-red-500 ring-1 ring-red-500"
                : "border-[#303135] focus-within:border-[#ca3538] focus-within:ring-1 focus-within:ring-[#ca3538]"
            }`}
          >
            <Phone className="w-4 h-4 text-[#9d9ea5] shrink-0" />
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              onBlur={() => handleBlur("phoneNumber")}
              placeholder="Nhập số điện thoại (10 chữ số)"
              autoComplete="tel"
              disabled={isSubmitting}
              className="w-full bg-transparent text-sm text-[#f5f2ed] placeholder-[#74767e] outline-none"
            />
          </div>
          {touched.phoneNumber && errors.phoneNumber && (
            <p className="text-xs text-red-500 mt-0.5">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-xs font-medium text-[#f5f2ed]"
          >
            Mật khẩu
          </label>
          <div
            className={`flex items-center gap-2.5 h-12 px-3.5 rounded-lg bg-[#17181b] border transition-colors ${
              touched.password && errors.password
                ? "border-red-500 ring-1 ring-red-500"
                : "border-[#303135] focus-within:border-[#ca3538] focus-within:ring-1 focus-within:ring-[#ca3538]"
            }`}
          >
            <Lock className="w-4 h-4 text-[#9d9ea5] shrink-0" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              placeholder="Tạo mật khẩu (tối thiểu 8 ký tự, 1 hoa, 1 số)"
              autoComplete="new-password"
              disabled={isSubmitting}
              className="w-full bg-transparent text-sm text-[#f5f2ed] placeholder-[#74767e] outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="text-[#9d9ea5] hover:text-[#f5f2ed] transition-colors p-1"
            >
              {showPassword ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
          {touched.password && errors.password && (
            <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-xs font-medium text-[#f5f2ed]"
          >
            Nhập lại mật khẩu
          </label>
          <div
            className={`flex items-center gap-2.5 h-12 px-3.5 rounded-lg bg-[#17181b] border transition-colors ${
              touched.confirmPassword && errors.confirmPassword
                ? "border-red-500 ring-1 ring-red-500"
                : "border-[#303135] focus-within:border-[#ca3538] focus-within:ring-1 focus-within:ring-[#ca3538]"
            }`}
          >
            <Lock className="w-4 h-4 text-[#9d9ea5] shrink-0" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              placeholder="Nhập lại mật khẩu để xác nhận"
              autoComplete="new-password"
              disabled={isSubmitting}
              className="w-full bg-transparent text-sm text-[#f5f2ed] placeholder-[#74767e] outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="text-[#9d9ea5] hover:text-[#f5f2ed] transition-colors p-1"
            >
              {showConfirmPassword ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-0.5">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="flex flex-col gap-1 pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={(e) => handleChange("agreeTerms", e.target.checked)}
              onBlur={() => handleBlur("agreeTerms")}
              disabled={isSubmitting}
              className="mt-1 w-4 h-4 rounded border-[#303135] bg-[#17181b] text-[#ca3538] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#ca3538]"
            />
            <span className="text-xs text-[#9d9ea5] leading-relaxed">
              Tôi đồng ý với{" "}
              <a
                href="#terms"
                onClick={(e) => e.preventDefault()}
                className="font-medium text-[#e04445] hover:underline"
              >
                Điều khoản sử dụng
              </a>{" "}
              và{" "}
              <a
                href="#privacy"
                onClick={(e) => e.preventDefault()}
                className="font-medium text-[#e04445] hover:underline"
              >
                Chính sách bảo mật
              </a>{" "}
              của Galaxy Cinema.
            </span>
          </label>
          {touched.agreeTerms && errors.agreeTerms && (
            <p className="text-xs text-red-500">{errors.agreeTerms}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full h-[50px] flex items-center justify-center gap-2.5 bg-[#ca3538] hover:bg-[#b22e30] disabled:bg-[#ca3538]/50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg shadow-lg shadow-[#ca3538]/20 transition-all active:scale-[0.99] cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang đăng ký...</span>
            </>
          ) : (
            <>
              <span>Đăng ký</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Link to Login */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#9d9ea5] pt-1">
          <span>Đã có tài khoản?</span>
          <Link
            to="/login"
            className="font-semibold text-[#e04445] hover:text-[#f87171] hover:underline transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
