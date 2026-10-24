/* Load one Cloudflare beacon only on the configured production HTTPS hostnames. */
(() => {
  "use strict";
  const config = window.PANGNOSTICS_ANALYTICS;
  if (!config || !/^[a-f0-9]{32}$/i.test(config.token || "")) return;
  if (location.protocol !== "https:" || !config.hostnames.includes(location.hostname.toLowerCase())) return;
  if (document.querySelector("script[data-cf-beacon]")) return;
  const beacon = document.createElement("script");
  beacon.type = "module";
  beacon.src = "https://static.cloudflareinsights.com/beacon.min.js";
  beacon.async = true;
  // This site uses separate HTML pages; section/hash navigation must not count as page views.
  beacon.setAttribute("data-cf-beacon", JSON.stringify({token: config.token, spa: false}));
  document.head.appendChild(beacon);
})();
