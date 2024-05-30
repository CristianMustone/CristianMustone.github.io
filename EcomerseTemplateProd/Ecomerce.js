const API_URL = 'https://script.google.com/macros/s/AKfycbw2XI0yJZ12yxk2cCnfxqnbSbi1c2FvHgfFgECJhlkxoiQR6F_R6rBk8sD0O_qHYK9Htw/exec';
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
});

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    displayProducts(data);
    displayOfertas(data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function displayProducts(products) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
              <img src="${product.imageURL}" alt="Imagen" class="img_prod">
              <h3>${product.name}</h3>
              <p>$${product.price}</p>
            <div class="product-details">
                <p>${product.description}</p>
                <ul>
                    ${product.features.split(',').map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        `;
    productCard.addEventListener('click', (event) => {
      productCard.classList.toggle('expanded');
    });

    productList.appendChild(productCard);
  });

  document.addEventListener('click', (event) => {
    const expandedCards = document.querySelectorAll('.product-card.expanded');
    expandedCards.forEach(card => {
      if (!card.contains(event.target)) {
        card.classList.remove('expanded');
      }
    });
  });
}

function scrollProductsLeft(idscroll) {
  var container = document.getElementById(idscroll);
  container.scrollBy({
    left: -container.clientWidth * 0.5,
    behavior: 'smooth'
  });
}

function scrollProductsRight(idscroll) {
  var container = document.getElementById(idscroll);
  container.scrollBy({
    left: container.clientWidth * 0.5,
    behavior: 'smooth'
  });
}

function displayOfertas(products) {
  const productList = document.getElementById('product-oferta');
  productList.innerHTML = '';

  products.forEach(product => {
    if (product.oferta === 'si') {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
            <img src="${product.imageURL}" alt="Imagen" class="img_prod">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <div class="product-details">
                <p>${product.description}</p>
                <ul>
                    ${product.features.split(',').map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        `;
      productCard.addEventListener('click', (event) => {
        productCard.classList.toggle('expanded');
      });

      productList.appendChild(productCard);
    }
  });

  document.addEventListener('click', (event) => {
    const expandedCards = document.querySelectorAll('.product-card.expanded');
    expandedCards.forEach(card => {
      if (!card.contains(event.target)) {
        card.classList.remove('expanded');
      }
    });
  });
}

document.getElementById('search-bar').addEventListener('input', filterProducts);
document.getElementById('search-btn').addEventListener('click', filterProducts);

async function filterProducts() {
  console.log('filtrando productos');
  try {
    const response = await fetch(API_URL);
    const products = await response.json();
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}