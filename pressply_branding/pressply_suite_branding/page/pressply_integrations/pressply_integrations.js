frappe.pages['pressply-integrations'].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: __('Pressply Suite Integrations'),
    single_column: true
  });

  function try_mount_source_page() {
    const src = frappe.pages && frappe.pages['erpnext-integrations'];
    if (src && typeof src.on_page_load === 'function') {
      try {
        const body = wrapper.querySelector('.page-body') || wrapper;
        if (body) body.innerHTML = '';
        src.on_page_load(wrapper);
        if (typeof src.on_page_show === 'function') {
          try { src.on_page_show(wrapper); } catch (_) {}
        }
        return true;
      } catch (e) {
        // ignore; will retry
      }
    }
    return false;
  }

  if (!try_mount_source_page()) {
    let attempts = 0;
    const maxAttempts = 20;
    const timer = setInterval(() => {
      attempts += 1;
      if (try_mount_source_page() || attempts >= maxAttempts) {
        clearInterval(timer);
      }
    }, 250);
  }
};

frappe.pages['pressply-integrations'].on_page_show = function () {
  try { history.replaceState({}, '', '/app/pressply-integrations'); } catch (_) {}
}; 