var mysql = require('mysql')
var config = require('../config/index.js')

var pool = mysql.createPool({
    host: config.MYSQL.HOST,
    user: config.MYSQL.USERNAME,
    password: config.MYSQL.PASSWORD,
    database: config.MYSQL.DATABASE,
    port: config.MYSQL.PORT,
    charset : 'utf8mb4',
    // 一次执行多条语句
    multipleStatements: true,
    //解决时间格式
    dateStrings : true
});

let query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}

module.exports = query