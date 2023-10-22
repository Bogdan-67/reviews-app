const Router = require('express');
const router = new Router();
const requestsController = require('../controller/requests.controller.js');

router.post('/request', requestsController.createRequest);
router.post('/udp-status-req', requestsController.updStatusReq);
router.get('/requests/:author', requestsController.getRequest);
router.get('/request-types', requestsController.getRequestTypes);

module.exports = router;
