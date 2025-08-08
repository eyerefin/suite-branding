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


def _patch_workspace_shortcuts():
    """Update existing Workspace shortcuts/links so they point to branded routes.
    This edits site data (safe and idempotent).
    """
    # Map old targets to branded routes
    target_to_branded = {
        "/app/erpnext-settings": "/app/pressply-settings",
        "erpnext-settings": "/app/pressply-settings",
        "/app/erpnext-integrations": "/app/pressply-integrations",
        "erpnext-integrations": "/app/pressply-integrations",
    }

    # Workspace Shortcut child table
    for ws in frappe.get_all("Workspace", pluck="name"):
        doc = frappe.get_doc("Workspace", ws)
        changed = False

        # Shortcuts
        for row in getattr(doc, "shortcuts", []) or []:
            route = (row.route or row.link_to) if hasattr(row, "route") else None
            if not route:
                continue
            branded = target_to_branded.get(route)
            if branded and getattr(row, "route", None) != branded:
                row.route = branded
                changed = True

        # Quick List (links)
        for row in getattr(doc, "links", []) or []:
            route = getattr(row, "route", None)
            if not route:
                continue
            branded = target_to_branded.get(route)
            if branded and row.route != branded:
                row.route = branded
                changed = True

        if changed:
            doc.flags.ignore_permissions = True
            doc.save()


def after_install():
    setup_pages()
    _patch_workspace_shortcuts()
    frappe.clear_cache()


def on_update():
    setup_pages()
    _patch_workspace_shortcuts()
    frappe.clear_cache() 