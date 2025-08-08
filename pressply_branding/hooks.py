app_name = "pressply_branding"
app_title = "Pressply Suite Branding"
app_publisher = "Pressply"
app_description = "Rename ERPNext labels and add route aliases to match Pressply Suite branding"
app_email = "support@pressply.com"
app_license = "MIT"

# Include JS on Desk so route aliases and relabeling work
# Use built asset path from build.json output so it loads from /assets
app_include_js = [
    "/assets/pressply_branding/js/pressply_branding.js",
]

# Hook entry points
after_install = "pressply_branding.utils.clear_cache"
on_update = "pressply_branding.utils.clear_cache" 