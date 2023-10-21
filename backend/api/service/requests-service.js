const db = require("../db");
const ApiError = require("../exceptions/api-error");

class RequestService {
  async createRequest({ author_id, intern_id, type_request_id }) {
    await db.query("BEGIN");

    const author = await db.query(`SELECT * FROM users WHERE id_user = $1`, [
      author_id,
    ]);

    const intern = await db.query(`SELECT * FROM users WHERE id_user = $1`, [
      intern_id,
    ]);

    const newRequest = await db.query(
      `INSERT INTO requests(author_id, intern_id, type_request_id, status_request_id) VALUES ($1, $2, $3, 2) RETURNING *`,
      [author.rows[0].id_user, intern.rows[0].id_user, type_request_id]
    );

    const response = intern.rows[0].firstname;

    await db.query("COMMIT");
    return response;
  }

  async getRequest(author_id) {
    await db.query("BEGIN");

    const request = await db.query(
      `SELECT * FROM requests WHERE author_id = $1`,
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
      };

      requestObjects.push(requestObject);
    }
    await db.query("COMMIT");
    return { requests: requestObjects };
  }
}

module.exports = new RequestService();