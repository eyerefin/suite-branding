frappe.pages['pressply-settings'].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: __('Pressply Suite Settings'),
    single_column: true
  });

  // Immediately navigate to the native ERPNext Settings page to load its content
  try {
    if (frappe.set_route) {
      setTimeout(() => frappe.set_route('erpnext-settings'), 0);
    }
  } catch (_) {}
};

frappe.pages['pressply-settings'].on_page_show = function () {
  try { history.replaceState({}, '', '/app/pressply-settings'); } catch (_) {}
}; 