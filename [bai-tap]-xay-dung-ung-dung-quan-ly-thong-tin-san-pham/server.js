const http = require('http')
const fs = require('fs')
const url = require("url")
const port = 8000;
const qs = require("qs");
const mysql = require("mysql");
const util = require("util");


// connect to db
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql123456",
    database: "dbTest",
    charset: "utf8_general_ci"
});
// node native promisify
const query = util.promisify(connection.query).bind(connection);

let products = [];
const getLayout = () => {
    return fs.readFileSync("./views/layouts/main.html", "utf-8");
}

let server = http.createServer(async (req, res) => {
    const route = url.parse(req.url, true).pathname;
    const method = req.method;
    let index = url.parse(req.url, true).query.index;
    let id = url.parse(req.url, true).query.id;
    (index instanceof Array) ? index = index[0] : index;
    // đọc dữ liệu từ file data.json
    switch (route) {
        case "/":
            if (method === "GET") {
                let html = '';
                try {
                    const selectSql = `SELECT * FROM products`;
                    products = await query(selectSql);
                } catch (err) {
                    console.log(err.message);
                } finally {
                    // connection.end();
                }
                products = JSON.parse(JSON.stringify(products));
                products.forEach((product, index) => {
                    try {
                        if (product) {
                            html += '<tr>';
                            html += `<td>${index + 1}</td>`
                            html += `<td>${product["name"]}</td>`
                            html += `<td>${product["price"]}</td>`
                            html += `<td><a href="/delete?id=${product["id"]}&index=${index}"><button class="btn btn-danger">Delete</button></a></td>`
                            html += `<td><a href="/update?id=${product["id"]}&index=${index}"><button class="btn btn-primary">Update</button></a></td>`
                            html += '</tr>';
                        }
                    } catch (err) {
                        console.log(err.message);
                    }
                });
                let data = "";
                try {
                    data = fs.readFileSync('./views/index.html', 'utf-8');
                } catch (err) {
                    console.log(err.message);
                    data = err.message;
                }

                res.writeHead(200, {'Content-Type': 'text/html'});
                data = data.replace('{list-user}', html);
                let display = getLayout().replace('{content}', data)
                res.write(display);
                return res.end();
            }
            break;
        case "/create" :
            if (method === "GET") {
                fs.readFile('./views/create.html', 'utf-8', function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                    let html = "";
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    html = getLayout().replace('{content}', data);
                    res.write(html);
                    return res.end();
                });
            } else {
                let data = "";
                req.on('data', chunk => {
                    data += chunk;
                })
                req.on('end', async () => {
                    let product = qs.parse(data);
                    try {
                        const insertSql = `INSERT INTO products (name, price) VALUES ("${product["name"]}", ${parseInt(product["price"])})`;
                        await query(insertSql);

                    } catch (err) {
                        console.log(err.message);
                    }
                    // -- end
                    res.writeHead(302, {
                        location: "/"
                    });
                    return res.end();
                })

                req.on('error', () => {
                    console.log('error')
                })
            }
            break;

        case "/delete":
            if (method === "GET") {
                let html = '';
                const selectProductSql = `SELECT * FROM products WHERE id = ${id} LIMIT 1;`;
                const product = (await query(selectProductSql))[0];
                try {
                    html += '<tr>';
                    html += `<td>${parseInt(index) + 1}</td>`
                    html += `<td>${product["name"]}</td>`
                    html += `<td>${product["price"]}</td>`
                    html += `<td>
                                     <form  method="POST">
                                       <button type="submit" class="btn btn-danger">Delete</button>
                                     </form>
                              </td>`
                    html += `<td><a href="/update?id=${product["id"]}&index=${index}"><button class="btn btn-primary">Update</button></a></td>`
                    html += '</tr>';

                } catch (err) {
                    html = "Load data fail!";
                    console.log(err.message);
                }
                let data = "";
                try {
                    data = fs.readFileSync('./views/delete.html', 'utf-8')
                } catch (err) {
                    data = err.message;
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                data = data.replace('{delete-user}', html);
                let display = getLayout().replace('{content}', data)
                res.write(display);
                return res.end();

            } else {
                const selectProductSql = `DELETE FROM products WHERE id = ${id} ; `;
                try {
                    await query(selectProductSql);
                } catch (err) {
                    return res.end(err.message);
                }
                res.writeHead(302, {
                    location: "/"
                });
                res.end();
            }
            break;
        case "/update":
            // let index = url.parse(req.url, true).query.index;
            if (method === "GET") {
                let html = '';
                try {
                    const selectProductSql = `SELECT * FROM products WHERE id = ${id} LIMIT 1`;
                    let product = (await query(selectProductSql))[0];
                    fs.readFile('./views/update.html', 'utf-8', function (err, data) {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        data = data.replace(/{product-index}/gim, parseInt(index));
                        data = data.replace(/{product-id}/gim, parseInt(id));
                        data = data.replace('{product-name}', product.name);
                        data = data.replace('{product-price}', product.price);
                        html = getLayout().replace('{content}', data);
                        res.write(html);
                        return res.end();
                    });

                } catch (err) {
                    html = "Load data fail!";
                    console.log(err.message);
                    res.write(html);
                    return res.end();
                }
            } else {
                let data = "";
                req.on('data', chunk => {
                    data += chunk;
                })
                req.on('end', async () => {
                    let product = qs.parse(data);
                    try {
                        const updateSql = `UPDATE products 
                                           SET name = '${product["name"]}',price = ${product["price"]}
                                           WHERE id = ${id} `;
                        await query(updateSql);

                    } catch (err) {
                        res.end(err.message);
                    }
                    res.writeHead(302, {
                        location: "/"
                    });
                    return res.end();
                })

                req.on('error', () => {
                    console.log('error')
                })
            }
            break;
        default:
            res.writeHead(404, {"Content-Type": "text/html"})
            res.write("404! Not found!")
            res.write("<br><a href='/'>Home</a>");
            res.end();
    }
})

//server listen on port
server.listen(port, function () {
    console.log('Serve running port ', port);
})

