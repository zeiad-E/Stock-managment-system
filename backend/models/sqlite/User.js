const { sqliteDb } = require('../../config/db');
const bcrypt = require('bcrypt');

class User {
    static async findByUsername(username) {
        return new Promise((resolve, reject) => {
            sqliteDb.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static async create({ username, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return new Promise((resolve, reject) => {
            sqliteDb.run(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                [username, hashedPassword],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, username });
                }
            );
        });
    }

    static async comparePassword(candidatePassword, hashedPassword) {
        return bcrypt.compare(candidatePassword, hashedPassword);
    }
}

module.exports = User;