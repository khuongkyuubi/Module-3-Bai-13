const mysql = require('mysql');

// setting for connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql123456",
    database: "dbTest",
    charset: "utf8_general_ci"

})

// start connect to database
connection.connect((err) => {
    if (err) {
        throw err.stack;
    }
    console.log("connected to database");
    // MAKE NEW TABLE
    const createTableSql = `CREATE TABLE IF NOT EXISTS city
                            (
                                id      INT UNIQUE  NOT NULL AUTO_INCREMENT,
                                name    VARCHAR(30) NOT NULL,
                                zipcode VARCHAR(6)
                            )`;
    connection.query(createTableSql, (err) => {
        if (err) throw err;
        console.log("MAKE TABLE SUCCESS!");
    });
    // INSERT VALUE INTO TABLE
    // const insertValue = `INSERT INTO city(name, zipcode)
    //                      VALUES ('Ha Noi', '100000'),
    //                             ('T.P HCM', '80000'),
    //                             ('Da Nang', '50000'),
    //                             ('Nam Dinh', '40000');
    //                     `;
    // connection.query(insertValue, (err) => {
    //     if (err) throw err;
    //     console.log("Insert values success!")
    // })

    // QUERY DATA
    const queryAllData = `SELECT * FROM city`;
    connection.query(queryAllData, (err, result, fields) => {
        if (err) throw err;
        console.log("Result of query!")
        console.table(result);
        console.table(fields);
    })


});