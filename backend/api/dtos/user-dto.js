module.exports = class UserDTO {
  id_user;
  id_account;
  firstname;
  lastname;
  middlename;
  email;
  phone;
  rating;
  roles;

  constructor(model) {
    this.id_user = model.id_user;
    this.id_account = model.id_account;
    this.firstname = model.firstname;
    this.lastname = model.lastname;
    this.middlename = model.middlename;
    this.email = model.email;
    this.phone = model.phone;
    this.rating = model.rating;
    this.login = model.login;
    this.roles = model.roles;
  }
};
