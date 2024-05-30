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
              <button class="add-to-cart-btn">Agregar al Carrito</button>
            <div class="product-details">
                <div class="counter-container">
                    <button class="counter-btn decrement">-</button>
                    <input type="number" class="counter-value" value="1">
                    <button class="counter-btn increment">+</button>
                </div>
                <p>${product.description}</p>
                <ul>
                    ${product.features.split(',').map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        `;

    productCard.querySelector('.add-to-cart-btn').addEventListener('click', () => {
      const counterValue = parseInt(productCard.querySelector('.counter-value').value);
      addToCart(product.name, counterValue, product.price);
    });

    productCard.addEventListener('click', (event) => {
      if (!event.target.classList.contains('counter-btn') && !event.target.classList.contains('add-to-cart-btn')) {
        productCard.classList.toggle('expanded');
      }
    });

    productList.appendChild(productCard);

    productCard.querySelector('.decrement').addEventListener('click', () => {
      const counterValueElement = productCard.querySelector('.counter-value');
      let currentValue = parseInt(counterValueElement.value);
      if (currentValue > 0) {
        counterValueElement.value = currentValue - 1;
      }
    });

    productCard.querySelector('.increment').addEventListener('click', () => {
      const counterValueElement = productCard.querySelector('.counter-value');
      let currentValue = parseInt(counterValueElement.value);
      counterValueElement.value = currentValue + 1;
    });
  });

  document.addEventListener('click', (event) => {
    const expandedCards = document.querySelectorAll('.product-card.expanded');
    expandedCards.forEach(card => {
      if (!card.contains(event.target) && !event.target.classList.contains('add-to-cart-btn')) {
        card.classList.remove('expanded');
      }
    });
  });
}

function addToCart(productName, quantity, price) {
  alert(`${quantity} ${productName} agregado al carrito`);
  const productIndex = cart.findIndex(item => item.name === productName);

  if (productIndex !== -1) {
    console.log("Agregando cantidad al carrito");
    cart[productIndex].quantity += quantity;
  } else {
    console.log("Agregando nuevo producto al carrito");
    cart.push({ name: productName, price: price, quantity: quantity });
  }

  updateCart();
}

function updateCart() {
  const cartContainer = document.getElementById('cart-container');
  cartContainer.innerHTML = '';

  const ul = document.createElement('ul');
  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
        <strong>${item.name}:   Total: $${(item.price * item.quantity).toFixed(2)}</strong> <br>
        Cantidad: ${item.quantity}       Precio unitario: $${item.price.toFixed(2)}<br>      
      `;
    ul.appendChild(li);
  });

  cartContainer.appendChild(ul);
}

function ShowCart() {
  const cartContainer = document.getElementById('cart-container');
  cartContainer.innerHTML = ''; // Limpia el contenido del carrito antes de añadir nuevo contenido

  if (cart.length === 0) {
    cartContainer.innerHTML = '<h2>No hay productos en el carrito.</h2>';
  } else {
    let total = 0;
    const ul = document.createElement('ul');

    for (let item of cart) {
      total += item.price * item.quantity;

      const li = document.createElement('li');
      li.innerHTML = `
          <strong>${item.name}</strong> - Total: $${(item.price * item.quantity).toFixed(2)}<br>
          Cantidad: ${item.quantity}<br>
          Precio unitario: $${item.price.toFixed(2)}
        `;
      ul.appendChild(li);
    }

    cartContainer.appendChild(ul);

    const totalProd = document.createElement('h3');
    totalProd.textContent = `Total del carrito: $${total.toFixed(2)}`;
    cartContainer.appendChild(totalProd);
  }

  cartContainer.style.display = cartContainer.style.display === 'none' || cartContainer.style.display === '' ? 'block' : 'none';
}

// Añadir un event listener al documento para cerrar el carrito cuando se hace clic fuera del carrito
document.addEventListener('click', (event) => {
  const cartContainer = document.getElementById('cart-container');
  const cartIcon = document.getElementById('cart');

  if (!cartContainer.contains(event.target) && event.target !== cartIcon) {
    cartContainer.style.display = 'none';
  }
});

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
            <button class="add-to-cart-btn">Agregar al Carrito</button>
            <div class="product-details">
                <div class="counter-container">
                    <button class="counter-btn decrement">-</button>
                    <input type="number" class="counter-value" value="1">
                    <button class="counter-btn increment">+</button>
                </div>
                <p>${product.description}</p>
                <ul>
                    ${product.features.split(',').map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        `;

      productCard.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        const counterValue = parseInt(productCard.querySelector('.counter-value').value);
        addToCart(product.name, counterValue, product.price);
      });

      productCard.addEventListener('click', (event) => {
        if (!event.target.classList.contains('counter-btn') && !event.target.classList.contains('add-to-cart-btn')) {
          productCard.classList.toggle('expanded');
        }
      });

      productList.appendChild(productCard);

      productCard.querySelector('.decrement').addEventListener('click', () => {
        const counterValueElement = productCard.querySelector('.counter-value');
        let currentValue = parseInt(counterValueElement.value);
        if (currentValue > 0) {
          counterValueElement.value = currentValue - 1;
        }
      });

      productCard.querySelector('.increment').addEventListener('click', () => {
        const counterValueElement = productCard.querySelector('.counter-value');
        let currentValue = parseInt(counterValueElement.value);
        counterValueElement.value = currentValue + 1;
      });
    }
  });

  document.addEventListener('click', (event) => {
    const expandedCards = document.querySelectorAll('.product-card.expanded');
    expandedCards.forEach(card => {
      if (!card.contains(event.target) && !event.target.classList.contains('add-to-cart-btn')) {
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

function ShowContact(id) {
  const section = document.getElementById(id);
  if (section.style.display != "block") {
    section.style.display = "block";
  } else {
    section.style.display = "none";
  };
}