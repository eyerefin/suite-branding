/*
  Pressply Suite Branding helper
  - Route aliases: /app/pressply-settings, /app/pressply-integration(s)
  - Keep URL as pressply-* while loading ERPNext pages underneath
  - Fallback DOM relabeling (translations cover most cases) without stripping icons
*/
(function () {
  const aliasToTarget = {
    "pressply-settings": "erpnext-settings",
    "pressply-integration": "erpnext-integrations",
    "pressply-integrations": "erpnext-integrations",
  };

  let isNavigatingToTarget = false;
  let lastAliasUsed = null;

  function getDeskSlug() {
    const path = window.location.pathname || "";
    const parts = path.split("/").filter(Boolean); // ["app", "<slug>", ...]
    if (parts[0] !== "app") return "";
    return parts[1] || "";
  }

  function navigateAliasKeepingURL() {
    const slug = getDeskSlug();
    const target = aliasToTarget[slug];
    if (!target) return;

    // Avoid loops
    if (isNavigatingToTarget) return;

    lastAliasUsed = slug;
    isNavigatingToTarget = true;

    // Ask Frappe to load the actual page
    if (window.frappe && frappe.set_route) {
      frappe.set_route(target);
      // After navigation settles, restore the alias in the URL bar
      setTimeout(() => {
        const aliasUrl = `/app/${lastAliasUsed}` + window.location.search + window.location.hash;
        try {
          window.history.replaceState({}, "", aliasUrl);
        } catch (e) {
          // ignore
        }
        isNavigatingToTarget = false;
      }, 600);
    } else {
      // Fallback: direct replace, then reload (URL will switch back after load by our timer above)
      const to = `/app/${target}` + window.location.search + window.location.hash;
      try {
        window.history.replaceState({}, "", to);
        setTimeout(() => window.location.reload(), 0);
      } catch (e) {
        window.location.assign(to);
      }
    }
  }

  function relabelUI() {
    const updates = [
      {
        // Side menu / links: change label span only, preserve icon spans
        find: () => document.querySelectorAll('[data-route="erpnext-settings"]'),
        apply: (el) => {
          const label = el.querySelector('.label, .sidebar-item-label, .ellipsis');
          if (label) label.textContent = "Pressply Suite Settings";
          el.setAttribute("title", "Pressply Suite Settings");
        },
      },
      {
        find: () => document.querySelectorAll('[data-route="erpnext-integrations"]'),
        apply: (el) => {
          const label = el.querySelector('.label, .sidebar-item-label, .ellipsis');
          if (label) label.textContent = "Pressply Suite Integrations";
          el.setAttribute("title", "Pressply Suite Integrations");
        },
      },
      {
        // Page titles
        find: () => document.querySelectorAll('.page-title, h3'),
        apply: (el) => {
          const t = (el.textContent || "").trim();
          if (t === "ERPNext Settings") el.textContent = "Pressply Suite Settings";
          if (t === "ERPNext Integrations") el.textContent = "Pressply Suite Integrations";
        },
      },
    ];

    updates.forEach(({ find, apply }) => {
      find().forEach((el) => apply(el));
    });
  }

  function scheduleRelabeling() {
    relabelUI();
    // Re-apply periodically for SPA updates
    if (!window.__pressply_relabel_timer) {
      window.__pressply_relabel_timer = setInterval(relabelUI, 1500);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    navigateAliasKeepingURL();
    scheduleRelabeling();
  });

  window.addEventListener("popstate", () => {
    navigateAliasKeepingURL();
    scheduleRelabeling();
  });

  window.addEventListener("hashchange", () => {
    scheduleRelabeling();
  });
})(); 