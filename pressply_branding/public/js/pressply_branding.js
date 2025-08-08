/*
  Pressply Suite Branding helper
  - Route aliases: /app/pressply-settings, /app/pressply-integration(s)
  - Keep URL as pressply-* while loading ERPNext pages underneath
  - Rewrite menu links to pressply-* and intercept clicks to load target
  - Patch history state methods so URL stays on pressply-* when app navigates
  - Fallback DOM relabeling (translations cover most cases) without stripping icons
*/
(function () {
  const aliasToTarget = {
    "pressply-settings": "erpnext-settings",
    "pressply-integration": "erpnext-integrations",
    "pressply-integrations": "erpnext-integrations",
  };

  const targetToAlias = {
    "erpnext-settings": "pressply-settings",
    "erpnext-integrations": "pressply-integrations",
  };

  const targetPathToAliasPath = {
    "/app/erpnext-settings": "/app/pressply-settings",
    "/app/erpnext-integrations": "/app/pressply-integrations",
  };

  // Patch history methods to rewrite target paths to alias paths
  (function patchHistoryForAliases() {
    if (window.__pressply_history_patched) return;
    const originalPush = history.pushState.bind(history);
    const originalReplace = history.replaceState.bind(history);

    function rewriteUrl(url) {
      if (!url || typeof url !== "string") return url;
      try {
        const a = document.createElement("a");
        a.href = url;
        let path = a.pathname || "";
        for (const targetPath in targetPathToAliasPath) {
          if (path.startsWith(targetPath)) {
            path = path.replace(targetPath, targetPathToAliasPath[targetPath]);
            break;
          }
        }
        a.pathname = path;
        return a.pathname + a.search + a.hash;
      } catch (_) {
        return url;
      }
    }

    history.pushState = function (state, title, url) {
      return originalPush(state, title, rewriteUrl(url));
    };
    history.replaceState = function (state, title, url) {
      return originalReplace(state, title, rewriteUrl(url));
    };

    window.__pressply_history_patched = true;
  })();

  let isNavigatingToTarget = false;
  let lastAliasUsed = null;

  function getDeskSlug() {
    const path = window.location.pathname || "";
    const parts = path.split("/").filter(Boolean); // ["app", "<slug>", ...]
    if (parts[0] !== "app") return "";
    return parts[1] || "";
  }

  function rewriteLinksToAlias() {
    // Change href to alias, preserve data-route so Frappe knows where to go
    document.querySelectorAll('[data-route="erpnext-settings"], a[href="/app/erpnext-settings"]').forEach((a) => {
      const alias = "/app/" + (targetToAlias["erpnext-settings"] || "pressply-settings");
      if (a.getAttribute("href") !== alias) a.setAttribute("href", alias);
      a.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          lastAliasUsed = targetToAlias["erpnext-settings"];
          if (window.frappe && frappe.set_route) {
            frappe.set_route("erpnext-settings");
            setTimeout(() => {
              try {
                window.history.replaceState({}, "", alias);
              } catch (_) {}
            }, 200);
          }
        },
        { once: false }
      );
    });

    document
      .querySelectorAll('[data-route="erpnext-integrations"], a[href="/app/erpnext-integrations"]')
      .forEach((a) => {
        const alias = "/app/" + (targetToAlias["erpnext-integrations"] || "pressply-integrations");
        if (a.getAttribute("href") !== alias) a.setAttribute("href", alias);
        a.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            lastAliasUsed = targetToAlias["erpnext-integrations"];
            if (window.frappe && frappe.set_route) {
              frappe.set_route("erpnext-integrations");
              setTimeout(() => {
                try {
                  window.history.replaceState({}, "", alias);
                } catch (_) {}
              }, 200);
            }
          },
          { once: false }
        );
      });
  }

  function navigateAliasKeepingURL() {
    const slug = getDeskSlug();
    const target = aliasToTarget[slug];
    if (!target) return;

    if (isNavigatingToTarget) return;

    lastAliasUsed = slug;
    isNavigatingToTarget = true;

    if (window.frappe && frappe.set_route) {
      frappe.set_route(target);
      setTimeout(() => {
        const aliasUrl = `/app/${lastAliasUsed}` + window.location.search + window.location.hash;
        try {
          window.history.replaceState({}, "", aliasUrl);
        } catch (_) {}
        isNavigatingToTarget = false;
      }, 300);
    } else {
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

    rewriteLinksToAlias();
  }

  function scheduleRelabeling() {
    relabelUI();
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

  window.__pressply_branding_loaded = true;
})(); 