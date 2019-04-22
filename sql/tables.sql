DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS friendship;
DROP TABLE IF EXISTS messages;


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(300) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(4500) NOT NULL,
    picurl VARCHAR(500),
    bio VARCHAR (1000)
);


CREATE TABLE friendship(
    id SERIAL PRIMARY KEY,
    receiver INT NOT NULL REFERENCES users(id),
    sender INT NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT false,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    sender INT NOT NULL REFERENCES users(id),
    msg TEXT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
