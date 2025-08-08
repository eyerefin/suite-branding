/*
  Pressply Suite Branding helper
  - Keep menu links on branded routes: /app/pressply-settings, /app/pressply-integrations
  - Rewrite menu links (href and data-route) and intercept clicks to load branded Desk Pages
  - Fallback DOM relabeling (translations cover most cases) without stripping icons
  - Website/public pages: replace common static text occurrences (footer/login headings)
*/
(function () {
  if (window.__pressply_branding_loaded) return;
  console.log('[pressply_branding] client script loaded');
  const targetToAlias = {
    "erpnext-settings": "pressply-settings",
    "erpnext-integrations": "pressply-integrations",
  };

  function ensureBrandedTitle() {
    try {
      const t = document.title || "";
      if (/\b(ERPNext|Frappe)\b/i.test(t)) {
        document.title = t.replace(/ERPNext|Frappe Framework|Frappe/gi, 'Pressply Suite');
      }
      // If title is very short or empty (common on login), set default
      if (!document.title || document.title.trim().length < 2) {
        document.title = 'Pressply Suite';
      }
    } catch (_) {}
  }

  function observeTitle() {
    try {
      const titleEl = document.querySelector('head > title');
      if (!titleEl || window.__pressply_title_observer) return;
      const obs = new MutationObserver(() => {
        ensureBrandedTitle();
      });
      obs.observe(titleEl, { subtree: true, characterData: true, childList: true });
      window.__pressply_title_observer = obs;
      // Also brand once now
      ensureBrandedTitle();
    } catch (_) {}
  }

  function replaceStaticWebsiteText(root) {
    if (!root) return;
    const textNodesWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const replacements = [
      [/\bERPNext\b/g, 'Pressply Suite'],
      [/\bFrappe Framework\b/g, 'Pressply Suite'],
      [/\bFrappe\b/g, 'Pressply Suite'],
      [/Powered by ERPNext/g, 'Powered by Pressply Suite'],
      [/Powered by Frappe/g, 'Powered by Pressply Suite'],
      [/Login to Frappe/g, 'Login to Pressply Suite'],
      [/Create a Frappe Account/g, 'Create a Pressply Suite Account'],
      [/Let's begin your journey with ERPNext/g, "Let's begin your journey with Pressply Suite"],
      [/Let’s begin your journey with ERPNext/g, "Let’s begin your journey with Pressply Suite"],
      [/Welcome to ERPNext/g, 'Welcome to Pressply Suite'],
      [/Get Started with ERPNext/g, 'Get Started with Pressply Suite'],
      [/Start your journey with ERPNext/g, 'Start your journey with Pressply Suite'],
    ];
    const nodes = [];
    while (textNodesWalker.nextNode()) nodes.push(textNodesWalker.currentNode);
    nodes.forEach((n) => {
      let v = n.nodeValue;
      replacements.forEach(([rx, to]) => {
        v = v.replace(rx, to);
      });
      if (v !== n.nodeValue) n.nodeValue = v;
    });
  }

  function observeBodyText() {
    try {
      if (window.__pressply_text_observer) return;
      const obs = new MutationObserver((mutations) => {
        // Throttle by batching changes per tick
        if (window.__pressply_text_tick) return;
        window.__pressply_text_tick = setTimeout(() => {
          window.__pressply_text_tick = null;
          replaceStaticWebsiteText(document.body || document);
        }, 100);
      });
      obs.observe(document.documentElement || document, { subtree: true, childList: true, characterData: true });
      window.__pressply_text_observer = obs;
      // Initial pass
      replaceStaticWebsiteText(document.body || document);
    } catch (_) {}
  }

  function rewriteLinksToAlias() {
    // Settings links
    document
      .querySelectorAll('a[data-route="erpnext-settings"], a[href="/app/erpnext-settings"]')
      .forEach((a) => {
        const alias = "/app/" + (targetToAlias["erpnext-settings"] || "pressply-settings");
        if (a.getAttribute("href") !== alias) a.setAttribute("href", alias);
        if (a.hasAttribute("data-route")) a.setAttribute("data-route", targetToAlias["erpnext-settings"]);
        a.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            if (window.frappe && frappe.set_route) {
              frappe.set_route(targetToAlias["erpnext-settings"]);
            } else {
              try { window.location.href = alias; } catch (_) {}
            }
          },
          { once: false }
        );
      });

    // Integrations links
    document
      .querySelectorAll('a[data-route="erpnext-integrations"], a[href="/app/erpnext-integrations"]')
      .forEach((a) => {
        const alias = "/app/" + (targetToAlias["erpnext-integrations"] || "pressply-integrations");
        if (a.getAttribute("href") !== alias) a.setAttribute("href", alias);
        if (a.hasAttribute("data-route")) a.setAttribute("data-route", targetToAlias["erpnext-integrations"]);
        a.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            if (window.frappe && frappe.set_route) {
              frappe.set_route(targetToAlias["erpnext-integrations"]);
            } else {
              try { window.location.href = alias; } catch (_) {}
            }
          },
          { once: false }
        );
      });
  }

  function isSidebarAnchor(el) {
    try {
      if (!el || el.tagName !== 'A') return false;
      const container = el.closest('.desk-sidebar, .sidebar, .workspace-sidebar');
      return !!container;
    } catch (_) { return false; }
  }

  function isOnRoute(routeNames) {
    try {
      const p = (location.pathname || '') + (location.hash || '');
      const routes = Array.isArray(routeNames) ? routeNames : [routeNames];
      return routes.some((r) => p.includes('/app/' + r));
    } catch (_) { return false; }
  }

  function relabelUI() {
    const updates = [
      {
        find: () => document.querySelectorAll('a[data-route="pressply-settings"], a[data-route="erpnext-settings"]'),
        apply: (el) => {
          if (!isSidebarAnchor(el)) return;
          const label = el.querySelector('.label, .sidebar-item-label');
          if (label) label.textContent = "Pressply Suite Settings";
          el.setAttribute("title", "Pressply Suite Settings");
        },
      },
      {
        find: () => document.querySelectorAll('a[data-route="pressply-integrations"], a[data-route="erpnext-integrations"]'),
        apply: (el) => {
          if (!isSidebarAnchor(el)) return;
          const label = el.querySelector('.label, .sidebar-item-label');
          if (label) label.textContent = "Pressply Suite Integrations";
          el.setAttribute("title", "Pressply Suite Integrations");
        },
      },
      {
        // Page titles — only on target routes
        find: () => document.querySelectorAll('.page-head .page-title'),
        apply: (el) => {
          if (isOnRoute(['erpnext-settings','pressply-settings'])) {
            const t = (el.textContent || '').trim();
            if (t === "ERPNext Settings") el.textContent = "Pressply Suite Settings";
          }
          if (isOnRoute(['erpnext-integrations','pressply-integrations'])) {
            const t2 = (el.textContent || '').trim();
            if (t2 === "ERPNext Integrations") el.textContent = "Pressply Suite Integrations";
          }
        },
      },
    ];

    updates.forEach(({ find, apply }) => {
      find().forEach((el) => apply(el));
    });

    rewriteLinksToAlias();
    // Also rebrand public/login pages
    replaceStaticWebsiteText(document);
    // Ensure <title> is branded
    ensureBrandedTitle();
  }

  function scheduleRelabeling() {
    relabelUI();
    if (!window.__pressply_relabel_timer) {
      window.__pressply_relabel_timer = setInterval(relabelUI, 1500);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    observeTitle();
    observeBodyText();
    scheduleRelabeling();
  });

  window.addEventListener("load", () => {
    ensureBrandedTitle();
  });

  window.addEventListener("popstate", () => {
    scheduleRelabeling();
  });

  window.addEventListener("hashchange", () => {
    scheduleRelabeling();
  });

  window.__pressply_branding_loaded = true;
})(); 