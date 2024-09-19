const express = require('express');
const cors = require('cors');
const fetch = require('cross-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); 
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

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
