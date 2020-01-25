const router = require('express').Router();
const {Order, OrderItem} = require('../db/models/index');

module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const allOrders = await Order.findAll();
    res.json(allOrders);
  } catch (error) {
    next(error);
  }
});

// route for getting order contents
router.get('/:id/', async (req, res, next) => {
  try {
    // get the order specified in slug
    const order = await Order.findByPk(req.params.id, {
      // eager loading order lines from order items table
      include: [{model: OrderItem}]
    });
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // the post request's body has an object with the necessary info for creating the new order
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/', async (req, res, next) => {
  try {
    const [numRows, updatedInstance] = await Order.update(req.body, {
      where: {id: req.params.id},
      returning: true
    });
    res.json(updatedInstance[0]);
  } catch (error) {
    next(error);
  }
});
