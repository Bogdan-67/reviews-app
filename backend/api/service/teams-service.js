const db = require('../db');
const ApiError = require('../exceptions/api-error');

class TeamService {
  async createTeam({ team_name }, users) {
    await db.query('BEGIN');

    const newTeam = await db.query(
      `INSERT INTO teams(team_name, status_team_id) VALUES ($1, 2) RETURNING *`,
      [team_name]
    );

    users = JSON.parse(users);

    for (const user of users) {
      const addUserTeam = await db.query(
        `INSERT INTO user_teams(team_id, user_id) VALUES ($1, $2) RETURNING *`,
        [newTeam.rows[0].id_team, user]
      );
    }

    await db.query('COMMIT');

    return 'Группа успешно сформированна';
  }
}

module.exports = new TeamService();
