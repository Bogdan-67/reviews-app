const pollsService = require('../service/polls-service');
const ApiError = require('../exceptions/api-error');
const db = require('../db');

class PollsController {
  async getQuestionTypes(req, res, next) {
    try {
      const gotQuestionTypes = await pollsService.getQuestionTypes();
      res.status(200).json(gotQuestionTypes);
    } catch (e) {
      await db.query('ROLLBACK');
      next(e);
    }
  }

  async getPoll(req, res, next) {
    try {
      const id_poll = req.params.id_poll;
      const poll = await pollsService.getPoll(id_poll);
      res.status(200).json(poll);
    } catch (e) {
      await db.query('ROLLBACK');
      next(e);
    }
  }

  async createPoll(req, res, next) {
    try {
      const poll = await pollsService.createPoll(req.body);
      res.status(200).json(poll);
    } catch (e) {
      await db.query('ROLLBACK');
      next(e);
    }
  }
}

module.exports = new PollsController();
