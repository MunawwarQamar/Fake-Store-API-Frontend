const cartItemsContainer = document.getElementById("cartItems");
const totalPriceElement = document.getElementById("totalPrice");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filteredCart = cart.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );
  displayCartItems(filteredCart);
});

function displayCartItems(cartItems = cart) {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = "<p style='text-align:center; font-size:18px; color:#666;'>No items found matching your search.</p>";
    totalPriceElement.textContent = "";
    return;
  }

  cartItems.forEach((product, index) => {
    total += product.price * product.quantity; // Update total price based on quantity

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>Price: $${product.price}</p>
      <p>Quantity: ${product.quantity}</p>
      <p>Total: $${(product.price * product.quantity).toFixed(2)}</p> <!-- Showing total for each product -->
      <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsContainer.appendChild(card);
  });

  totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = cart[index];

  if (product.quantity > 1) {
    product.quantity -= 1; // Decrease quantity if it's greater than 1
  } else {
    cart.splice(index, 1); // Remove product if quantity is 1
  }

  localStorage.setItem("cart", JSON.stringify(cart)); // Update cart in localStorage
  displayCartItems(); // Refresh cart display after update
}

document.getElementById("clearCartBtn").onclick = () => {
  if (confirm("Are you sure you want to clear the cart?")) {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCartItems();
  }
};

displayCartItems();
