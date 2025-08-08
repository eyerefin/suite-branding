import frappe


def ensure_page(name: str, title: str, module: str = "Pressply Suite Branding") -> None:
    if frappe.db.exists("Page", name):
        return
    doc = frappe.get_doc({
        "doctype": "Page",
        "page_name": name,
        "title": title,
        "module": module,
        "public": 0,
    })
    doc.insert(ignore_permissions=True)


def setup_pages():
    ensure_page("pressply-settings", "Pressply Suite Settings")
    ensure_page("pressply-integrations", "Pressply Suite Integrations")


def after_install():
    setup_pages()
    frappe.clear_cache()


def on_update():
    setup_pages()
    frappe.clear_cache() 