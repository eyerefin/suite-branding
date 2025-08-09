frappe.pages['pressply-integrations'].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: __('Pressply Suite Integrations'),
    single_column: true
  });

  // Immediately navigate to the native ERPNext Integrations page to load content
  try {
    if (frappe.set_route) {
      setTimeout(() => frappe.set_route('erpnext-integrations'), 0);
    }
  } catch (_) {}
};

frappe.pages['pressply-integrations'].on_page_show = function () {
  try { history.replaceState({}, '', '/app/pressply-integrations'); } catch (_) {}
}; 