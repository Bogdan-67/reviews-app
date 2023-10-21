const authService = require("../service/auth-service");
const ApiError = require("../exceptions/api-error");
const { validationResult } = require("express-validator");
class AuthController {
  async createUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка при валидации", errors.array()),
        );
      }

      // Проверка результата капчи
      if (!req.body["g-recaptcha-response"]) {
        return next(ApiError.BadRequest("Необходимо пройти капчу"));
      }

      const createdUser = await authService.createUser(req.body);
      res.cookie("refreshToken", createdUser.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(200).json(createdUser);
    } catch (e) {
      next(e);
    }
  }

  async loginUser(req, res, next) {
    try {
      const { login, password } = req.body;
      const userData = await authService.login(login, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(200).json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logoutUser(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await authService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(200).json(userData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthController();
