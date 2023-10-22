const db = require('../db');
const ApiError = require('../exceptions/api-error');

class UserService {
  async getUsers() {
    await db.query('BEGIN');

    const users = await db.query(`SELECT * FROM users`);

    const usersRows = users.rows;
    const usersObjects = [];

    for (const row of usersRows) {
      const usersObject = {
        id_user: row.id_user,
        firstname: row.firstname,
        lastname: row.lastname,
        middlename: row.middlename,
        phone: row.phone,
        email: row.email,
        rating: row.rating,
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
