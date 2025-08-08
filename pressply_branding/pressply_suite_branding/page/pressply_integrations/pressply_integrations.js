frappe.pages['pressply-integrations'].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: __('Pressply Suite Integrations'),
    single_column: true
  });

  function load_target() {
    if (frappe.set_route) {
      frappe.set_route('erpnext-integrations');
      setTimeout(() => {
        try {
          history.replaceState({}, '', '/app/pressply-integrations');
        } catch (_) {}
      }, 200);
    }
  }

  load_target();
};

frappe.pages['pressply-integrations'].on_page_show = function () {
  try { history.replaceState({}, '', '/app/pressply-integrations'); } catch (_) {}
}; 