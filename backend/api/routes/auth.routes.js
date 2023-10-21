const Router = require("express");
const router = new Router();
const authController = require("../controller/auth.controller.js");
const { body } = require("express-validator");
const Recaptcha = require("express-recaptcha").RecaptchaV2;

// Создайте экземпляр Recaptcha, передавая секретный и публичный ключи
const recaptcha = new Recaptcha(
  process.env.RECAPTCHA_SITE_KEY,
  process.env.RECAPTCHA_SECRET_KEY,
);

router.post(
  "/registration",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 4, max: 32 }),
    recaptcha.middleware.verify, // Добавьте middleware проверки капчи
  ],
  authController.createUser,
);

router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get("/refresh", authController.refreshToken);

module.exports = router;
