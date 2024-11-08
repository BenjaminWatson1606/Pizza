const { Client } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Ajout du module cors

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors()); // Activer CORS pour toutes les routes

// Configuration de la connexion PostgreSQL
const client = new Client({
  host: '127.0.0.1',
  user: 'user',
  password: 'password',
  database: 'pizza_db',
  port: 5432,
});

// Connexion à la base de données PostgreSQL
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// 1. Sélectionner toutes les pizzas
app.get('/pizzas', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM pizzas');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching pizzas', err.stack);
    res.status(500).json({ error: 'Error fetching pizzas' });
  }
});

// 2. Sélectionner une pizza par ID
app.get('/pizzas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query('SELECT * FROM pizzas WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Pizza not found' });
    }
  } catch (err) {
    console.error('Error fetching pizza', err.stack);
    res.status(500).json({ error: 'Error fetching pizza' });
  }
});

// 3. Ajouter une nouvelle pizza
app.post('/pizzas', async (req, res) => {
  const { name, description, price, image_url } = req.body;
  if (!name || !price || !image_url) { 
    return res.status(400).json({ error: 'Name, price, and image_url are required' });
  }

  try {
    const result = await client.query(
      'INSERT INTO pizzas (name, description, price, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding pizza', err.stack);
    res.status(500).json({ error: 'Error adding pizza' });
  }
});

// 4. Mettre à jour une pizza existante
app.put('/pizzas/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url } = req.body; 
  if (!name || !price || !image_url) { 
    return res.status(400).json({ error: 'Name, price, and image_url are required' });
  }

  try {
    const result = await client.query(
      'UPDATE pizzas SET name = $1, description = $2, price = $3, image_url = $4 WHERE id = $5 RETURNING *',
      [name, description, price, image_url, id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Pizza not found' });
    }
  } catch (err) {
    console.error('Error updating pizza', err.stack);
    res.status(500).json({ error: 'Error updating pizza' });
  }
});

// 5. Supprimer une pizza
app.delete('/pizzas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query('DELETE FROM pizzas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Pizza not found' });
    }
  } catch (err) {
    console.error('Error deleting pizza', err.stack);
    res.status(500).json({ error: 'Error deleting pizza' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
