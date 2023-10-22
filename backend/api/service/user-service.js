const db = require('../db');
const ApiError = require('../exceptions/api-error');
class UserService {
  async getUsers() {
    await db.query('BEGIN');

    const users = await db.query(`SELECT * FROM users`);
    const usersRows = users.rows;
    const usersObjects = [];

    for (const userRow of usersRows) {
      const user_roles = await db.query(
        `SELECT user_roles.*
      FROM user_roles
      INNER JOIN accounts ON user_roles.account_id = accounts.id_account
      WHERE accounts.user_id = $1;
      `,
        [userRow.id_user],
      );

      const userRolesObjects = [];

      for (const roleRow of user_roles.rows) {
        const roleName = await db.query(
          `SELECT role_name FROM roles WHERE id_role = $1;
        `,
          [roleRow.role_id],
        );
        userRolesObjects.push({
          role_id: roleRow.role_id,
          role_name: roleName.rows[0].role_name,
        });
      }

      // Дополнительный SQL-запрос для получения команд пользователя
      const userTeams = await db.query(
        `SELECT teams.team_name
      FROM teams
      INNER JOIN user_teams ON teams.id_team = user_teams.team_id
      WHERE user_teams.user_id = $1;
      `,
        [userRow.id_user],
      );

      const userTeamsArray = userTeams.rows.map((row) => row.team_name);

      const userObject = {
        id_user: userRow.id_user,
        firstname: userRow.firstname,
        lastname: userRow.lastname,
        middlename: userRow.middlename,
        phone: userRow.phone,
        email: userRow.email,
        rating: userRow.rating,
        roles: userRolesObjects,
        teams: userTeamsArray,
      };

      usersObjects.push(userObject);
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
