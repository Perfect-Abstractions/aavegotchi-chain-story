/* eslint-disable */

if (typeof window !== "undefined") {
  (function (s: any, e: any, n: any, d: any, er: any) {
    s["Sender"] = er;
    (s[er] =
      s[er] ||
      function () {
        (s[er].q = s[er].q || []).push(arguments);
      }),
      (s[er].l = 1 * new Date().getTime());
    var a = e.createElement(n),
      m = e.getElementsByTagName(n)[0];
    a.async = 1;
    a.src = d;
    m.parentNode.insertBefore(a, m);
  })(window, document, "script", "https://cdn.sender.net/accounts_resources/universal.js", "sender");
  // @ts-ignore
  sender("adaa4ffe1a7593");
}

export const NewsletterForm = () => {
  return <div className="sender-form-field" data-sender-form-id="lzppm7ysaovkbemnkqm"></div>;
};
