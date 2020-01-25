const db = require('../server/db');
const {green, red} = require('chalk');
const {User, Product, Order, OrderItem} = require('../server/db/models/index');

const products = [
  {
    name: 'Excalibur',
    price: 500000,
    imageUrl:
      'https://www.darksword-armory.com/wp-content/uploads/2014/09/the-excalibur-sword-medieval-weapon-1524.jpg',
    amountInStock: 1
  },
  {
    name: 'Murasame',
    price: 300000,
    imageUrl:
      'https://images-na.ssl-images-amazon.com/images/I/51arm224w%2BL._SX425_.jpg',
    amountInStock: 1
  },
  {
    name: 'Master Sword',
    price: 500000,
    imageUrl:
      'https://images.fun.com/products/61032/1-1/legend-of-zelda-master-sword-light.jpg',
    amountInStock: 1
  },
  {
    name: 'Ragnell',
    price: 700000,
    imageUrl:
      'https://d2t1xqejof9utc.cloudfront.net/screenshots/pics/34a10962ba762a663a2e5734d217e2e2/large.jpg',
    amountInStock: 1
  }
];

const users = [
  {
    firstName: 'Lancelot',
    lastName: 'duLac',
    email: 'lance@roundtable.com',
    password: 'guineviere1234',
    salt: 'temp',
    googleId: null
  },
  {
    firstName: 'Arthur',
    lastName: 'Pendragon',
    email: 'excalibur@roundtable.com',
    password: 'ika1234',
    salt: 'temp',
    googleId: null
  },
  {
    firstName: 'Link',
    lastName: 'Link',
    email: 'LL@roundtable.com',
    password: 'Fairy1234',
    salt: 'temp',
    googleId: null
  },
  {
    firstName: 'Ike',
    lastName: 'Ike',
    email: 'dragonmaster@roundtable.com',
    password: 'fire1234',
    salt: 'temp',
    googleId: null
  }
];

const orders = [
  {status: 'processing', userId: 1},
  {status: 'delivered', userId: 1},
  {status: 'in transit', userId: 2},
  {status: 'in cart', userId: 4},
  {status: 'in cart', userId: 3}
];

const orderItems = [
  {orderId: 1, productId: 1},
  {orderId: 1, productId: 2},
  {orderId: 2, productId: 2},
  {orderId: 2, productId: 3},
  {orderId: 3, productId: 3},
  {orderId: 3, productId: 4},
  {orderId: 4, productId: 4},
  {orderId: 4, productId: 1},
  {orderId: 5, productId: 1},
  {orderId: 5, productId: 2}
];
const seed = async () => {
  await db.sync({force: true});

  // seed your database here!

  await Promise.all(
    users.map(user => {
      return User.create(user);
    })
  );

  await Promise.all(
    products.map(product => {
      return Product.create(product);
    })
  );

  await Promise.all(
    orders.map(order => {
      return Order.create(order);
    })
  );

  await Promise.all(
    orderItems.map(orderItem => {
      return OrderItem.create(orderItem);
    })
  );

  console.log(green('Seeding success!'));

  db.close();
};

seed().catch(err => {
  console.error('Oh noes! Something went wrong!');
  console.error(err);
  db.close();
});
