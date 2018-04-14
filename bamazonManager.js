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

//User interface prompts
function greetManager() {
  inquirer.prompt([{
    name: 'choice',
    type: 'list',
    message: 'What would you like to do?',
    choices: ['View-For-Sale', 'View-Low-Inventory', 'Order-Extra-Stock', 'Order-New-Stock']
  }]).then(function (inqResp) {
    console.log(inqResp.choice);
    switch (inqResp.choice) {
      case 'View-For-Sale':
        forSale();
        break;
      case 'View-Low-Inventory':
        lowInventory();
        break
      case 'Order-Extra-Stock':

        addInventory();
        break
      case 'Order-New-Stock':

        greetManager();
        break;

      default:
        break;
    }
  })
  //END
};

//OPTION 3 inquirer prompt
// function (params) {
//   inquirer.prompt([
//     name: '',
//     type: 'input',
//     message: ''
//   ])
// }

// //OPTION 4 inquirer prompt
// function (params) {
//   inquirer.prompt([
//     name: '',
//     type: 'input',
//     message: ''
//   ])
// }

//For sale function
var forSale = function () {
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity>0", function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      console.log('Item#: ' + res[i].item_id +
        '\nProduct: ' + res[i].product_name +
        '\nPrice: ' + res[i].price +
        '\n# In stock: ' + res[i].stock_quantity +
        '\n-----------------------------')
    };
  });
  greetManager();
  //END
};

var lowInventory = function () {
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity<5", function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      console.log('Item#: ' + res[i].item_id +
        '\nProduct: ' + res[i].product_name +
        '\nPrice: ' + res[i].price +
        '\n# In stock: ' + res[i].stock_quantity +
        '\n-----------------------------')
    };
  });
  //END
};

//ADD more of existing products
var addInventory = function () {
  let base = 0;
  inquirer.prompt([{
      name: 'id',
      type: 'input',
      message: 'What is the ID of the item you want extra stock for?'
    },
    {
      name: 'quantity',
      type: 'input',
      message: 'And how many of those do you want to order?'
    }
  ]).then(function (inqResp2) {
    connection.query('SELECT stock_quantity FROM products WHERE ?', {
        item_id: inqResp2.id
      }),
      function (res) {
        base = res[i].stock_quantity;
      } 
    connection.query("UPDATE products SET ? WHERE ?", {
        stock_quantity: inqResp2.quantity
      }, {
        item_id: inqResp2.id
      },
      function (err, res) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
      })
  });
  //END
};

//ADD entirely new product
var newProduct = function (name, department, price, quantity) {
  connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?", [name, department, price, quantity],
    function (err, res) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
};



greetManager();