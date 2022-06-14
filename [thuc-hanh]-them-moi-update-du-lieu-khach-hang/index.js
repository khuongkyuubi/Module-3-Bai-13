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

    // insert into db
    // const insertSql = `INSERT INTO  customers(name, address) VALUES ("Thành", "Phú Thọ")`;
    // connection.query(insertSql, (err) => {
    //     if(err) throw err;
    //     console.log("1 record insert success!");
    // });
    // update db
    const updateSql = `UPDATE customers SET address="Hải Dương" WHERE name = "Hùng" `;
    connection.query(updateSql, (err, result) => {
        if (err) throw err;
        console.log(result);
        console.log(result.affectedRows,"record(s) updated!");
    })


})