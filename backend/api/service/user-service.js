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
        [userRow.id_user]
      );

      const userRolesObjects = [];

      for (const roleRow of user_roles.rows) {
        const roleName = await db.query(
          `SELECT role_name FROM roles WHERE id_role = $1;
        `,
          [roleRow.role_id]
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
        [userRow.id_user]
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

  async addRelations({ curator_id, intern_id }) {
    await db.query('BEGIN');

    const curator = await db.query(`SELECT * FROM users WHERE id_user = $1`, [
      curator_id,
    ]);
    const intern = await db.query(`SELECT * FROM users WHERE id_user = $1`, [
      intern_id,
    ]);

    const addRelations = await db.query(
      `INSERT INTO relations(curator_id, user_id) VALUES ($1, $2) RETURNING *`,
      [curator.rows[0].id_user, intern.rows[0].id_user]
    );
    await db.query('COMMIT');
    return 'Связь успешно добавлена';
  }

  async getUserOnRules({ id_role }) {
    await db.query('BEGIN');

    const roles = await db.query(`SELECT * FROM roles WHERE id_role = $1`, [
      id_role,
    ]);

    const user_roles = await db.query(
      `SELECT * FROM user_roles WHERE role_id = $1`,
      [roles.rows[0].id_role]
    );

    if (!user_roles.rows[0]) {
      return 'Пользователи не найдены';
    }

    const accounts = await db.query(
      `SELECT * FROM accounts WHERE id_account = $1`,
      [user_roles.rows[0].account_id]
    );

    const users = await db.query(`SELECT * FROM users WHERE id_user = $1`, [
      accounts.rows[0].user_id,
    ]);

    const usersObjects = [];

    for (const userRow of users.rows) {
      usersObjects.push({
        user_id: userRow.id_user,
        role_name:
          userRow.firstname + ' ' + userRow.lastname + ' ' + userRow.middlename,
      });
    }

    await db.query('COMMIT');
    return usersObjects;
  }
}

module.exports = new UserService();
