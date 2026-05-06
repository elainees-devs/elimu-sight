import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  private authService = new AuthService();

  // ===============================
  // LOGIN LOGIC
  // ===============================
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // =========================
      // EXTRACT PAYLOAD
      // =========================
      const { email, password } = req.body;

      // =========================
      // CALL SERVICE
      // =========================
      const result = await this.authService.loginUser(email, password);

      // =========================
      // RESPONSE
      // =========================
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===============================
  // REGISTER LOGIC
  // ===============================
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authService.registerUser(req.body);

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
  // GET CURRENT USER
  // ===============================
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;

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