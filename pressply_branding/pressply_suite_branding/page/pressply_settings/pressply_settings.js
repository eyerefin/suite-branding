frappe.pages['pressply-settings'].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: __('Pressply Suite Settings'),
    single_column: true
  });

  // attempt to render ERPNext page content into our wrapper
  function try_mount_source_page() {
    const src = frappe.pages && frappe.pages['erpnext-settings'];
    if (src && typeof src.on_page_load === 'function') {
      try {
        // clear body
        const body = wrapper.querySelector('.page-body') || wrapper;
        if (body) body.innerHTML = '';
        // call source page loader using our wrapper
        src.on_page_load(wrapper);
        if (typeof src.on_page_show === 'function') {
          try { src.on_page_show(wrapper); } catch (_) {}
        }
        return true;
      } catch (e) {
        // silently ignore; will retry
      }
    }
    return false;
  }

  if (!try_mount_source_page()) {
    // poll briefly until ERPNext page module becomes available
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

frappe.pages['pressply-settings'].on_page_show = function () {
  try { history.replaceState({}, '', '/app/pressply-settings'); } catch (_) {}
}; 