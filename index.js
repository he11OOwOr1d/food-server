const express = require('express');
const cors = require('cors');
const fetch = require('cross-fetch');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./src/config'); 
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(cors()); 


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.get('/api/restaurants', async (req, res) => {
  try {
    const response = await fetch(
      "https://www.swiggy.com/dapi/restaurants/list/v5?lat=22.3008241&lng=73.1733127&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING",
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
      }
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

app.get('/api/menu/:resId', async (req, res) => {
  const { resId } = req.params;
  const menuUrl = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.9905081&lng=76.9873477&restaurantId=${resId}`;

  try {
    const response = await fetch(menuUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
      }
    });

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



app.post('/signup', async (req, res) => {
  console.log('Received signup data:', req.body);

  const data = {
    name: req.body.username,
    password: req.body.password
  };
  
  if (!data.password || !data.name) {
    return res.status(400).send('Username and password are required');
  }

  const existingUser = await collection.findOne({ name: data.name });

  if (existingUser) {
    res.status(400).send("User already exists");
  } else {
    try {
      const saltRounds = 10;
      const hashedPass = await bcrypt.hash(data.password, saltRounds);
      data.password = hashedPass;

      await collection.create(data);
      console.log('User created:', data); 

      res.status(201).send('User created successfully');
    } catch (err) {
      console.error('Error hashing password:', err);
      res.status(500).send('Internal Server Error');
    }
  }
});

app.post('/login', async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.username });
    if (!check) {
      res.status(400).send("User not found");
    } else {
      const checkPass = await bcrypt.compare(req.body.password, check.password);
      if (checkPass) {
        console.log(data); 
      } else {
        res.status(400).send('Wrong password');
      }
    }
  } catch (error) {
    res.status(400).send("Wrong details");
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
