const express = require('express');
const uuidv4 = require('uuid/v4');
const find = require('lodash/find');
const remove = require('lodash/remove');

const app = express();
const PORT = 3000;

const users = [
  { id: uuidv4(), name: 'Nick', age: 23 },
  { id: uuidv4(), name: 'Den', age: 43 },
  { id: uuidv4(), name: 'John', age: 56 },
  { id: uuidv4(), name: 'Doe', age: 29 },
];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('Hello World'));
app.get('/users', (req, res) => res.json(users));
app.post('/users', (req, res) => {
  const newUser = {
    name: req.body.name,
    age: req.body.age,
    id: uuidv4(),
  };
  users.push(newUser);
  res.json(users);
});

app.put('/users/:id', (req, res) => {
  const userToUpdate = find(users, { id: req.params.id });
  // I don't think it's a good way to get user object as reference
  // but what would you do?
  userToUpdate.name = req.body.name;
  userToUpdate.age = req.body.age;

  res.json(userToUpdate);
});

app.delete('/users/:id', (req, res) => {
  remove(users, item => item.id === req.params.id);
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}!`));
