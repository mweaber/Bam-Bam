var mysql = require("mysql");
var inquirer = require("inquirer");
var {
    table
} = require("table");
var data = [];
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "veritas19",
    database: "bamazonDB"
});
listAll();
function listAll() {
    connection.connect(function (err) {
        if (err) throw err;
        //   console.log("connected as id " + connection.threadId + "\n");

        connection.query("SELECT * FROM products", function (err, res) {


            console.log("-------- Here is our current inventory --------");
            for (var i = 0; i < res.length; i++) {
                data.push(["ID: " + res[i].ID, res[i].product_name, res[i].department_name, ("$" + res[i].price + ".00"), (res[i].stock_quantity + " qty")]);
                // console.log("ID: " + res[i].ID + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price + ".00" + " | " + res[i].stock_quantity + " qty");
            }
            // console.log("-----------------------------------");
            var output = table(data);
            console.log(output);
            start();
        });
    });
}

function start() {
    inquirer
        .prompt({
            name: "buyOrExit",
            type: "list",
            message: "Would you like to [BUY] an item or [EXIT] ?",
            choices: ["BUY", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.buyOrExit === "BUY") {

                purchaseItem();
            } else {
                connection.end();
            }
        });
}

function purchaseItem() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: "ID",
                    type: "rawlist",
                    message: "Please select an item you'd like to purchase?",
                    choices: function () {
                        var choiceArray = [];
                        for (var j = 0; j < res.length; j++) {
                            choiceArray.push(res[j].product_name);
                        }
                        // console.log(choiceArray);
                        return choiceArray;
                    }
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to purchase?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ]).then(function (answer) {
                console.log(answer);
                // if (ID.stock_quantity < parseInt(answer.bid)) {
                    // console.log("Please try again, unable to process.")
                    // purchaseItem();
    //             } else {
    //                 console.log("Please wait while we finish your order");
    //                 // connection.query(
    //                 //     console.log("Are we making this work?")
    //                 //     // "UPDATE products SET ? WHERE ?",
    //                 //     // [{
    //                 //     //     stock_quantity: stock_quantity - answer.bid
    //                 //     // }]
                        
    //                 // )
    //             //   listAll();  
    //             }

            });
    });
}