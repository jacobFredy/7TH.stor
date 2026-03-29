const form = document.getElementById('orderForm');

form.addEventListener('submit', function(e) {
  e.preventDefault(); // щоб не перезавантажувалась сторінка

  const data = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: data,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      alert('Дякуємо! Ваше замовлення відправлено.');
      form.reset();
    } else {
      alert('Виникла помилка. Спробуйте пізніше.');
    }
  }).catch(error => {
    alert('Помилка мережі. Спробуйте пізніше.');
  });
});