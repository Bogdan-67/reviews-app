const Router = require('express');
const router = new Router();
const feedbackController = require('../controller/feedback.controller.js');

router.post('/create-feedback', feedbackController.createFeedback);
router.post('/add-feedback-date', feedbackController.addFeedbackDate);
router.get('/enabled-feedbacks/:id_user', feedbackController.enabledFeedbacks);

module.exports = router;
