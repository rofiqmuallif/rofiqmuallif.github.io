/* Update these values when the class administrator changes access credentials. */
const LOGIN_CREDENTIALS = Object.freeze({
  username: 'armata',
  password: '2024'
});
const DESTINATION_URL = '../kelas/';

const form = document.querySelector('#login-form');
const submitButton = form.querySelector('.submit-button');
const passwordInput = document.querySelector('#password');
const passwordToggle = document.querySelector('.password-toggle');

passwordToggle.addEventListener('click', () => {
  const showing = passwordInput.type === 'text';
  passwordInput.type = showing ? 'password' : 'text';
  passwordToggle.setAttribute('aria-label', showing ? 'Tampilkan password' : 'Sembunyikan password');
  passwordToggle.setAttribute('aria-pressed', String(!showing));
  passwordToggle.querySelector('i').className = showing ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
});

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.classList.toggle('is-loading', isLoading);
  submitButton.querySelector('.button-text').textContent = isLoading ? 'Memeriksa akses...' : 'Masuk';
}

function showError(title, message) {
  Swal.fire({ icon: 'error', title, text: message, confirmButtonText: 'Coba lagi' });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const username = form.username.value.trim();
  const password = form.password.value;

  if (!username || !password) {
    showError('Data belum lengkap', 'Masukkan username dan password untuk melanjutkan.');
    return;
  }

  setLoading(true);
  window.setTimeout(() => {
    const isValid = username === LOGIN_CREDENTIALS.username && password === LOGIN_CREDENTIALS.password;
    if (isValid) {
      sessionStorage.setItem('tiAClassAccess', 'granted');
      window.location.assign(DESTINATION_URL);
      return;
    }
    setLoading(false);
    showError('Login gagal', 'Username atau password yang Anda masukkan tidak sesuai.');
    passwordInput.focus();
  }, 900);
});
