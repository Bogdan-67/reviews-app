const db = require('../db');
const UserDTO = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class RoleService {
  async getRoles(req, res) {
    const roles = await db.query(`SELECT * FROM roles`);
    return roles.rows;
  }

  async giveRole({ id_role, users }) {
    if (!id_role) {
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
        `INSERT INTO user_roles(role_id, account_id) VALUES ($1, $2) RETURNING *`,
        [id_role, account.rows[0].id_account]
      );
    });

    await Promise.all(promises);

    return 'Роли успешно выданы';
  }

  async removeRole({ id_role, users }) {
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
        [id_role, account.rows[0].id_account]
      );
    });

    await Promise.all(promises);

    return 'Роли успешно отозваны';
  }
}

module.exports = new RoleService();
