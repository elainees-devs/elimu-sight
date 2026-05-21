import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import { AuthService } from "../services/auth.service";
import { logAudit } from "@utils/index";

export class AuthController {
  private authService = new AuthService();

  // ===============================
  // LOGIN LOGIC
  // ===============================
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await this.authService.loginUser(email, password);

      await logAudit({
        action: "USER_LOGIN",
        resource: "auth",
        userId: result.user.id,
        schoolId: result.user.school_id,
        details: { email },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      logAudit({
        action: "LOGIN_FAILED",
        resource: "auth",
        details: { email: req.body?.email },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      }).catch(() => {});
      return next(error);
    }
  }

  // ===============================
  // REGISTER LOGIC
  // ===============================
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authService.registerUser(req.body);

      await logAudit({
        action: "USER_REGISTERED",
        resource: "users",
        resourceId: result.id,
        schoolId: result.school_id,
        details: { email: result.email, role: result.role },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===============================
  // REFRESH TOKEN
  // ===============================
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token required",
        });
      }

      const result = await this.authService.refreshAccessToken(refreshToken);

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===============================
  // LOGOUT
  // ===============================
  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      await this.authService.logoutUser(userId);

      await logAudit({
        action: "USER_LOGOUT",
        resource: "auth",
        userId,
        schoolId: req.user!.schoolId,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===============================
  // GET CURRENT USER
  // ===============================
  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const user = await this.authService.getCurrentUser(userId);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  }
}