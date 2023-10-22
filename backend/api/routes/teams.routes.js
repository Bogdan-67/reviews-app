const Router = require('express');
const router = new Router();
const teamsController = require('../controller/teams.controller');

router.post('/team-create', teamsController.createTeam);
router.get('/teams', teamsController.getTeams);
router.post('/teams-give', teamsController.giveTeam);

module.exports = router;
