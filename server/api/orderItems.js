const router = require('express').Router();
const {OrderItem, Product} = require('../db/models/index');

module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const allOrderItems = await OrderItem.findAll();
    res.json(allOrderItems);
  } catch (error) {
    next(error);
  }
});

router.get('/:orderId', async (req, res, next) => {
  try {
    const oneOrderItems = await OrderItem.findAll({
      where: {orderId: req.params.orderId},
      include: [{model: Product}]
    });
    res.json(oneOrderItems);
  } catch (error) {
    next(error);
  }
});

router.post('/:orderId', async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const orderId = req.params.orderId;
    // get all the items in that order ID
    let wholeOrder = await OrderItem.findAll({
      where: {orderId: req.params.orderId}
    });
    wholeOrder = wholeOrder.map(item => item.get({plain: true}));
    // find the one of them that has the product id that's in the req.body
    let soughtItem = wholeOrder.find(item => item.productId === productId);
    // if it's undefined, create new record with this item's ID and the price from the Product model
    if (!soughtItem) {
      const newItem = await OrderItem.create({productId, orderId});
      res.json(newItem);
    } else {
      // if it's not undefined, make a change to it - quantity++
      const itemInOrder = await OrderItem.findByPk(soughtItem.id);
      const updatedQuantItem = await itemInOrder.increment('quantity');
      res.json(updatedQuantItem);
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    // destroy row according to item Id in req body
    await OrderItem.destroy({where: {id: req.body.id}});
    res.status(200);
  } catch (error) {
    next(error);
  }
});
