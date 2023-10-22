const db = require('../db');
const RequestDTO = require('../dtos/request-dto');
const ApiError = require('../exceptions/api-error');

class RequestService {
  async createRequest({ author_id, interns_id, type_request_id }) {
    await db.query('BEGIN');
    const author = await db.query(`SELECT * FROM users WHERE id_user = $1`, [
      author_id,
    ]);

    const response = [];
    interns_id = JSON.parse(interns_id);
    for (const intern_id of interns_id) {
      const intern = await db.query(`SELECT * FROM users WHERE id_user = $1`, [
        intern_id,
      ]);
      const newRequest = await db.query(
        `INSERT INTO requests(author_id, intern_id, type_request_id, status_request_id) VALUES ($1, $2, $3, 5) RETURNING *`,
        [author.rows[0].id_user, intern.rows[0].id_user, type_request_id]
      );
      response.push(intern.rows[0].firstname);
    }

    await db.query('COMMIT');
    return response;
  }

  async getRequest(author_id) {
    await db.query('BEGIN');

    const request = await db.query(
      `SELECT 
      id_request,
      created_at,
      updated_at,
      intern_id,
      type_request_id,
      status_request_id,
      sr.name,
      athr.firstname as authorFirstname,
      athr.lastname as authorLastname,
      athr.middlename as authorMiddlename,
      intern.firstname as internFirstname,
      intern.lastname as internLastname,
      intern.middlename as internMiddlename,
      author_id,
      curator_id
      FROM requests r 
      LEFT JOIN status_request sr ON r.status_request_id=sr.id_status_request
      LEFT JOIN users athr ON r.author_id = athr.id_user
      LEFT JOIN users intern ON r.intern_id = intern.id_user
      LEFT JOIN relations rl ON r.intern_id = rl.user_id 
      WHERE author_id = $1 OR curator_id = $1`,
      [author_id]
    );

    const requestRows = request.rows;
    const requestObjects = [];

    for (const row of requestRows) {
      const requestObject = {
        id_request: row.id_request,
        created_at: row.created_at,
        updated_at: row.updated_at,
        intern_id: row.intern_id,
        author_id: row.author_id,
        status_request_id: row.status_request_id,
        type_request_id: row.type_request_id,
        poll_id: row.poll_id,
      };

      console.log(row);

      const requestDto = new RequestDTO(row);

      requestObjects.push(requestDto);
    }
    await db.query('COMMIT');
    return requestObjects;
  }

  //Работа с типами запросов (О стажерах, о сотрудниках)
  async getTypes() {
    const types = await db.query(
      `SELECT id_type_request,name FROM type_requests`
    );
    return types.rows;
  }

  async getRequests({ user_id, type_request_id }) {
    if (!user_id && !type_request_id) {
      const requests = await db.query(
        `
      SELECT * 
      FROM requests r
      LEFT JOIN status_request sr ON r.status_request_id=sr.id_status_request
      LEFT JOIN users athr ON r.author_id = athr.id_user
      LEFT JOIN relations rl ON r.intern_id = rl.user_id`,
        []
      );

      return requests.rows;
    } else {
      const requests = await db.query(
        `
    SELECT * 
    FROM requests r
    LEFT JOIN status_request sr ON r.status_request_id=sr.id_status_request
    LEFT JOIN users athr ON r.author = athr.id_user
    LEFT JOIN relations rl ON r.intern_id = rl.intern_id
    WHERE rl.curator_id = $1 AND r.type_request_id = $2`,
        [user_id, type_request_id]
      );

      return requests.rows;
    }
  }

  async updStatusReq({ id_status_request, id_request }) {
    await db.query('BEGIN');
    const status_request = await db.query(
      `SELECT * FROM status_request WHERE id_status_request = $1`,
      [id_status_request]
    );

    const updStatusReq = await db.query(
      `UPDATE requests SET status_request_id = $1 WHERE id_request = $2 RETURNING *;`,
      [status_request.rows[0].id_status_request, id_request]
    );
    await db.query('COMMIT');
    return 'Статус успешно обновлен';
  }
}

module.exports = new RequestService();
