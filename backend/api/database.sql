CREATE TABLE users(
    id_user SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    middlename VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100),
    rating REAL DEFAULT 10
);

CREATE TABLE roles(
    id_role SERIAL PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL
);

CREATE TABLE accounts(
    id_account SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL,   
    password VARCHAR(255) NOT NULL,
    confirmed BOOLEAN NOT NULL DEFAULT false,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE user_roles(
    id_user_roles SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id_account) ON DELETE CASCADE,
    role_id INTEGER NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id_role) ON DELETE CASCADE
);

CREATE TABLE tokens(
    account_id SERIAL PRIMARY KEY,
    FOREIGN KEY (account_id) REFERENCES accounts(id_account) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL
);

CREATE TABLE status_team(
    id_status_team SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL   
);

CREATE TABLE teams(
    id_team SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL DEFAULT current_date,
    status_team_id INTEGER NOT NULL,
    FOREIGN KEY (status_team_id) REFERENCES status_team(id_status_team) ON DELETE CASCADE
    
);

CREATE TABLE user_teams(
    id_user_team SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id_team) ON DELETE CASCADE,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE    
);

CREATE TABLE relations(
    id_relation SERIAL PRIMARY KEY,
    curator_id INTEGER NOT NULL,
    FOREIGN KEY (curator_id) REFERENCES users(id_user) ON DELETE CASCADE,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE    
);

CREATE TABLE status_request(
    id_status_request SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE type_requests(
    id_type_request SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE polls(
    id_poll SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    comment VARCHAR(255) NOT NULL
);

CREATE TABLE requests(
    id_request SERIAL PRIMARY KEY,
    created_at DATE NOT NULL DEFAULT current_date,
    updated_at DATE NOT NULL DEFAULT current_date,
    intern_id INTEGER NOT NULL,
    FOREIGN KEY (intern_id) REFERENCES users(id_user) ON DELETE CASCADE,
    author_id INTEGER NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id_user) ON DELETE CASCADE,
    status_request_id INTEGER NOT NULL,
    FOREIGN KEY (status_request_id) REFERENCES status_request(id_status_request) ON DELETE CASCADE,
    type_request_id INTEGER NOT NULL,
    FOREIGN KEY (type_request_id) REFERENCES type_requests(id_type_request) ON DELETE CASCADE,
    poll_id INTEGER NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(id_poll) ON DELETE CASCADE

);



CREATE TABLE question_types(
    id_question_type SERIAL PRIMARY KEY,
    type_name VARCHAR(255) NOT NULL
);

CREATE TABLE poll_questions(
    id_question SERIAL PRIMARY KEY,
    question_title VARCHAR(255) NOT NULL,
    poll_id INTEGER NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(id_poll) ON DELETE CASCADE,
    question_type_id INTEGER NOT NULL,
    FOREIGN KEY (question_type_id) REFERENCES question_types(id_question_type) ON DELETE CASCADE
);

CREATE TABLE question_options(
    id_option SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    question_id INTEGER NOT NULL,
    FOREIGN KEY (question_id) REFERENCES poll_questions(id_question) ON DELETE CASCADE
);

CREATE TABLE selected_options(
    id_selected_options SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    option_id INTEGER NOT NULL,
    FOREIGN KEY (option_id) REFERENCES question_options(id_option) ON DELETE CASCADE,
    question_id INTEGER NOT NULL,
    FOREIGN KEY (question_id) REFERENCES poll_questions(id_question) ON DELETE CASCADE
);


CREATE TABLE feedback(
    id_feedback SERIAL PRIMARY KEY,
    feedback_date DATE,
    feedback_text VARCHAR(255),
    respondent_id INTEGER NOT NULL,
    FOREIGN KEY (respondent_id) REFERENCES users(id_user) ON DELETE CASCADE,
    author_id INTEGER NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id_user) ON DELETE CASCADE,
    status_request_id INTEGER NOT NULL,
    FOREIGN KEY (status_request_id) REFERENCES status_request(id_status_request) ON DELETE CASCADE,
    request_id INTEGER NOT NULL,
    FOREIGN KEY (request_id) REFERENCES requests(id_request) ON DELETE CASCADE,
    poll_id INTEGER NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(id_poll) ON DELETE CASCADE

);

CREATE TABLE queston_answers(
    id_answer SERIAL PRIMARY KEY,
    selected_options_id INTEGER NOT NULL,
    FOREIGN KEY (selected_options_id) REFERENCES selected_options(id_selected_options) ON DELETE CASCADE,
    feedback_id INTEGER NOT NULL,
    FOREIGN KEY (feedback_id) REFERENCES feedback(id_feedback) ON DELETE CASCADE
);




INSERT INTO roles(role_name) VALUES ('Сотрудник') RETURNING *;
INSERT INTO roles(role_name) VALUES ('Стажер') RETURNING *;
INSERT INTO roles(role_name) VALUES ('Руководитель') RETURNING *;
INSERT INTO roles(role_name) VALUES ('Куратор') RETURNING *;

INSERT INTO status_team(name) VALUES ('Расформировано') RETURNING *;
INSERT INTO status_team(name) VALUES ('Активно') RETURNING *;
INSERT INTO status_team(name) VALUES ('Ожидает сотрудника') RETURNING *;
INSERT INTO status_team(name) VALUES ('Готова к стажеру') RETURNING *;


INSERT INTO status_request(name) VALUES ('Ожидает исполнения') RETURNING *;
INSERT INTO status_request(name) VALUES ('Ожидает назначения респондентов') RETURNING *;
INSERT INTO status_request(name) VALUES ('Отклонена') RETURNING *;
INSERT INTO status_request(name) VALUES ('Выполнена') RETURNING *;

INSERT INTO type_requests(name) VALUES ('По стажерам') RETURNING *;
INSERT INTO type_requests(name) VALUES ('По сотруднику') RETURNING *;

INSERT INTO question_types(type_name) VALUES ('Один из нескольких') RETURNING *;
INSERT INTO question_types(type_name) VALUES ('Несколько из нескольких') RETURNING *;
INSERT INTO question_types(type_name) VALUES ('Собственный ответ') RETURNING *;


