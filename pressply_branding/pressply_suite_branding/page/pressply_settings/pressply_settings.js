frappe.pages['pressply-settings'].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: __('Pressply Suite Settings'),
    single_column: true
  });

  function load_target() {
    if (frappe.set_route) {
      frappe.set_route('erpnext-settings');
      setTimeout(() => {
        try {
          history.replaceState({}, '', '/app/pressply-settings');
        } catch (_) {}
      }, 200);
    }
  }

  load_target();
};

frappe.pages['pressply-settings'].on_page_show = function () {
  try { history.replaceState({}, '', '/app/pressply-settings'); } catch (_) {}
}; 