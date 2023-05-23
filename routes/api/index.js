const thoughtRoutes = require('./thoughtRoutes');
const userRoutes = require('./userRoutes');
const router = require('express').Router();

router.use('/thoughts', thoughtRoutes);
router.use('/users', userRoutes);

module.exports = router;