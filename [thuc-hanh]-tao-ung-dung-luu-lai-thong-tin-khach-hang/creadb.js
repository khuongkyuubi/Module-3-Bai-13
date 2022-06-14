const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql123456",
    database: "dbTest",
    charset: "utf8_general_ci"
});

connection.connect((err) => {
    if (err) throw err.stack;
    console.log("connected to database!");
    const createTableSql = `CREATE TABLE IF NOT EXISTS customers(
                                id INT UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
                                name VARCHAR(30) NOT NULL,
                                address VARCHAR(30)                              
                            );`;
    connection.query(createTableSql, (err) => {
        if (err) throw err;
        console.log("Create table customers success!")
    });

    // kết thúc kết nối với database
    connection.end((err) => {
        if (err) console.log(err);
    })
})
