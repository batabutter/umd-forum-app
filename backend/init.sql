CREATE DATABASE umdforum

CREATE TABLE posts(
    post_id SERIAL PRIMARY KEY,
    title   varchar(80),
    content varchar(80),
    created_at TIMESTAMP NOW()
)

CREATE TABLE accounts(
    account_id  SERIAL PRIMARY KEY,
    user_name   varchar(80)
)