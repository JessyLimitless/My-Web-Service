document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const errorMessage = document.getElementById('error-message');
  
  if (urlParams.get('error')) {
      errorMessage.style.display = 'block';
  }
});
