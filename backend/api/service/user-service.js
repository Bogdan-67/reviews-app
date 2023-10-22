const db = require('../db');
const ApiError = require('../exceptions/api-error');

class UserService {
  async getUsers() {
    await db.query('BEGIN');

    const users = await db.query(`SELECT * FROM users`);

    const usersRows = users.rows;
    const usersObjects = [];

    for (const row of usersRows) {
      const user_roles = await db.query(
        `SELECT user_roles.*
      FROM user_roles
      INNER JOIN accounts ON user_roles.account_id = accounts.id_account
      WHERE accounts.user_id = $1;
      `,
        [row.id_user]
      );

      const userRolesObjects = [];

      for (const row of user_roles.rows) {
        const roleName = await db.query(
          `SELECT role_name FROM roles WHERE id_role = $1;
          `,
          [row.role_id]
        );
        userRolesObjects.push({
          role_id: row.role_id,
          role_name: roleName.rows[0].role_name,
        });
      }

      const usersObject = {
        id_user: row.id_user,
        firstname: row.firstname,
        lastname: row.lastname,
        middlename: row.middlename,
        phone: row.phone,
        email: row.email,
        rating: row.rating,
        roles: userRolesObjects,
      };

      usersObjects.push(usersObject);
    }
    await db.query('COMMIT');
    return usersObjects;
  }

  async getUser(id_user) {
    await db.query('BEGIN');
    console.log(id_user);

    const user = await db.query(`SELECT * FROM users WHERE id_user = $1`, [
      id_user,
    ]);

    await db.query('COMMIT');

    return {
      id_user: id_user,
      fio: [
        user.rows[0].firstname,
        user.rows[0].lastname,
        user.rows[0].middlename,
      ].join(' '),
    };
  }
}

module.exports = new UserService();
