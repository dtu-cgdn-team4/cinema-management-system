import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { authApi } from "../api/authApi";

// Mock authApi
vi.mock("../api/authApi", () => ({
  authApi: {
    register: vi.fn(),
  },
  default: {
    register: vi.fn(),
  },
}));

describe("RegisterForm Component", () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>,
    );
  };

  it("renders all form fields and submit button", () => {
    renderComponent();

    expect(screen.getByLabelText(/Tài khoản/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Họ và tên/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ngày sinh/i)).toBeInTheDocument();
    expect(screen.getByText(/Giới tính/i)).toBeInTheDocument();
    expect(screen.getByText("Nam")).toBeInTheDocument();
    expect(screen.getByText("Nữ")).toBeInTheDocument();
    expect(screen.getByText("Khác")).toBeInTheDocument();
    expect(screen.getByLabelText(/Số điện thoại/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nhập lại mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Đăng ký/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Đã có tài khoản\?/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Đăng nhập ngay/i }),
    ).toBeInTheDocument();
  });

  it("renders CCCD and Địa chỉ fields labeled as optional", () => {
    renderComponent();

    expect(screen.getByLabelText(/CCCD \/ CMND/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Địa chỉ/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Không bắt buộc/i).length).toBe(2);
  });

  it("validates invalid CCCD and address format when provided", async () => {
    renderComponent();

    const idCardInput = screen.getByLabelText(/CCCD \/ CMND/i);
    const addressInput = screen.getByLabelText(/Địa chỉ/i);

    fireEvent.change(idCardInput, { target: { value: "123" } });
    fireEvent.blur(idCardInput);

    fireEvent.change(addressInput, { target: { value: "hn" } });
    fireEvent.blur(addressInput);

    const submitBtn = screen.getByRole("button", { name: /Đăng ký/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Số CCCD\/CMND không hợp lệ/i)).toBeInTheDocument();
      expect(screen.getByText(/Địa chỉ phải có độ dài từ 5 đến 255 ký tự/i)).toBeInTheDocument();
    });
  });

  it("displays client validation errors when submitting an empty form", async () => {
    renderComponent();

    const submitBtn = screen.getByRole("button", { name: /Đăng ký/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Vui lòng nhập tên tài khoản/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Vui lòng nhập họ và tên/i)).toBeInTheDocument();
      expect(screen.getByText(/Vui lòng nhập email/i)).toBeInTheDocument();
      expect(screen.getByText(/Vui lòng chọn ngày sinh/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Vui lòng nhập số điện thoại/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Vui lòng tạo mật khẩu/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Bạn cần đồng ý với Điều khoản/i),
      ).toBeInTheDocument();
    });
  });

  it("validates password requirements: at least 8 chars, 1 uppercase, 1 lowercase, 1 digit", async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText(/^Mật khẩu/i);
    fireEvent.change(passwordInput, { target: { value: "weakpass" } });
    fireEvent.blur(passwordInput);

    const submitBtn = screen.getByRole("button", { name: /Đăng ký/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(
          /Mật khẩu tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 số/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it("validates password confirmation mismatch", async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText(/^Mật khẩu/i);
    const confirmInput = screen.getByLabelText(/Nhập lại mật khẩu/i);

    fireEvent.change(passwordInput, { target: { value: "ValidPass123" } });
    fireEvent.change(confirmInput, { target: { value: "DifferentPass123" } });
    fireEvent.blur(confirmInput);

    const submitBtn = screen.getByRole("button", { name: /Đăng ký/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Mật khẩu xác nhận không khớp/i),
      ).toBeInTheDocument();
    });
  });

  it("shows server error toast/alert if backend returns conflict error", async () => {
    const errorMsg = "Tài khoản đã tồn tại trong hệ thống.";
    vi.mocked(authApi.register).mockRejectedValueOnce({
      response: {
        data: {
          code: 409,
          message: errorMsg,
        },
      },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Tài khoản/i), {
      target: { value: "galaxy_user" },
    });
    fireEvent.change(screen.getByLabelText(/Họ và tên/i), {
      target: { value: "Nguyễn Văn A" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Ngày sinh/i), {
      target: { value: "1998-05-15" },
    });
    fireEvent.change(screen.getByLabelText(/Số điện thoại/i), {
      target: { value: "0901234567" },
    });
    fireEvent.change(screen.getByLabelText(/^Mật khẩu/i), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByLabelText(/Nhập lại mật khẩu/i), {
      target: { value: "Password123" },
    });
    fireEvent.click(screen.getByRole("checkbox"));

    const submitBtn = screen.getByRole("button", { name: /Đăng ký/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(errorMsg);
    });
  });
});
