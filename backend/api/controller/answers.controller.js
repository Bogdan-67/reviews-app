const answersService = require('../service/answers-service');
const ApiError = require('../exceptions/api-error');
const db = require('../db');

class AnswersController {
  async addAnswer(req, res, next) {
    try {
      const updateAnswer = await answersService.addAnswer();
      res.status(200).json(updateAnswer);
    } catch (e) {
      await db.query('ROLLBACK');
      next(e);
    }
  }
}

module.exports = new AnswersController();
