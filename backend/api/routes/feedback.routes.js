const Router = require('express');
const router = new Router();
const feedbackController = require('../controller/feedback.controller.js');

router.post('/create-feedback', feedbackController.createFeedback);
router.post('/add-feedback-date', feedbackController.addFeedbackDate);
router.get('/get-respondent/:intern_id', feedbackController.getRespondents);

module.exports = router;
