import frappe


def clear_cache():
    try:
        frappe.clear_cache()
    except Exception:
        # During install/update, site context may not be fully ready. Ignore.
        pass 