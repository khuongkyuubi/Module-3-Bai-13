const http = require("http");
const mysql = require('mysql');
const port = 5000;

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

    // create table products if not exists
    const createTableSql = `CREATE TABLE IF NOT EXISTS products (
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                name VARCHAR(255) NOT NULL,
                                price INT NOT NULL
                                );`;
    connection.query(createTableSql, (err) => {
        if (err) throw err;
        console.log("create table success!");
    });
});

// create server

const server = http.createServer(async (req, res) => {
    try {
        if (req.url === "/product/create" && req.method === "POST") {
            const buffers = [];
            for await (const chunk of req) {
                buffers.push(chunk);
            }
            const data = Buffer.concat(buffers).toString(); // data từ bufer chuyển thành json
            const product = JSON.parse(data);
            const price = parseInt(product.price);
            const sqlCreate = `INSERT INTO products(name, price) VALUES ('${product.name}', ${price})`;
            connection.query(sqlCreate,(err, results, fields) => {
                if(err) throw err;
                res.end("add " +JSON.stringify(product) + " successful!");

            })


        }
    } catch (err) {
        res.end(err.message); // display err message on error case!
    }


});

// listen on port
server.listen(port, () => {
    console.log("server listening on port ", port);
})