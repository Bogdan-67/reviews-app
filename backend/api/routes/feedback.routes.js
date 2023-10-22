const Router = require('express');
const router = new Router();
const feedbackController = require('../controller/feedback.controller.js');

router.post('/create-feedback', feedbackController.createFeedback);
router.post('/add-feedback-date', feedbackController.addFeedbackDate);

module.exports = router;
