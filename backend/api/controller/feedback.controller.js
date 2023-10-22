const feedbackService = require('../service/feedback-service');
const ApiError = require('../exceptions/api-error');
const db = require('../db');

class FeedbackController {
  async createFeedback(req, res, next) {
    try {
      const createdFeedback = await feedbackService.createFeedback(req.body);
      res.status(200).json(createdFeedback);
    } catch (e) {
      await db.query('ROLLBACK');
      next(e);
    }
  }

  async addFeedbackDate(req, res, next) {
    try {
      const updateFeedback = await feedbackService.addFeedbackDate(req.body);
      res.status(200).json(updateFeedback);
    } catch (e) {
      await db.query('ROLLBACK');
      next(e);
    }
  }

  async enabledFeedbacks(req, res, next) {
    try {
      const feedbacks = await feedbackService.enabledFeedbacks(req.params);
      res.status(200).json(feedbacks);
    } catch (e) {
      await db.query('ROLLBACK');
      next(e);
    }
  }
}

module.exports = new FeedbackController();
