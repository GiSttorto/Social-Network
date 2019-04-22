var spicedPg = require('spiced-pg');


var db = spicedPg(process.env.DATABASE_URL || 'postgres:giovannags:Naosabe1007@localhost:5432/socialnet');



exports.createUser = function  (first, last, email, password) {
    let q = `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4)
            RETURNING id, first`;
    let params = [first, last, email, password];
    return db.query(q, params);
};

exports.getPassword = function (email) {
    let q = `SELECT password, id FROM users WHERE email = $1`;
    let params = [email];
    return db.query(q, params);
};

exports.info = function (id) {
    let q = `SELECT id, first, last, picurl, bio FROM users  WHERE id = $1`;
    let params = [id];
    return db.query(q, params);
};

exports.uploadPic = function (picurl, id) {
    let q = `UPDATE users SET picurl = $1 WHERE id = $2 RETURNING picurl`;
    let params = [picurl, id];
    return db.query(q, params);
};

exports.bio = function (bio, id) {
    let q = `UPDATE users SET bio = $1 WHERE id = $2 RETURNING id, bio`;
    let params = [bio, id];
    return db.query(q, params);
};

exports.getFriendship = function (myId, otherUserId) {
    let q = `SELECT * FROM friendship WHERE (receiver = $1 AND sender = $2) OR (receiver = $2 AND sender = $1)`;
    let params = [myId, otherUserId];
    return db.query(q, params);
};

exports.friendRequest = function (myId, otherUserId) {
    let q = `INSERT INTO friendship (receiver,sender) VALUES ($1, $2) RETURNING id`;
    let params = [myId, otherUserId];
    return db.query(q, params);
};

exports.acceptFriend = function (myId, otherUserId) {
    let q = `UPDATE friendship SET accepted = true WHERE (receiver = $1 AND sender = $2) OR (receiver = $2 AND sender = $1)`;
    let params = [myId, otherUserId];
    return db.query(q,params);
};


exports.cancelFriend = function (myId, otherUserId) {
    let q = `DELETE FROM friendship WHERE (receiver = $1 AND sender = $2) OR (receiver = $2 AND sender = $1)`;
    let params = [myId, otherUserId];
    return db.query(q, params);
};

exports.allFriends = function (myId) {
    let q = `SELECT users.id, first, last, picurl, accepted FROM friendship JOIN users
    ON (accepted = false AND receiver = $1 AND sender = users.id)
    OR (accepted = false AND sender = $1 AND receiver = users.id)
    OR (accepted = true AND receiver = $1 AND sender = users.id)
    OR (accepted = true AND sender = $1 AND receiver = users.id)`;
    let params = [myId];
    return db.query(q, params);
};


exports.onlineUsers = function (users) {
    let q = `SELECT id, first, last, picurl FROM users WHERE id = ANY($1)`;
    let params = [users]
    return db.query(q, params);
};

exports.getchatMessages = function () {
    let q = `SELECT users.id, users.first, users.last, users.picurl, messages.msg, messages.id, messages.sender, create_at FROM messages
    JOIN users ON users.id = messages.sender ORDER BY create_at DESC LIMIT 10`;
    return db.query(q);
};


exports.newMessage = function (userId, msg) {
    let q = `INSERT INTO messages (sender, msg) VALUES ($1, $2) RETURNING *`;
    let params = [userId, msg];
    return db.query(q, params);
};
