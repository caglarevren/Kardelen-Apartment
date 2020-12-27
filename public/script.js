// Main Variables
const cartInfo = document.querySelector('.cart-info');
const totalEl = document.getElementById('total');
const tbody = document.getElementById('tbody');

// Initially Getting Data From Local Storage
getFormLocalStorage();

// DOM Content Loaded
if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

function ready() {
  // Sepetten Gider Silme
  const removeCartItemButtons = document.getElementsByClassName('btn-danger');
  for (let i = 0; i < removeCartItemButtons.length; i++) {
    let button = removeCartItemButtons[i];
    button.addEventListener('click', removeCartItem);
  }

  // Miktar Değiştirme
  let quantityInputs = document.getElementsByClassName('cart-quantity-input');
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i];
    input.addEventListener('change', quantityChanged);
  }

  // Sepete Ekleme
  let addToCartButtons = document.getElementsByClassName('shop-item-button');
  for (let i = 0; i < addToCartButtons.length; i++) {
    let button = addToCartButtons[i];
    button.addEventListener('click', addToCartClicked);
  }

  document
    .getElementsByClassName('btn-purchase')[0]
    .addEventListener('click', purchaseClicked);
}

// Listeye Ekle
function purchaseClicked() {
  alert('Giderleriniz başarılı bir şekilde listeye eklendi');
  const cartItems = document.getElementsByClassName('cart-items')[0];
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }

  addFormLocalStorage();
  getFormLocalStorage();

  cartInfo.innerHTML = '';
  total.innerHTML = '0₺';
}

// Bilgileri Local Storage'a Ekleme
const addFormLocalStorage = (e) => {
  let formData = {
    fname: document.getElementById('fname').value,
    date: document.getElementById('date').value,
    textarea: document.getElementById('textarea').value,
  };
  localStorage.setItem('formData', JSON.stringify(formData));
};

// Bilgileri Local Storage'dan Alma
function getFormLocalStorage() {
  let total = JSON.parse(localStorage.getItem('total'));

  if (localStorage.getItem('formData')) {
    let { fname, date, textarea } = JSON.parse(
      localStorage.getItem('formData')
    );

    const tableEl = document.createElement('tr');
    tableEl.innerHTML = `
          <tr>
            <th scope="row"></th>
            <td>${fname}</td>
            <td>${date}</td>
            <td>${total}tl</td>
            <td>${textarea}</td>
          </tr>
  `;

    tbody.appendChild(tableEl);
  }
}

// Gider Silme Function
function removeCartItem(event) {
  const buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
}

// Miktar Değiştirme Function
function quantityChanged(event) {
  const input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

// Sepete Ekleme Function
function addToCartClicked(event) {
  const button = event.target;
  const shopItem = button.parentElement.parentElement;
  const title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
  const price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
  const imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;
  addItemToCart(title, price, imageSrc);
  updateCartTotal();
}

// Sepete Ekleme & Form Bilgilerini DOM'a yazma
function addItemToCart(title, price, imageSrc) {
  let cartRow = document.createElement('div');
  cartRow.classList.add('cart-row');
  let cartItems = document.getElementsByClassName('cart-items')[0];
  let cartItemNames = cartItems.getElementsByClassName('cart-item-title');
  for (let i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      alert('Bu gideri zaten sepete eklediniz!');
      return;
    }
  }
  let cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="177" height="100">
            <span class="cart-item-title d-none d-md-block">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">SİL</button>
        </div>
        `;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName('btn-danger')[0]
    .addEventListener('click', removeCartItem);
  cartRow
    .getElementsByClassName('cart-quantity-input')[0]
    .addEventListener('change', quantityChanged);

  cartInfo.innerHTML = `
      <div class="mt-3">
        <label for="fname" class="form-label">Ad Soyad</label>
        <input
          type="text"
          class="form-control"
          id="fname"
          placeholder="Ad Soyad"
          autocomplete="off"
        <div/>
      <div class="mt-3">
        <label for="textarea" class="form-label">Notunuz</label>
        <textarea class="form-control" id="textarea" rows="3 placeholder="Notunuzu yazınız"></textarea>
      </div>
      <label for="date" class="mt-3">Ödeme Tarihiniz:</label>
      <input type="date" id="date" name="date" class="ml-2" />
    `;
}

// Toplam Fiyat Hesaplama
function updateCartTotal() {
  let cartItemContainer = document.getElementsByClassName('cart-items')[0];
  let cartRows = cartItemContainer.getElementsByClassName('cart-row');
  let total = 0;
  for (let i = 0; i < cartRows.length; i++) {
    let cartRow = cartRows[i];
    let priceElement = cartRow.getElementsByClassName('cart-price')[0];
    let quantityElement = cartRow.getElementsByClassName(
      'cart-quantity-input'
    )[0];
    let price = parseFloat(priceElement.innerText.replace('₺', ''));
    let quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName('cart-total-price')[0].innerText =
    total + '₺';

  // Total Fiyatı Local Storage'a Kaydetme
  localStorage.setItem('total', JSON.stringify(total));
}
