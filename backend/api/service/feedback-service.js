const db = require('../db');
const ApiError = require('../exceptions/api-error');

class FeedbackService {
  // id_author - число, id_interns - массив, poll_id -число, request_id - число, text -стринг
  async createFeedback({
    id_author,
    id_interns,
    poll_id,
    request_id = null,
    text = null,
  }) {
    await db.query('BEGIN');
    console.log('poll_id', poll_id);
    console.log('id_request', request_id);

    const poll = await db.query(`SELECT * FROM polls WHERE id_poll = $1`, [
      poll_id,
    ]);

    const author = await db.query(`SELECT * FROM users WHERE id_user = $1`, [
      id_author,
    ]);

    const intern = await db.query(`SELECT * FROM users WHERE id_user = $1`, [
      id_intern,
    ]);

    const request = await db.query(
      `SELECT * FROM requests WHERE id_request = $1`,
      [request_id]
    );

    const user_teams = await db.query(
      `SELECT * FROM user_teams WHERE user_id = $1`,
      [id_intern]
    );

    for (const id_team of user_teams.rows) {
      const teams = await db.query(
        `SELECT * FROM user_teams WHERE team_id = $1`,
        [id_team['team_id']]
      );
      for (const teamp of teams.rows) {
        console.log(teamp.user_id);
        if (teamp.user_id != id_intern) {
          const respondent = await db.query(
            `SELECT * FROM users WHERE id_user = $1`,
            [teamp.user_id]
          );

          const newFeedback = await db.query(
            `INSERT INTO feedback(author_id, respondent_id, intern_id, poll_id, request_id, feedback_text, status_request_id) VALUES ($1, $2, $3, $4, $5, $6, 1) RETURNING *`,
            [
              author.rows[0].id_user,
              respondent.rows[0].id_user,
              intern.rows[0].id_user,
              poll.rows[0].id_poll,
              request.rows[0] && request.rows[0].id_request
                ? request.rows[0].id_request
                : null,
              text,
            ]
          );
        }
      }
    }

    await db.query('COMMIT');

    return 'Респонденты успешно назначены';
  }

  async getRespondents(intern_id) {
    await db.query('BEGIN');

    const feedbacks = await db.query(
      `SELECT * FROM feedback WHERE intern_id = $1`,
      [intern_id]
    );
    console.log(feedbacks.rows);
    const respondents = [];

    for (const feedback of feedbacks.rows) {
      respondents.push(feedback.respondent_id);
    }

    await db.query('COMMIT');

    return { [intern_id]: respondents };
  }

  async addFeedbackDate({ feedback_date, id_feedback }) {
    await db.query('BEGIN');

    const feedbackDate = await db.query(
      `UPDATE feedback SET feedback_date = $1 WHERE id_feedback = $2;
    `,
      [feedback_date, id_feedback]
    );

    await db.query('COMMIT');

    return 'Дата успешно обновлена';
  }

  async enabledFeedbacks({ id_user }) {
    const feedbacks = await db.query(
      `SELECT * FROM feedback WHERE respondent_id = $1 AND status_request_id = 1`,
      [id_user]
    );

    return feedbacks.rows;
  }
}

module.exports = new FeedbackService();
