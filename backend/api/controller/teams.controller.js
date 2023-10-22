const teamsService = require('../service/teams-service');
const ApiError = require('../exceptions/api-error');
const db = require('../db');

class TeamController {
  async createTeam(req, res, next) {
    try {
      const createdTeam = await teamsService.createTeam(req.body);
      res.status(200).json(createdTeam);
    } catch (e) {
      await db.query('ROLLBACK');
      next(e);
    }
  }
}

module.exports = new TeamController();
