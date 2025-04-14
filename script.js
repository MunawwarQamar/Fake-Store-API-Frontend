const productCardsContainer = document.getElementById("productCards");
const modal = document.getElementById("productModal");
const modalInfo = document.getElementById("modalInfo");
const closeModal = document.getElementById("closeModal");
const searchInput = document.getElementById("searchInput");
const modalAddToCartBtn = document.querySelector(".add-to-cart");

const paginationControls = document.getElementById("paginationControls");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageNumber = document.getElementById("pageNumber");

let allProducts = [];
let currentPage = 1;
const productsPerPage = 6; // عدد المنتجات في كل صفحة

window.onload = () => {
  fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => {
      allProducts = data;
      displayProducts(data);
    })
    .catch(error => console.error('Error fetching data:', error));
};

function displayProducts(products) {
  productCardsContainer.innerHTML = "";

  if (products.length === 0) {
    productCardsContainer.innerHTML = "<p style='text-align:center; font-size:18px; color:#666;'>No products found for your search.</p>";
  } else {
    // حساب الفهرس للمنتجات التي سيتم عرضها بناءً على الصفحة الحالية
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = products.slice(startIndex, endIndex);

    productsToDisplay.forEach(product => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
        <button onclick="openModal(${product.id})">View Details</button>
      `;

      productCardsContainer.appendChild(card);
    });

    // تحديث رقم الصفحة
    pageNumber.textContent = `Page ${currentPage}`;
  }

  // تمكين أو تعطيل الأزرار بناءً على الصفحة الحالية
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage * productsPerPage >= products.length;
}

function openModal(productId) {
  const product = allProducts.find(p => p.id === productId);

  modalInfo.innerHTML = `
    <h2>${product.title}</h2>
    <img src="${product.image}" alt="${product.title}">
    <p><strong>Price:</strong> <span style="color: var(--accent-color); font-weight:bold;">$${product.price}</span></p>
    <p><strong>Description:</strong> ${product.description}</p>
    <p><strong>Category:</strong> ${product.category}</p>
  `;

  modal.style.display = "block";

  modalAddToCartBtn.onclick = () => {
    addToCart(productId);
  };
}

closeModal.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(product =>
    product.title.toLowerCase().includes(query)
  );

  currentPage = 1; // إعادة تعيين الصفحة إلى الأولى عند البحث
  displayProducts(filtered);
});

function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if product is already in cart
  const exists = cart.find(item => item.id === productId);
  if (exists) {
    exists.quantity += 1; // Increase quantity if product exists
  } else {
    product.quantity = 1; // Set initial quantity to 1 if product does not exist
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart)); // Update cart in localStorage
  showToast();
  displayCartItems(); // Re-render cart items
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

document.getElementById("categoryFilter").addEventListener("change", function() {
  const category = this.value.toLowerCase();
  const filtered = category ? allProducts.filter(product => product.category.toLowerCase() === category) : allProducts;
  
  currentPage = 1; // إعادة تعيين الصفحة إلى الأولى عند تغيير الفئة
  displayProducts(filtered);
});

// التعامل مع التنقل بين الصفحات
prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayProducts(allProducts);
  }
});

nextPageBtn.addEventListener("click", () => {
  if (currentPage * productsPerPage < allProducts.length) {
    currentPage++;
    displayProducts(allProducts);
  }
});
