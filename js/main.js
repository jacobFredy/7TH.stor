document.addEventListener("DOMContentLoaded", () => {
  const productRow = document.querySelector(".product-row");
  const cartCount = document.getElementById("cart-count");
  let cart = [];

  // --- Load products ---
  fetch("data/products.json")
    .then(res => res.json())
    .then(products => {
      products.forEach(product => {
        const card = document.createElement("div");
        card.className = "card reveal";

        // images slider html
        let imagesHTML = product.images.map((img, idx) =>
          `<img src="${img}" class="${idx===0?'visible':'hidden'}">`
        ).join("");

        if(product.images.length > 1){
          imagesHTML += `<div class="arrow left">&#10094;</div><div class="arrow right">&#10095;</div>`;
        }

        card.innerHTML = `
          <div class="badge">NEW</div>
          <div class="sale">-20%</div>
          <div class="wishlist">♡</div>
          <a class="product-images">${imagesHTML}</a>
          <h3>${product.name}</h3>
          <p class="price">${product.price}₴</p>
          <div class="quick-add" data-id="${product.id}">Quick add</div>
        `;
        productRow.appendChild(card);

        // slider
        if(product.images.length > 1){
          const slider = card.querySelector(".product-images");
          const imgs = slider.querySelectorAll("img");
          let current = 0;
          const showImage = index => {
            imgs.forEach((img, i)=>{
              img.classList.toggle("visible", i===index);
              img.classList.toggle("hidden", i!==index);
            });
          }
          slider.querySelector(".arrow.left").addEventListener("click", e=>{
            e.stopPropagation();
            current = (current - 1 + imgs.length) % imgs.length;
            showImage(current);
          });
          slider.querySelector(".arrow.right").addEventListener("click", e=>{
            e.stopPropagation();
            current = (current + 1) % imgs.length;
            showImage(current);
          });
        }

      });

      // Quick add
      document.querySelectorAll(".quick-add").forEach(btn => {
        btn.addEventListener("click", e=>{
          const id = e.target.dataset.id;
          const prod = products.find(p=>p.id==id);
          cart.push(prod);
          cartCount.textContent = cart.length;
          showToast(`${prod.name} додано в корзину`);
        });
      });

      // Reveal animations
      const reveals = document.querySelectorAll(".reveal");
      window.addEventListener("scroll", ()=>{
        reveals.forEach(el=>{
          const windowHeight = window.innerHeight;
          const elementTop = el.getBoundingClientRect().top;
          const elementVisible = 150;
          if(elementTop < windowHeight - elementVisible){
            el.classList.add("active");
          } else {
            el.classList.remove("active");
          }
        });
      });

    });

  // Toast
  function showToast(msg){
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.style.display = "block";
    setTimeout(()=>{ toast.style.display="none"; },3000);
  }

  // Sidebar hover
  const sidebar = document.getElementById("sidebar");
  const logo = document.getElementById("logo");
  let timeout;
  function openSidebar(){ clearTimeout(timeout); sidebar.style.left='0'; }
  function closeSidebar(){ timeout = setTimeout(()=>{ sidebar.style.left='-300px'; },200); }
  logo.addEventListener('mouseenter', openSidebar);
  logo.addEventListener('mouseleave', closeSidebar);
  sidebar.addEventListener('mouseenter', openSidebar);
  sidebar.addEventListener('mouseleave', closeSidebar);
});