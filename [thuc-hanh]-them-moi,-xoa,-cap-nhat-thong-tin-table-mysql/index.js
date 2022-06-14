const mysql = require("mysql");

// connect to db server
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql123456",
    database: "dbTest",
    charset: "utf8_general_ci"
});

connection.connect((err) => {
    if (err) throw err.stack;
    console.log("connect db success!");
    // add new table
    const createTableSql = `CREATE TABLE IF NOT EXISTS products (
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                name VARCHAR(255),
                                price INT
                                );`;
    connection.query(createTableSql, (err, result) => {
        if (err) throw err;
        console.log("Create table success!");
    });
    // Drop table
    const dropTableSql = `DROP TABLE IF EXISTS products`;
    connection.query(dropTableSql, (err, result) => {
        if (err) throw err;
        console.log("Drop table success!");
    });
    // Drop column of table
    const dropColumn = `ALTER TABLE customers
                        DROP COLUMN age `;
    connection.query(dropColumn, (err, result) => {
        if (err) throw err.stack;
        console.log("Drop column success!");
    });

    // Alter table
    const alterTableSql = `ALTER TABLE customers
                           ADD COLUMN age INT Default 30`;
    connection.query(alterTableSql, (err, result) => {
        if (err) throw err.stack;
        console.log("Alter table success!");
    });


})