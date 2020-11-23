CREATE DATABASE tasksproject
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

CREATE SCHEMA tasks
    AUTHORIZATION postgres;

CREATE TABLE tasks.Users
(
    user_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT username UNIQUE (username)
);

ALTER TABLE tasks.Users
    OWNER to postgres;

CREATE TABLE tasks.Tasks
(
    task_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    user_id integer NOT NULL,
    title text,
    description text,
    type event NOT NULL,
    PRIMARY KEY (task_id),
    CONSTRAINT fk_user 
        FOREIGN KEY (user_id)
        REFERENCES tasks.Users(user_id)
);

ALTER TABLE tasks.Tasks
    OWNER to postgres;