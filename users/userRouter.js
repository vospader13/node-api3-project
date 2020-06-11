const express = require('express');
const db = require('./userDb')
const postsDb = require("../posts/postDb")

const router = express.Router();

router.post('/', validateUser(), (req, res) => {
  // do your magic!
  db.insert(req.body)
  .then((user) => {
    res.json(user)
  })
  .catch((error) => {
    res.status(500).json({ error: "There was an error while saving the user to the database" })
  })
});

router.post('/:id/posts', validateUserId(), validatePost(), (req, res) => {
  // do your magic!
  postsDb.insert(req.params.id, req.body.text)
  .then((post) => {
    res.json(post)
  })
  .catch((error) => {
    res.status(500).json({ error: "There was an error while saving the post to the database" })
  })
});

router.get('/', (req, res, next) => {
  // do your magic!
  db.get()
  .then((users) => {
    res.json(users)
  })
  .catch((error) => {
    res.status(500).json({ error: "The users information could not be retrieved." })
  })
});

router.get('/:id', validateUserId(), (req, res) => {
  // do your magic!
  db.getById(req.params.id)
  .then((user) => {
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
  })
  .catch((error) => {
    res.status(500).json({ error: "The user information could not be retrieved." })
  })
});

router.get('/:id/posts', validateUserId(), (req, res) => {
  // do your magic!
  db.getUserPosts(req.params.id)
  .then((posts) => {
    if (posts) {
      res.json(posts)
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
  })
  .catch((error) => {
    res.status(500).json({ error: "The user posts could not be retrieved."})
  })
});

router.delete('/:id', validateUserId(), (req, res) => {
  // do your magic!
  db.remove(req.params.id)
  .then((count) => {
    if (count > 0) {
      res.status(200).json({message: "The user is deleted."})
    }
  })
  .catch((error) => {
    res.status(500).json({ error: "The user information could not be deleted." })
  })
});

router.put('/:id', validateUserId(), (req, res) => {
  // do your magic!
  if (!req.body.name) {
    return res.status(400).json({ errorMessage: "Please provide the name for the user." })
  }
  db.update(req.params.id, req.body)
  .then((user) => {
    res.status(200).json({message: "The user information is updated"})
  })
  .catch((error) => {
    res.status(500).json({ error: "The user information could not be updated." })
  })
});

//custom middleware

function validateUserId() {
  // do your magic!
  return (req, res, next) => {
    db.getById(req.params.id)
    .then((user) => {
      if (user) {
        req.user = user
        next()
      } else {
        res.status(400).json({ message: "invalid user id" })
      }
    })
    .catch((error) => {
      next(error)
    })
  }
}

function validateUser() {
  // do your magic!
  return (req, res, next) => {
    if (!req.body.name) {
      return res.status(400).json({ errorMessage: "Please provide the name for the user." })
    }
    next()
  }
}

function validatePost() {
  // do your magic!
  return (req, res, next) => {
    if (!req.body.text) {
      return res.status(400).json({ errorMessage: "Please provide the text for the post." })
    }
    next()
  }
}

module.exports = router;