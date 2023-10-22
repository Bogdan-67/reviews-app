const Router = require('express');
const router = new Router();
const roleController = require('../controller/role.controller');
const checkRole = require('../middlewares/check-role-middleware');

router.get('/roles', roleController.getRoles);
router.post('/roles', checkRole('Руководитель'), roleController.giveRole);
router.post(
  '/remove-roles',
  checkRole('Руководитель'),
  roleController.removeRole
);

module.exports = router;
