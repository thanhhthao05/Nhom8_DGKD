import { sendResetPasswordEmail } from "../../services/auth/forgotPassword.service.js";

export const forgotPassword = async (req, res) => {
  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const { error } = await sendResetPasswordEmail(email);
    if (error && !error.message?.includes("security") && !error.message?.includes("rate")) {
      console.warn("Forgot password warning:", error.message);
    }
    return res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};
