const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const loadUsers = () => {
  if (!fs.existsSync('users.json')) {
    fs.writeFileSync('users.json', '[]');
  }
  return JSON.parse(fs.readFileSync('users.json', 'utf8'));
};

const saveUsers = (users) => {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

// LOGIN
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    if (password.includes("Admin")) {
      res.redirect('/dashboard.html');
    } else {
      res.redirect('/home.html');
    }
  } else {
    res.send(`
      <h1>Accesso Negato</h1>
      <p>Credenziali errate.</p>
      <a href="/">Torna al login</a>
    `);
  }
});

// REGISTRAZIONE
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  const exists = users.find(u => u.username === username);

  if (exists) {
    res.send(`
      <h1>Errore</h1>
      <p>Username già registrato.</p>
      <a href="/">Torna indietro</a>
    `);
  } else {
    users.push({ username, password });
    saveUsers(users);
    res.send(`
      <h1>Registrazione Completata</h1>
      <p>Ora puoi accedere al sito.</p>
      <a href="/">Vai al login</a>
    `);
  }
});

// SERVER START
app.listen(PORT, () => {
  console.log(`✅ Server attivo su http://localhost:${PORT}`);
});
