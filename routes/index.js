const router = require('express').Router();

const auth = require('../middlewares/auth');
const { userRouter } = require('./users');
const { movieRouter } = require('./movies');
const { signRouter } = require('./sign');

router.use('/', signRouter);
router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);

module.exports = router;
