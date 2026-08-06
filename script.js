const toast = document.querySelector('.toast');
const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(window.toastTimeout);
  window.toastTimeout = window.setTimeout(() => toast.classList.remove('show'), 2600);
};

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      showToast(`IP ${value} скопирован`);
    } catch {
      showToast(`IP сервера: ${value}`);
    }
  });
});

document.querySelectorAll('[data-notice]').forEach((button) => button.addEventListener('click', () => showToast(button.dataset.notice)));

const onlineStatus = document.querySelector('#online-status');
const onlineDot = document.querySelector('#online-dot');
const updateOnline = async () => {
  try {
    const response = await fetch('https://api.mcstatus.io/v2/status/java/play.boltovka.ru');
    if (!response.ok) throw new Error('status unavailable');
    const data = await response.json();
    if (!data.online) throw new Error('server offline');
    onlineStatus.textContent = `${data.players.online} игроков онлайн`;
    onlineDot.classList.remove('offline');
  } catch {
    onlineStatus.textContent = 'сервер сейчас офлайн';
    onlineDot.classList.add('offline');
  }
};
updateOnline();
window.setInterval(updateOnline, 30000);

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? '×' : '☰';
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = '☰';
}));
