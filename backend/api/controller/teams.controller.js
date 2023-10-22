const TeamService = require('../service/teams-service');
const ApiError = require('../exceptions/api-error');
const db = require('../db');
const RoleService = require('../service/role-service');

class TeamController {
  async createTeam(req, res, next) {
    try {
      console.log(req.body);
      const createdTeam = await TeamService.createTeam(req.body);
      res.status(200).json(createdTeam);
    } catch (e) {
      await db.query('ROLLBACK');
      next(e);
    }
  }
  async getTeams(req, res, next) {
    try {
      const teams = await TeamService.getTeams();
      res.status(200).json(teams);
    } catch (e) {
      next(e);
    }
  }
  async giveTeam(req, res, next) {
    //todo добавить
    try {
      const { id_team, users } = req.body;
      const updRoles = await TeamService.giveTeams(users, id_team);
      res.status(200).json(updRoles);
    } catch (e) {
      next(e);
    }
  }

  // async removeTeam(req, res, next) {
  //   try {
  //     const { users } = req.body;
  //     const updTeams = await TeamService(users);
  //     res.status(200).json(updTeams);
  //   } catch (e) {
  //     next(e);
  //   }
  // }
}

module.exports = new TeamController();
