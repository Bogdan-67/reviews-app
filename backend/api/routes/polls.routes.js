const Router = require('express');
const router = new Router();
const pollsController = require('../controller/polls.controller.js');

router.get('/getPoll/:id_poll', pollsController.getPoll);
router.get('/question-types', pollsController.getQuestionTypes);
router.post('/create-poll', pollsController.createPoll);

module.exports = router;
