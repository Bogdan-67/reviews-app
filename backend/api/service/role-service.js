const db = require('../db');
const UserDTO = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class RoleService {
  async getRoles(req, res) {
    const roles = await db.query(`SELECT * FROM roles`);
    return roles.rows;
  }

  async giveRole({ role_id, users }) {
    if (!role_id) {
      throw ApiError.BadRequest('Не выбрана роль!');
    }
    if (!Array.isArray(users)) {
      throw ApiError.BadRequest('users не является массивом!');
    }
    if (users.length === 0) {
      throw ApiError.BadRequest('Не выбрано ни одного пользователя!');
    }
    const promises = users.map(async (user) => {
      const account = await db.query(
        `SELECT * FROM accounts WHERE user_id = $1`,
        [user]
      );
      await db.query(
        `INSERT user_roles(role_id, account_id) VALUES ($1, $2) RETURNING *`,
        [role_id, account.rows[0].id_account]
      );
    });

    await Promise.all(promises);

    return 'Роли успешно выданы';
  }

  async removeRole({ role_id, users }) {
    if (!Array.isArray(users)) {
      throw ApiError.BadRequest('users не является массивом!');
    }
    if (users.length === 0) {
      throw ApiError.BadRequest('Не выбрано ни одного пользователя!');
    }

    const promises = users.map(async (user) => {
      const account = await db.query(
        `SELECT * FROM accounts WHERE user_id = $1`,
        [user]
      );
      await db.query(
        `DELETE FROM user_roles WHERE role_id = $1 AND account_id = $2`,
        [role_id, account.rows[0].id_account]
      );
    });

    await Promise.all(promises);

    return 'Роли успешно отозваны';
  }
}

module.exports = new RoleService();
