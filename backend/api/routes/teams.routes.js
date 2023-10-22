const Router = require('express');
const router = new Router();
const teamsController = require('../controller/teams.controller.js');

router.post('/create-team', teamsController.createTeam);

module.exports = router;
