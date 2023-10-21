const { json } = require('express');
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

  async createPoll(data) {
    await db.query('BEGIN');

    const parsedData = JSON.parse(data);

    const newPoll = await db.query(
      `INSERT INTO polls(name, comment) VALUES ($1, $2) RETURNING *`,
      [parsedData.name, parsedData.comment]
    );

    const newPollQuestions = await db.query(
      `INSERT INTO poll_questions(poll_id, question_title, question_type_id) VALUES ($1, $2, $3) RETURNING *`,
      [
        newPoll.rows[0].id_poll,
        parsedData.questions.question_title,
        parsedData.questions.question_type_id,
      ]
    );

    const newQuestionOptions = await db.query(
      `INSERT INTO question_options(question_id, text) VALUES ($1, $2) RETURNING *`,
      [newPollQuestions.rows[0].id_question, parsedData.questions.options.text]
    );

    await db.query('COMMIT');

    return 'Опрос успешно сохранен';

    // const questionTypes = await db.query(`SELECT * FROM question_types`);

    // const questionTypesRows = questionTypes.rows;
    // const questionTypesObjects = [];

    // for (const row of questionTypesRows) {
    //   const questionTypesObject = {
    //     id_question_type: row.id_question_type,
    //     type_name: row.type_name,
    //   };

    //   questionTypesObjects.push(questionTypesObject);
    // }
    // await db.query('COMMIT');
    // return questionTypesObjects;
  }
}

module.exports = new PollsService();
