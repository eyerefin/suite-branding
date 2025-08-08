import frappe


def customize_boot(bootinfo):
    """
    Tweak boot info to surface "Pressply Suite" branding.
    - Update app_name-like fields and default title when possible
    - Do not mutate translation keys; only values where appropriate
    """
    try:
        # Set a friendly default title on desk/website if not set
        if not getattr(bootinfo, "desk_settings", None):
            # Older versions may not have desk_settings; skip safely
            pass
        else:
            ds = bootinfo.desk_settings or {}
            if not ds.get("app_name") or ds.get("app_name") in ("ERPNext", "Frappe", "Frappe Framework"):
                ds["app_name"] = "Pressply Suite"
            bootinfo.desk_settings = ds

        # Some builds expose sysdefaults.app_name
        sysdefaults = getattr(bootinfo, "sysdefaults", {}) or {}
        if sysdefaults.get("app_name") in (None, "ERPNext", "Frappe", "Frappe Framework"):
            sysdefaults["app_name"] = "Pressply Suite"
            bootinfo.sysdefaults = sysdefaults

        # Overwrite document title template if available
        if getattr(bootinfo, "website_settings", None):
            ws = bootinfo.website_settings or {}
            title_prefix = ws.get("title_prefix") or ws.get("brand_html")
            if title_prefix in (None, "ERPNext", "Frappe", "Frappe Framework"):
                ws["title_prefix"] = "Pressply Suite"
                bootinfo.website_settings = ws

        # Update visible translations values where safe
        messages = getattr(bootinfo, "__messages", None)
        if isinstance(messages, dict):
            for k, v in list(messages.items()):
                if isinstance(v, str):
                    new_v = (
                        v.replace("ERPNext", "Pressply Suite")
                         .replace("Frappe Framework", "Pressply Suite")
                         .replace("Frappe", "Pressply Suite")
                    )
                    if new_v != v:
                        messages[k] = new_v
            bootinfo.__messages = messages
    except Exception:
        frappe.log_error(frappe.get_traceback(), "pressply_branding.boot.customize_boot")
    return bootinfo 