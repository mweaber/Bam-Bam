var mysql = require("mysql");
var inquirer = require("inquirer");
var {
    table
} = require("table");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "veritas19",
    database: "bamazonDB"
});

startConnect();

function startConnect() {
    // Makes the connection and starts the list function 
    // to show current inventory
    connection.connect(function (err) {
        if (err) throw err;
        listAll();       
    });
}

function listAll(){
    // Makes connection query and gathers all stock
    // and will console.log the results with the table npm
    // which will then start the inquire.
    connection.query("SELECT * FROM products", function (err, res) {
        var data = [];
        console.log("-------- Here is our current inventory --------");
        for (var i = 0; i < res.length; i++) {
            data.push(["ID: " + res[i].ID, res[i].product_name, res[i].department_name, ("$" + res[i].price + ".00"), (res[i].stock_quantity + " qty")]);           
        }
        var output = table(data);
        console.log(output);
        start();
    });
}

function start() {
    // Start inquire and ask for user input
    // and gives option to end. It also hold a 
    // validate in the input field to verify what is entered
    // is a valid number. Once all is entered the purchase function runs.
    inquirer
        .prompt({
            name: "buyOrExit",
            type: "list",
            message: "Would you like to [BUY] an item or [EXIT] ?",
            choices: ["BUY", "EXIT"]
        })
        .then(function (answer) {
            if (answer.buyOrExit === "BUY") {

                purchaseItem();
            } else {
                connection.end();
            }
        });
}

function purchaseItem() {
    // On start will gather all products from the table.
    // Next it will loop over the products and put them into an 
    // array which will populate the choices. 
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var choiceArray = [];
        inquirer
            .prompt([{
                    name: "ID",
                    type: "rawlist",
                    message: "Please select an item you'd like to purchase?",
                    choices: function () {

                        for (var j = 0; j < res.length; j++) {
                            choiceArray.push(res[j].product_name);
                        }

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
                // In this return from the inquire I will update products and display all info.
                var amount = parseInt(answer.quantity);
                var a = choiceArray.indexOf(answer.ID);
                var oldQ = res[a].stock_quantity;
                var newQ = oldQ-amount;
                var priceTotal = res[a].price * amount;
                if (a >= 0) {
                    console.log("Please wait while we finish processing");
                    connection.query("UPDATE products SET ? WHERE ?", [
                            {
                                stock_quantity: newQ,
                            },
                            {
                                product_name: answer.ID
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Transaction Successful");
                            console.log("Your total is: $" + priceTotal);
                            listAll();                        
                        }
                    );
                } else {
                    console.log("Unable to process!");
                    start();
                }
            });
    });
}
