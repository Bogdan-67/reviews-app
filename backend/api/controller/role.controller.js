const RoleService = require('../service/role-service.js');
const ApiError = require('../exceptions/api-error');

class RoleController {
  async getRoles(req, res, next) {
    try {
      const roles = await RoleService.getRoles();
      res.status(200).json(roles);
    } catch (e) {
      next(e);
    }
  }

  async giveRole(req, res, next) {
    try {
      const updRoles = await RoleService.giveRole(req.body);
      res.status(200).json(updRoles);
    } catch (e) {
      next(e);
    }
  }

  async removeRole(req, res, next) {
    try {
      const updRoles = await RoleService.removeRole(rew.body);
      res.status(200).json(updRoles);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new RoleController();
