const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dockerMailserver = require('./dockerMailserver');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/status', async (req, res) => {
  try {
    const status = await dockerMailserver.getServerStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Unable to connect to docker-mailserver' });
  }
});

// Endpoint for retrieving email accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await dockerMailserver.getAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve accounts' });
  }
});

// Endpoint for adding a new email account
app.post('/api/accounts', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = await dockerMailserver.addAccount(email, password);
    res.status(201).json({ message: 'Account created successfully', email });
  } catch (error) {
    res.status(500).json({ error: 'Unable to create account' });
  }
});

// Endpoint for deleting an email account
app.delete('/api/accounts/:email', async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    await dockerMailserver.deleteAccount(email);
    res.json({ message: 'Account deleted successfully', email });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete account' });
  }
});

// Endpoint for updating an email account password
app.put('/api/accounts/:email/password', async (req, res) => {
  try {
    const { email } = req.params;
    const { password } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    await dockerMailserver.updateAccountPassword(email, password);
    res.json({ message: 'Password updated successfully', email });
  } catch (error) {
    res.status(500).json({ error: 'Unable to update password' });
  }
});

// Endpoint for retrieving aliases
app.get('/api/aliases', async (req, res) => {
  try {
    const aliases = await dockerMailserver.getAliases();
    res.json(aliases);
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve aliases' });
  }
});

// Endpoint for adding an alias
app.post('/api/aliases', async (req, res) => {
  try {
    const { source, destination } = req.body;
    if (!source || !destination) {
      return res.status(400).json({ error: 'Source and destination are required' });
    }
    await dockerMailserver.addAlias(source, destination);
    res.status(201).json({ message: 'Alias created successfully', source, destination });
  } catch (error) {
    res.status(500).json({ error: 'Unable to create alias' });
  }
});

// Endpoint for deleting an alias
app.delete('/api/aliases/:source', async (req, res) => {
  try {
    const { source, destination } = req.params;
    if (!source) {
      return res.status(400).json({ error: 'Source is required' });
    }
    
    if (!destination) {
      return res.status(400).json({ error: 'Destination is required' });
    }
    await dockerMailserver.deleteAlias(source, destination);
    res.json({ message: 'Alias deleted successfully', source, destination });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete alias' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Log debug status
  if (process.env.DEBUG_DOCKER === 'true') {
    console.log('🐞 Docker debug mode is ENABLED');
  }
});