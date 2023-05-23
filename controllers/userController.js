const { User, Thought } = require('../models');

//function that executes the aggregate method on the user model and calculates the friendCount
const friendCount = async (userId) =>
  User.aggregate(
    [
      {
        $unwind: '$friends',
      },
      {
        $group: { _id: userId, friendCount: { $sum: '$friends' },
        },
      },
    ]);

module.exports = {

  // get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
          friendCount: await friendCount(req.params.userId),
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .lean()
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({
            user,
            friendCount: await friendCount(req.params.userId),
          })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // creates a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      req.body,
      {
        new: true,
        runValidators: true
      }
      )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // deletes a user and removes them from the thought
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No such user exists' })
          : Thought.findOneAndUpdate(
            { users: req.params.userId },
            { $pull: { Users: req.params.userId } },
            { new: true }
          )
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({
            message: 'user deleted, but no thoughts found',
          })
          : res.json({ message: 'user successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // POST /api/users/:userId/friends/:friendId
  addFriend(req, res) {
    // add friendId to userId's friend list
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.body.friendId } },
      { new: true, runValidators: true }
    )
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'No user found with this userId' });
          return;
        }
        // add userId to friendId's friend list
        User.findOneAndUpdate(
          { _id: req.body.friendId },
          { $addToSet: { friends: req.params.userId } },
          { new: true, runValidators: true }
        )
          .then(friend => {
            if (!friend) {
              res.status(404).json({ message: 'No user found with this friendId' })
              return;
            }
            res.json(user);
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  },

  // DELETE /api/users/:userId/friends/:friendId
  deleteFriend(req, res) {
    // remove friendId from userId's friend list
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true, runValidators: true }
    )
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'No user found with this userId' });
          return;
        }
        // remove userId from friendId's friend list
        User.findOneAndUpdate(
          { _id: req.params.friendId },
          { $pull: { friends: req.params.userId } },
          { new: true, runValidators: true }
        )
          .then(friend => {
            if (!friend) {
              res.status(404).json({ message: 'No user found with this friendId' })
              return;
            }
            res.json({ message: 'Successfully deleted the friend' });
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  }

};
