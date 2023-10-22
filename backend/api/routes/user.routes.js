const Router = require('express');
const router = new Router();
const userController = require('../controller/user.controller.js');

router.post('/relations-add', userController.addRelations);
router.get('/users', userController.getUsers);
router.get('/user/:user', userController.getUser);

module.exports = router;
