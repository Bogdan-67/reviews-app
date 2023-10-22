const userService = require('../service/user-service');
const ApiError = require('../exceptions/api-error');
const db = require('../db');

class UserController {
  async getUsers(req, res, next) {
    try {
      const gotUsers = await userService.getUsers();
      res.status(200).json(gotUsers);
    } catch (e) {
      await db.query('ROLLBACK');
      next(e);
    }
  }

  async getUser(req, res, next) {
    try {
      const user = req.params.user;
      const gotUser = await userService.getUser(user);
      res.status(200).json(gotUser);
    } catch (e) {
      await db.query('ROLLBACK');
      next(e);
    }
  }
  async addRelations(req, res, next) {
    try {
      const newRelations = await userService.addRelations(req.body);
      res.status(200).json(newRelations);
    } catch (e) {
      await db.query('ROLLBACK');
      next(e);
    }
  }
}

module.exports = new UserController();
