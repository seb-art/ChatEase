const { Router } = require('express');
const accountsController = require('../controllers/accountsController');
const router = Router();

router.post('/register', accountsController.register);
router.post('/login', accountsController.login);
router.get('/test', (req, res) => {
  res.send('Test route is working');
});

module.exports = router;
