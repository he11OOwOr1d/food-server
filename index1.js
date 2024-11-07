const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
const collection = require('./config'); // Assuming this is your MongoDB collection config
const app = express();
const PORT = process.env.PORT || 3000;

// Default headers for fetch requests
const defaultHeaders = {
  'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)'
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// API Route to get restaurants data
app.get('/api/restaurants', async (req, res) => {
  try {
    const response = await fetch(
      "https://www.swiggy.com/dapi/restaurants/list/v5?lat=22.3008241&lng=73.1733127&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING", 
      { headers: defaultHeaders }
    );

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      res.status(response.status).send('Error fetching data');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// API Route to get restaurant menu
app.get('/api/menu/:resId', async (req, res) => {
  const { resId } = req.params; 
  const menuUrl = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.9905081&lng=76.9873477&restaurantId=${resId}`;

  try {
    const response = await fetch(menuUrl, { headers: defaultHeaders });

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data); 
    } else {
      res.status(response.status).send('Error fetching menu data');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Render login page
app.get('/login', (req, res) => {
  res.render("login");
});

// Render signup page
app.get('/signup', (req, res) => {
  res.render("signup");
});

// Handle signup
app.post('/signup', async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password
  };

  const existingUser = await collection.findOne({ name: data.name });

  if (existingUser) {
    res.status(400).send("User already exists");
  } else {
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPass;

    await collection.insertOne(data); // Assuming you want to insert a single user, use insertOne instead of insertMany
    res.status(201).send("User created successfully");
  }
});

// Handle login
app.post('/login', async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.username });

    if (!check) {
      return res.status(400).send("User not found");
    }

    const checkPass = await bcrypt.compare(req.body.password, check.password);

    if (checkPass) {
      res.render("home"); // Assuming this is a successful login page
    } else {
      res.status(400).send('Wrong password');
    }
  } catch (error) {
    res.status(400).send("Error logging in");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
