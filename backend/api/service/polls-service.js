const db = require('../db');
const ApiError = require('../exceptions/api-error');

class PollsService {
  async getPoll(id_poll) {
    await db.query('BEGIN');

    const questionTypes = await db.query(
      `SELECT * FROM polls WHERE id_poll = $1`,
      [id_poll]
    );

    let row = questionTypes.rows[0];

    let pollObject = {
      id_poll: row.id_poll,
      name: row.name,
      comment: row.comment,
    };
    const newPoll = await db.query(`SELECT * FROM polls WHERE id_poll = $1`, [
      row.id_poll,
    ]);
    const poll_questions = await db.query(
      `SELECT * FROM poll_questions WHERE poll_id = $1`,
      [newPoll.rows[0].id_poll]
    );

    for (const question of poll_questions.rows) {
      pollObject = {
        questions: {
          poll_id: newPoll.rows[0].id_poll,
          question_title: question.question_title,
          question_type_id: question.question_type_id,
        },
      };

      const question_options = await db.query(
        `SELECT * FROM question_options WHERE question_id = $1`,
        [poll_questions.rows[0].id_question]
      );

      for (const options of question_options.rows) {
        pollObject = {
          questions: {
            options: {
              id_option: options.id_option,
              question_id: options.question_id,
              text: options.text,
            },
          },
        };
      }
    }
    await db.query('COMMIT');
    return pollObject;
  }

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

      for (const question of parsedData.questions) {
        questionTypesObject = {
          options: {},
        };
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

      questionTypesObjects.push(questionTypesObject);
    }
    await db.query('COMMIT');
    return questionTypesObjects;
  }

  async createPoll({ data, id_request }) {
    await db.query('BEGIN');

    const parsedData = JSON.parse(data);

    const newPoll = await db.query(
      `INSERT INTO polls(name, comment) VALUES ($1, $2) RETURNING *`,
      [parsedData.name, parsedData.comment]
    );

    if (id_request) {
      const updRequsets = await db.query(
        `UPDATE requests SET poll_id = $1 WHERE id_request = $2 RETURNING *;`,
        [newPoll.rows[0].poll_id, id_request]
      );
    }

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
