app_name = "pressply_branding"
app_title = "Pressply Suite Branding"
app_publisher = "Pressply"
app_description = "Rename ERPNext labels and add route aliases to match Pressply Suite branding"
app_email = "support@pressply.com"
app_license = "MIT"

# Include JS on Desk so route aliases and relabeling work
app_include_js = [
    "public/js/pressply_branding.js",
]

# Hook entry points
after_install = "pressply_branding.utils.clear_cache"
on_update = "pressply_branding.utils.clear_cache" 