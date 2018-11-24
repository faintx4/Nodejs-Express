const express = require('express');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const uuidv4 = require('uuid/v4');

const initialUsers = [
  { id: uuidv4(), name: 'Nick', age: 23 },
  { id: uuidv4(), name: 'Den', age: 43 },
  { id: uuidv4(), name: 'John', age: 56 },
  { id: uuidv4(), name: 'Doe', age: 29 },
];

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create database instance and start server
const adapter = new FileAsync('db.json');

low(adapter)
  .then((db) => {
    app.get('/users', (req, res) => {
      const users = db.get('users');
      res.json(users);
    });

    app.get('/users/:id', (req, res) => {
      const user = db.get('users')
        .find({ id: req.params.id })
        .value();

      res.json(user);
    });

    app.post('/users', (req, res) => {
      const newUser = {
        name: req.body.name,
        age: req.body.age,
        id: uuidv4(),
      };

      db.get('users')
        .push(newUser)
        .write()
        .then(() => {
          res.json(newUser);
        });
    });

    app.put('/users/:id', (req, res) => {
      const updatedUser = db.get('users').find({ id: req.params.id }).assign({
        name: req.body.name,
        age: req.body.age,
      }).value();

      // Not sure about this because updating a user probably is async operation
      // so it's possible that res.json(updatedUser) could run earlier than user updated
      res.json(updatedUser);
    });

    app.delete('/users/:id', (req, res) => {
      db.get('users')
        .remove({ id: req.params.id })
        .write()
        .then(() => {
          res.sendStatus(200);
        });
    });

    // Set db default values
    return db.defaults({ users: initialUsers }).write();
  }).then(() => {
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}!`));
  });
