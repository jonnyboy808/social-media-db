const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thoughtController.js');

// /api/Thoughts
router.route('/')
  .get(getThoughts)
  .post(createThought);

// /api/Thoughts/:ThoughtId
router.route('/:thoughtId')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

// /api/users/:thoughtId/reactions
router.route('/:thoughtId/reactions')
  .post(addReaction);

// /api/users/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId')
  .delete(removeReaction);



module.exports = router;
