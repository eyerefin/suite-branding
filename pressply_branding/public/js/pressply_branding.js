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

  function rewriteLinksToAlias() {
    // Settings links
    document
      .querySelectorAll('[data-route="erpnext-settings"], a[href="/app/erpnext-settings"]')
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
      .querySelectorAll('[data-route="erpnext-integrations"], a[href="/app/erpnext-integrations"]')
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

  function relabelUI() {
    const updates = [
      {
        find: () => document.querySelectorAll('[data-route="pressply-settings"], [data-route="erpnext-settings"]'),
        apply: (el) => {
          const label = el.querySelector('.label, .sidebar-item-label, .ellipsis');
          if (label) label.textContent = "Pressply Suite Settings";
          el.setAttribute("title", "Pressply Suite Settings");
        },
      },
      {
        find: () => document.querySelectorAll('[data-route="pressply-integrations"], [data-route="erpnext-integrations"]'),
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
    // Also rebrand public/login pages
    replaceStaticWebsiteText(document);
  }

  function scheduleRelabeling() {
    relabelUI();
    if (!window.__pressply_relabel_timer) {
      window.__pressply_relabel_timer = setInterval(relabelUI, 1500);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    scheduleRelabeling();
  });

  window.addEventListener("popstate", () => {
    scheduleRelabeling();
  });

  window.addEventListener("hashchange", () => {
    scheduleRelabeling();
  });

  window.__pressply_branding_loaded = true;
})(); 