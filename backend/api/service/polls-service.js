const db = require('../db');
const ApiError = require('../exceptions/api-error');

class PollsService {
  async getQuestionTypes() {
    await db.query('BEGIN');

    const questionTypes = await db.query(`SELECT * FROM question_types`);

    const questionTypesRows = questionTypes.rows;
    const questionTypesObjects = [];

    for (const row of questionTypesRows) {
      const questionTypesObject = {
        id_question_type: row.id_question_type,
        type_name: row.type_name,
      };

      questionTypesObjects.push(questionTypesObject);
    }
    await db.query('COMMIT');
    return questionTypesObjects;
  }

  async createPoll({ data }) {
    await db.query('BEGIN');

    const parsedData = JSON.parse(data);

    const newPoll = await db.query(
      `INSERT INTO polls(name, comment) VALUES ($1, $2) RETURNING *`,
      [parsedData.name, parsedData.comment]
    );

    const promises = [];
    for (const question of parsedData.questions) {
      const newPollQuestions = await db.query(
        `INSERT INTO poll_questions(poll_id, question_title, question_type_id) VALUES ($1, $2, $3) RETURNING *`,
        [
          newPoll.rows[0].id_poll,
          question.question_title,
          question.question_type_id,
        ]
      );
      if (question.question_type_id != 3) {
        for (const option of question.options) {
          const newQuestionOptions = await db.query(
            `INSERT INTO question_options(question_id, text) VALUES ($1, $2) RETURNING *`,
            [newPollQuestions.rows[0].id_question, option.text]
          );
        }
      }
    }

    await Promise.all(promises);

    await db.query('COMMIT');

    return 'Опрос успешно сохранен';
  }
}

module.exports = new PollsService();
