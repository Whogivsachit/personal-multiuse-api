const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const axios = require('axios');
const { auth } = require('../../middleware/authenticationToken.js');
const { cache } = require('../../middleware/cache.js');


// Globals
const baseUrl = 'https://hoponenetworks.com';
const categoryClass = ".sidebar>.panel-sidebar:first>.list-group>a";
const productClass = ".product";
const productNameClass = ".product>header>span";
const productDescriptionClass = ".product-desc>ul>li>span";
const productPriceClass = ".price";
const instockClass = "disabled";
const orderlinkClass = ".product>footer>a";

// Fetch all categories
async function fetchCategories() {
  const response = await axios.get(baseUrl + '/whmcs/cart.php');
  const $ = cheerio.load(response.data);
  const categories = $(categoryClass);
  const categoriesArray = [];

  categories.each((i, category) => {
    const $category = $(category);
    const name = $category.text().trim();
    const url = $(category).attr('href');
    categoriesArray.push({ name, url });
  });
  return categoriesArray;
}

// Fetch all products
async function fetchProducts(url) {
    const response = await axios.get(baseUrl + url);
    const $ = cheerio.load(response.data);
  
    // Map the products
    const products = $(productClass).map((index, element) => {
      const category = url.replace('/whmcs/', '');
      const name = $(element).find(productNameClass).text().trim();
      const description = $(element).find(productDescriptionClass).text().trim();
      const price = $(element).find(productPriceClass).text().replace(/\n/g, '').split("$")[1];
      const inStock = !$(element).find(orderlinkClass).hasClass(instockClass);
      const orderLink = $(element).find(orderlinkClass).attr('href');
      return { category, name, description, price, inStock, orderLink}
    }).get();
    return products;
  }


router.get('/', auth, cache, async (req, res) => {
    const categoryUrls = await fetchCategories(); // Get all categories
    const promises = categoryUrls.map((url) => fetchProducts(url.url)); // Map the categories to fetchProducts
    const allProducts = await Promise.all(promises); // Wait for all promises to resolve
    const mergedProducts = [].concat(...allProducts); // Merge all products into one array

    res.cache = {status: res.statusCode, body: mergedProducts};
    res.json({status: res.statusCode, body: mergedProducts}); // Return the products  
});


router.get('/categories', auth, cache, async (req, res) => {
    const categories = await fetchCategories();
  
    res.cache = {status: res.statusCode, body: categories};
    res.json({status: res.statusCode, body: categories});
});

router.get('/:category', auth, cache, async (req, res) => { 
    const products = await fetchProducts('/store/' + req.params.category);
    
    res.cache = {status: res.statusCode, body: products};
    res.json({status: res.statusCode, body: products});
});


module.exports = router;