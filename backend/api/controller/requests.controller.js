const requestService = require('../service/requests-service');
const ApiError = require('../exceptions/api-error');
const db = require('../db');

class RequestController {
  async createRequest(req, res, next) {
    try {
      const createdRequest = await requestService.createRequest(req.body);
      res.status(200).json(createdRequest);
    } catch (e) {
      await db.query('ROLLBACK');
      next(e);
    }
  }

  async getRequest(req, res, next) {
    try {
      const author = req.params.author;
      const gotRequest = await requestService.getRequest(author);
      res.status(200).json(gotRequest);
    } catch (e) {
      await db.query('ROLLBACK');
      next(e);
    }
  }

  async getRequests(req, res, next) {
    try {
      const requests = await requestService.getRequests(req.query);
      res.status(200).json(requests);
    } catch (e) {
      await db.query('ROLLBACK');
      next(e);
    }
  }
}

module.exports = new RequestController();
