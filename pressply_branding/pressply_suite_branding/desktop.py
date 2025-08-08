from frappe import _

def get_data():
    return [
        {
            "label": _("Pressply Suite"),
            "items": [
                {
                    "type": "link",
                    "label": _("Pressply Suite Settings"),
                    "route": "/app/pressply-settings",
                    "icon": "octicon octicon-gear",
                },
                {
                    "type": "link",
                    "label": _("Pressply Suite Integrations"),
                    "route": "/app/pressply-integrations",
                    "icon": "octicon octicon-link",
                },
            ],
        }
    ] 