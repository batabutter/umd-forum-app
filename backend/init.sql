CREATE DATABASE umdforum;

CREATE TABLE accounts(
    account_id      SERIAL PRIMARY KEY,
    user_name       varchar(80),
    passowrd        varchar(80),
    reputation      numeric DEFAULT 0
);

CREATE TABLE posts(
    post_id         SERIAL PRIMARY KEY,
    account_id      int NOT NULL,
    title           varchar(80),
    content         varchar(80),
    created_at      TIMESTAMP DEFAULT NOW(),
    upvotes         numeric DEFAULT 0,
    downvotes       numeric DEFAULT 0,
    num_comments    numeric DEFAULT 0,
    CONSTRAINT  fk_account FOREIGN KEY(account_id) REFERENCES accounts(account_id)
);


CREATE TABLE comments(
    comment_id      SERIAL PRIMARY KEY,
    post_id         int NOT NULL,
    content         varchar(80),
    upvotes         numeric DEFAULT 0,
    downvotes       numeric DEFAULT 0,
    num_replies     numeric DEFAULT 0,
    CONSTRAINT fk_post FOREIGN KEY(post_id) REFERENCES posts(post_id)
);