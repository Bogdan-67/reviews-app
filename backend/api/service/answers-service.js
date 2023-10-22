const db = require('../db');
const ApiError = require('../exceptions/api-error');

class AnswerService {
  // формат даты ключ как айди вопрса массив как выборы пользователя текст как собственный ответ'{"1":[1,4],"2":[2],"3":[3,5],"4":"text"}'
  async addAnswer({ answers }, feedback_id) {
    await db.query('BEGIN');

    parseData = JSON.parse(answers);

    for (const question in parseData) {
      if (Array.isArray(parseData[question])) {
        for (const option in parseData[question]) {
          const newAnswers = await db.query(
            `INSERT INTO queston_answers(feedback_id, question_id, option_id) VALUES ($1, $2, $3) RETURNING *`,
            [feedback_id, question, option]
          );
        }
      } else {
        const newAnswers = await db.query(
          `INSERT INTO queston_answers(feedback_id, question_id, text) VALUES ($1, $2, $3) RETURNING *`,
          [feedback_id, question, option]
        );
      }
    }

    // const parsedData = JSON.parse(answers1);

    // for (const id_intern of parsedData) {
    //   const intern = await db.query(`SELECT * FROM users WHERE id_user = $1`, [
    //     id_intern,
    //   ]);

    //   const newFeedback = await db.query(
    //     `INSERT INTO feedback(author_id, respondent_id, poll_id, request_id, feedback_text, status_request_id) VALUES ($1, $2, $3, $4, $5, 1) RETURNING *`,
    //     [
    //       author.rows[0].id_user,
    //       intern.rows[0].id_user,
    //       poll.rows[0].id_poll,
    //       request.rows[0].id_request,
    //       text,
    //     ]
    //   );
    // }

    // const author = await db.query(`SELECT * FROM users WHERE id_user = $1`, [
    //   id_author,
    // ]);

    // const poll = await db.query(`SELECT * FROM polls WHERE id_poll = $1`, [
    //   poll_id,
    // ]);

    // const request = await db.query(
    //   `SELECT * FROM requests WHERE id_request = $1`,
    //   [request_id]
    // );

    // for (const id_intern of parsedData) {
    //   const intern = await db.query(`SELECT * FROM users WHERE id_user = $1`, [
    //     id_intern,
    //   ]);

    //   const newFeedback = await db.query(
    //     `INSERT INTO feedback(author_id, respondent_id, poll_id, request_id, feedback_text, status_request_id) VALUES ($1, $2, $3, $4, $5, 1) RETURNING *`,
    //     [
    //       author.rows[0].id_user,
    //       intern.rows[0].id_user,
    //       poll.rows[0].id_poll,
    //       request.rows[0].id_request,
    //       text,
    //     ]
    //   );
    // }

    await db.query('COMMIT');

    return 'Фидбек успешно сформирован';
  }
}

module.exports = new AnswerService();
