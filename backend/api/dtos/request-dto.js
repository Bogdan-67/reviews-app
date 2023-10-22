module.exports = class RequestDTO {
  id_request;
  created_at;
  updated_at;
  intern_id;
  type_request_id;
  status_request_id;
  name;
  authorfirstname;
  authorlastname;
  authormiddlename;
  internfirstname;
  internlastname;
  internmiddlename;
  curator_id;
  author_id;
  poll_id;

  constructor(model) {
    this.id_request = model.id_request;
    this.created_at = model.created_at;
    this.updated_at = model.updated_at;
    this.intern_id = model.intern_id;
    this.type_id = model.type_request_id;
    this.status_id = model.status_request_id;
    this.status = model.name;
    this.author_id = model.author_id;
    this.poll_id = model.poll_id;
    this.author = [
      model.authorlastname,
      model.authorfirstname,
      model.authormiddlename,
    ].join(' ');
    this.intern = [
      model.internlastname,
      model.internfirstname,
      model.internmiddlename,
    ].join(' ');
    this.curator_id = model.curator_id;
  }
};
