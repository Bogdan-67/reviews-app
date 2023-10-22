const db = require('../db');
const ApiError = require('../exceptions/api-error');
const UserDTO = require('../dtos/user-dto');

class TeamService {
  async createTeam({ team_name, users }) {
    await db.query('BEGIN');
    const newTeam = await db.query(
      `INSERT INTO teams(team_name, status_team_id) VALUES ($1, 2) RETURNING *`,
      [team_name],
    );
    console.log(newTeam);
    users = JSON.parse(users);
    for (const user of users) {
      const addUserTeam = await db.query(
        `INSERT INTO user_teams(team_id, user_id) VALUES ($1, $2) RETURNING *`,
        [newTeam.rows[0].id_team, user],
      );
    }

    await db.query('COMMIT');

    return 'Группа успешно сформированна';
  }
  async getTeams(req, res) {
    const teams = await db.query(`SELECT * FROM teams`);
    const info = teams.rows;
    console.log('Меньше', info);
    const map = teams.rows.map((obj) => obj.team_name);
    console.log('Больше', map);

    return info;
  }
  async giveTeams(users, id_team) {
    users = JSON.parse(users);
    console.log(users);
    for (const user of users) {
      const addUserTeam = await db.query(
        `INSERT INTO user_teams(team_id, user_id) VALUES ($1, $2) RETURNING *`,
        [id_team, user],
      );
    }
    return 'Сотрудники успешно добавлены в группу';
  }
  // async removeTeam(users) {
  //   if (!Array.isArray(users)) {
  //     throw ApiError.BadRequest('users не является массивом!');
  //   }
  //   if (users.length === 0) {
  //     throw ApiError.BadRequest('Не введено ни одного игрока!');
  //   }
  //
  //   const updUsers = [];
  //   const promises = users.map(async (user) => {
  //     const userId = user.id_user; // Получаем ID пользователя
  //     const teamId = user.team_id; // Получаем ID команды, которую нужно удалить
  //
  //     // Удалить связь между пользователем и командой
  //     await db.query(`DELETE FROM user_teams WHERE user_id=$1 AND team_id=$2`, [
  //       userId,
  //       teamId,
  //     ]);
  //
  //     // Ваш остальной код для обновления пользователя
  //     // ...
  //
  //     updUsers.push(/* добавьте пользователя в массив updUsers */);
  //   });
  //
  //   await Promise.all(promises);
  //
  //   return updUsers;
  // }
}

module.exports = new TeamService();
