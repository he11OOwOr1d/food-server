const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const defaultHeaders = {
  'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)'
};

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
