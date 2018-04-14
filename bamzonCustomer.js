var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "tpoH1004",
  database: "bamazon"
});

//Get info from DB
var connect = function () {
  connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      console.log('Item#: ' + res[i].item_id +
        "\nProduct: " + res[i].product_name +
        '\nPrice: ' + res[i].price +
        '\n-----------------------------')
    };
    greetCustomer();
  });
};

function greetCustomer() {
  let new_quantity = 0;
  inquirer.prompt([{
      name: "item_id",
      type: "input",
      message: "What is the Id of the product you would like to buy?"
    },
    {
      name: "quantity",
      type: "input",
      message: "And how many would you like to buy?"
    }
  ]).then(function (inquirer) {

    //CONNECT to SELECT FOR quantity CHECK
    connection.query("SELECT * FROM products WHERE ?", [{
        item_id: inquirer.item_id
      }],
      function (err, res) {
        if (err) throw err;
        new_quantity = res[0].stock_quantity - inquirer.quantity;;
        //Updates Database on successful buy
        if (inquirer.quantity < res[0].stock_quantity) {
          updateDB(inquirer.item_id, new_quantity, res[0].price, inquirer.quantity, res[0].product_name);
        } else {
          cancelUpdate();
        };
      })
  });
};

function updateDB(id, new_value, price, howMany, name) {
  //If valid set quantity to our new value
  connection.query("UPDATE products SET ? WHERE ?", [{
    stock_quantity: new_value
  }, {
    item_id: id
  }]);
  console.log("You have successfully bought " +
    howMany + " " +
    name + "(s) for $" +
    parseFloat(price) * parseFloat(howMany))
  connection.end();
};

function cancelUpdate(params) {
  //If invalid send user an error message
  console.log("Not enough stock in inventory.");
  connection.end();
};

//Order of Operations
connect();