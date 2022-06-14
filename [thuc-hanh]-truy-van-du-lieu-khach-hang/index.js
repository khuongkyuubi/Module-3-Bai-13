const mysql = require('mysql');

const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "mysql123456",
    database : "dbTest",
    charset : "utf8_general_ci"
});

connection.connect((err) => {
    if(err) throw err.stack;
    console.log("connect db success!");
    // query with *
    const selectSql = `SELECT * FROM customers`;
    connection.query(selectSql, (err, results, fields) => {
        if(err) throw err;
        console.table(fields);
        console.log(results);
    });
    // query with where
    const selectSqlWhere = `SELECT * FROM customers WHERE address = 'Thái Bình'`;
    connection.query(selectSqlWhere, (err, results, fields) => {
        if(err) throw err;
        console.log("query with where", results);
    })
    // query with limit
    const selectSqlLimit = `SELECT * FROM customers LIMIT 3`;
    connection.query(selectSqlLimit, (err, results, fields) => {
        if(err) throw err;
        console.log("query with limit",results);
    })

})