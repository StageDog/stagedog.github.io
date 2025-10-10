document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('click', function () {
      img.classList.toggle('enlarged');
    });
  });
});
