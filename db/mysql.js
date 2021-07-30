const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    port: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const db = {};

db.all = (event_id) => {

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM question WHERE event_id = ?', event_id, (err, rows, fields) => {
            if (err) return reject(err);
            return resolve(rows);
        });
    });
};

db.insert = (question) => {
    const fields = [
        question.question,
        question.event_id
    ];
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO question (question, event_id) VALUES (?, ?)',
            fields,
            (err, rows, fields) => {
                if (err) return reject(err);
                return resolve(rows);
            });
    });
};

db.incrementVote = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE question SET votes = votes + 1 WHERE id = ?', id,
            (err, rows, fields) => {
                if (err) return reject(err);
                return resolve(rows);
            });
    });
}

db.delete = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE from question WHERE id = ?', id,
            (err, rows, fields) => {
                if (err) return reject(err);
                return resolve(rows);
            });
    });
}

db.createEvent = (event) => {
    const fields = [
        event.id,
        event.creator_key
    ];
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO event (id, creator_key) VALUES (?, ?)',
            fields,
            (err, rows, fields) => {
                if (err) return reject(err);
                return resolve(rows);
            });
    });
}

db.getCreatorKey = (id) => {

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM event WHERE id = ?', id, (err, rows, fields) => {
            if (err) return reject(err);
            return resolve(rows);
        });
    });
};

db.answered = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE question SET answered = 1 WHERE id = ?', id,
            (err, rows, fields) => {
                if (err) return reject(err);
                return resolve(rows);
            });
    });
}

module.exports = db;