const router = require('express').Router();
const {User} = require('../db/models/index');

module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email', 'firstName', 'lastName']
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['firstName', 'lastName', 'email']
    });

    if (user) {
      res.json(user);
    } else {
      res.sendStatus(404).end();
    }
  } catch (err) {
    next(err);
  }
});
