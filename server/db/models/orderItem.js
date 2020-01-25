const Sequelize = require('sequelize');
const Product = require('./product');
const db = require('../db');

const OrderItem = db.define('orderItem', {
  // product ID column
  orderId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  // order ID column
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  // quantity column
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

OrderItem.beforeCreate(async function(orderItem) {
  const product = await Product.findByPk(orderItem.productId);
  orderItem.price = product.price;
});

module.exports = OrderItem;
