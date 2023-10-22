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
    await db.query('COMMIT');

    return 'Фидбек успешно сформирован';
  }
}

module.exports = new AnswerService();
