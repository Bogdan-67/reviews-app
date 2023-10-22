const Router = require('express');
const router = new Router();
const answerController = require('../controller/answers.controller.js');

router.post('/add-answer', answerController.addAnswer);
// router.post('/create-poll', answerController.createPoll);

module.exports = router;
