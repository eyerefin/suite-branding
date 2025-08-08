frappe.pages['pressply-integrations'].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: __('Pressply Suite Integrations'),
    single_column: true
  });

  try {
    const head = wrapper.closest('.page-container')?.querySelector('.page-head');
    if (head) head.style.display = 'none';
  } catch (_) {}

  try {
    wrapper.style.padding = '0';
    const main = wrapper.querySelector('.layout-main-section');
    if (main) main.style.padding = '0';
  } catch (_) {}

  const src = '/app/erpnext-integrations' + window.location.search + window.location.hash;
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.style.width = '100%';
  iframe.style.height = '100vh';
  iframe.style.border = '0';
  iframe.setAttribute('referrerpolicy', 'same-origin');

  const body = wrapper.querySelector('.page-body') || wrapper;
  body.innerHTML = '';
  body.appendChild(iframe);
};

frappe.pages['pressply-integrations'].on_page_show = function () {
  try { history.replaceState({}, '', '/app/pressply-integrations'); } catch (_) {}
}; 