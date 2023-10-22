const db = require('../db');
const ApiError = require('../exceptions/api-error');

class FeedbackService {
  // id_author - число, id_interns - массив, poll_id -число, request_id - число, text -стринг
  async createFeedback({ id_author, id_interns, poll_id, request_id, text }) {
    await db.query('BEGIN');

    const parsedData = JSON.parse(id_interns);

    const author = await db.query(`SELECT * FROM users WHERE id_user = $1`, [
      id_author,
    ]);

    const poll = await db.query(`SELECT * FROM polls WHERE id_poll = $1`, [
      poll_id,
    ]);

    const request = await db.query(
      `SELECT * FROM requests WHERE id_request = $1`,
      [request_id]
    );

    for (const id_intern of parsedData) {
      const intern = await db.query(`SELECT * FROM users WHERE id_user = $1`, [
        id_intern,
      ]);

      const newFeedback = await db.query(
        `INSERT INTO feedback(author_id, respondent_id, poll_id, request_id, feedback_text, status_request_id) VALUES ($1, $2, $3, $4, $5, 1) RETURNING *`,
        [
          author.rows[0].id_user,
          intern.rows[0].id_user,
          poll.rows[0].id_poll,
          request.rows[0].id_request,
          text,
        ]
      );
    }

    await db.query('COMMIT');

    return 'Респонденты успешно назначены';
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
}

module.exports = new FeedbackService();
