module.exports = class UserDTO {
  id_user;
  firstname;
  lastname;
  middlename;
  email;
  phone;
  rating;
  login;
  role;

  constructor(model) {
    this.id_user = model.id_user;
    this.firstname = model.firstname;
    this.lastname = model.lastname;
    this.middlename = model.middlename;
    this.email = model.email;
    this.phone = model.phone;
    this.rating = model.rating;
    this.login = model.login;
    this.role = model.role;
  }
};
