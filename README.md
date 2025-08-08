# Pressply Suite Branding (Frappe App)

Rename ERPNext UI labels and provide friendly route aliases to match your branding ("Pressply Suite") on ERPNext v15.

## What this app does
- Renames visible labels:
  - "ERPNext Settings" → "Pressply Suite Settings"
  - "ERPNext Integrations" → "Pressply Suite Integrations"
- Adds desk route aliases:
  - `/app/pressply-settings` → `/app/erpnext-settings`
  - `/app/pressply-integration` and `/app/pressply-integrations` → `/app/erpnext-integration`

This is non-invasive (no core file changes). You can uninstall any time.

## Requirements
- ERPNext v15 / Frappe v15
- Access to your bench (on the server)

## Install (on your ERPNext server)
1) Push this repo to a git remote you control (e.g. GitHub/GitLab) so your server can fetch it.

2) On the server, from your bench directory:

```bash
bench get-app https://YOUR_GIT_REMOTE_URL.git
bench --site your.site install-app pressply_branding
bench build
bench clear-cache
bench restart
```

Replace `https://YOUR_GIT_REMOTE_URL.git` with the repo URL, and `your.site` with your site name.

## Verify
- Open `/app/erpnext-settings` and `/app/erpnext-integration`. The page titles and menu items should read "Pressply Suite …".
- Try `/app/pressply-settings` or `/app/pressply-integrations`; they should redirect to the originals.

## Uninstall
```bash
bench --site your.site uninstall-app pressply_branding
bench build
bench clear-cache
bench restart
```

## Notes
- This app uses translation overrides for label renaming and a tiny JS helper for route aliasing and UI relabeling where needed.
- Safe to use across updates; if ERPNext changes the original labels, update `translations/en.csv` accordingly. 