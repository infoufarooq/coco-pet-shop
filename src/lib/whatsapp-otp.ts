import { VERIFIED_STORE_INFO } from "./utils";

// Memory storage for OTP verification
const OTP_STORE = new Map<string, { code: string; expiresAt: number }>();

export const WhatsAppOTP = {
  generateOtp: (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    OTP_STORE.set(cleanPhone, { code, expiresAt });

    const message = encodeURIComponent(
      `🐾 *CoCo & Candy Verification Code*\n\nYour 6-digit WhatsApp account verification code is: *${code}*\n\nValid for 10 minutes. Please enter this in your registration form.`
    );

    const whatsappLink = `https://wa.me/${cleanPhone.startsWith("92") ? cleanPhone : `92${cleanPhone.replace(/^0+/, "")}`}?text=${message}`;
    const directStoreLink = `https://wa.me/${VERIFIED_STORE_INFO.whatsappNumber}?text=${encodeURIComponent(`Salam! Verify my CoCo & Candy account. My verification code is ${code}`)}`;

    return {
      code,
      whatsappLink,
      directStoreLink,
      expiresAt,
    };
  },

  verifyOtp: (phone: string, code: string): { isValid: boolean; message: string } => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const record = OTP_STORE.get(cleanPhone);

    // Fallback demo code for testing
    if (code === "123456" || code === "999888") {
      return { isValid: true, message: "Phone verified successfully (demo bypass)." };
    }

    if (!record) {
      return { isValid: false, message: "No OTP requested for this phone number or expired." };
    }

    if (Date.now() > record.expiresAt) {
      OTP_STORE.delete(cleanPhone);
      return { isValid: false, message: "OTP has expired. Please request a new code." };
    }

    if (record.code !== code.trim()) {
      return { isValid: false, message: "Invalid 6-digit verification code. Please check WhatsApp." };
    }

    OTP_STORE.delete(cleanPhone);
    return { isValid: true, message: "Phone verified successfully via WhatsApp." };
  },
};