const db = require("../db");
const UserDTO = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");
const tokenService = require("./token-service");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const uuid = require("uuid");
const path = require("path");
const sharp = require("sharp");

class AuthService {
  async createUser({ firstname, lastname, middlename, email, phone }) {
    const checkPhone = await db.query(`SELECT * FROM users WHERE phone = $1`, [
      phone,
    ]);
    if (checkPhone.rows[0]) {
      throw ApiError.BadRequest(
        "Пользователь с таким номером телефона уже зарегистрирован!"
      );
    }
    const checkEmail = await db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    if (checkEmail.rows[0]) {
      throw ApiError.BadRequest(
        "Пользователь с такой почтой уже зарегистрирован!"
      );
    }
    const checkLogin = await db.query(
      `SELECT * FROM accounts WHERE login = $1`,
      [email]
    );
    if (checkLogin.rows[0]) {
      throw ApiError.BadRequest(
        "Пользователь с таким логином уже зарегистрирован!"
      );
    }
    const newUser = await db.query(
      `INSERT INTO users(firstname, lastname, middlename, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [firstname, lastname, middlename, phone, email]
    );
    const hashPassword = await bcrypt.hash(password, 3);
    const newAccount = await db.query(
      `INSERT INTO accounts(login, password, id_user) VALUES ($1, $2, $3) RETURNING *`,
      [email, hashPassword, newUser.rows[0].id_user]
    );
    const newUserRole = await db.query(
      `INSERT INTO user_roles(account_id, role_id)
      VALUES ($1, (SELECT role_name FROM roles WHERE id_role = 1))
      RETURNING *`,
      [newAccount.rows[0].id_account]
    );
    // const role = await db.query(`SELECT * FROM roles WHERE id_role = $1`, [
    //   newAccount.rows[0].role_id,
    // ]);
    const userDto = new UserDTO({
      ...newAccount.rows[0],
      ...newUserRole.rows[0].roles,
      ...newUser.rows[0],
    });
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(
      newAccount.rows[0].id_account,
      tokens.refreshToken
    );
    return { user: { ...userDto }, ...tokens };
  }

  async login(login, password) {
    const account = await db.query(`SELECT * FROM accounts WHERE login = $1`, [
      login,
    ]);
    if (!account.rows[0]) {
      throw ApiError.BadRequest("Пользователь с таким логином не найден!");
    }
    const isPassEquals = await bcrypt.compare(
      password,
      account.rows[0].password
    );
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль!");
    }
    // const role_id = await db.query(
    //   `SELECT role_id from user_roles where id_account = $1 `,
    //   [account.rows[0].id_account],
    // );
    const roles = await db.query(
      `SELECT roles.role_name
    FROM account
    INNER JOIN user_roles ON account.id_account = user_roles.account_id
    INNER JOIN roles ON user_roles.role_id = roles.id_role
    WHERE account.id_account = $1`,
      [account.rows[0].id_account]
    );
    // const roles = await db.query(`SELECT * from roles where id_role = $1 `, [
    //   role_id,
    // ]);
    console.log("roles:", roles);
    const user = await db.query("SELECT * FROM users WHERE id_user = $1", [
      account.rows[0].id_user,
    ]);

    const userDto = new UserDTO({ ...roles.rows[0], ...user.rows[0] });
    console.log("userDto: ", userDto);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id_user, tokens.refreshToken);
    return { ...tokens, user: { ...userDto } };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorisedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);

    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb || !userData.id_account) {
      throw ApiError.UnauthorisedError();
    }
    const account = await db.query(
      `SELECT * FROM accounts WHERE id_account = $1`,
      [userData.id_account]
    );
    const user = await db.query("SELECT * FROM users WHERE id_user = $1", [
      userData.id_user,
    ]);
    if (!user.rows[0]) {
      throw ApiError.BadRequest("Пользователь не найден!");
    }
    const userRole = await db.query(`SELECT * FROM roles WHERE id_role = $1`, [
      account.rows[0].role_id,
    ]);

    const userDto = new UserDTO({
      ...account.rows[0],
      ...user.rows[0],
      ...userRole.rows[0],
    });

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id_account, tokens.refreshToken);
    return { ...tokens, user: { ...userDto } };
  }
}

module.exports = new AuthService();
