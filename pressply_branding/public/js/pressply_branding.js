/*
  Pressply Suite Branding helper
  - Route aliases: /app/pressply-settings, /app/pressply-integration(s)
  - Fallback DOM relabeling (translations cover most cases)
*/
(function () {
  const aliasMap = {
    "pressply-settings": "erpnext-settings",
    "pressply-integration": "erpnext-integration",
    "pressply-integrations": "erpnext-integration",
  };

  function getDeskSlug() {
    const path = window.location.pathname || "";
    const parts = path.split("/").filter(Boolean); // ["app", "<slug>", ...]
    if (parts[0] !== "app") return "";
    return parts[1] || "";
  }

  function normalizeAliasRoute() {
    const slug = getDeskSlug();
    const target = aliasMap[slug];
    if (!target) return;

    const to = `/app/${target}` + window.location.search + window.location.hash;
    if (window.location.pathname !== `/app/${target}`) {
      try {
        window.history.replaceState({}, "", to);
        // Reload to let Frappe route to the correct view if needed
        setTimeout(() => window.location.reload(), 0);
      } catch (e) {
        window.location.assign(to);
      }
    }
  }

  function relabelUI() {
    const replacements = [
      {
        selector:
          'a[href="/app/erpnext-settings"], a[href="#erpnext-settings"], [data-route="erpnext-settings"]',
        text: "Pressply Suite Settings",
      },
      {
        selector:
          'a[href="/app/erpnext-integration"], a[href="#erpnext-integration"], [data-route="erpnext-integration"]',
        text: "Pressply Suite Integrations",
      },
      {
        selector: 'h3, .page-title, .ellipsis[title="ERPNext Settings"]',
        text: "Pressply Suite Settings",
      },
      {
        selector: 'h3, .page-title, .ellipsis[title="ERPNext Integrations"]',
        text: "Pressply Suite Integrations",
      },
    ];

    replacements.forEach((r) => {
      document.querySelectorAll(r.selector).forEach((el) => {
        // Avoid clobbering if already updated
        if (el.textContent && el.textContent.trim().length) {
          el.textContent = r.text;
        } else if (el.getAttribute && el.getAttribute("title")) {
          el.setAttribute("title", r.text);
        }
      });
    });
  }

  // Run once on load and also on SPA navigation
  document.addEventListener("DOMContentLoaded", () => {
    normalizeAliasRoute();
    relabelUI();
    // Keep trying after SPA updates
    setInterval(relabelUI, 2000);
  });

  window.addEventListener("popstate", normalizeAliasRoute);
  window.addEventListener("hashchange", normalizeAliasRoute);
})(); 