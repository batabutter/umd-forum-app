CREATE DATABASE umdforum;

CREATE TABLE accounts(
    account_id      SERIAL PRIMARY KEY,
    user_name       varchar(80)
);

CREATE TABLE posts(
    post_id         SERIAL PRIMARY KEY,
    title           varchar(80),
    content         varchar(80),
    created_at      TIMESTAMP DEFAULT NOW(),
    upvotes         numeric DEFAULT 0,
    downvotes       numeric DEFAULT 0
);


CREATE TABLE comments(
    comment_id      SERIAL PRIMARY KEY,
    post_id         int NOT NULL,
    content         varchar(80),
    upvotes         numeric DEFAULT 0,
    downvotes       numeric DEFAULT 0,
    CONSTRAINT fk_post FOREIGN KEY(post_id) REFERENCES posts(post_id)
);