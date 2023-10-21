const Router = require('express');
const router = new Router();
const requestsController = require('../controller/requests.controller.js');

router.post('/request', requestsController.createRequest);
router.get('/requests/:author', requestsController.getRequest);

module.exports = router;