import sanitizeHtml from "sanitize-html";

const escapeText = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function presentationHtml(lines: string[]): string {
  const content = lines.join("\n");
  // Historical presentations are plain text, with one paragraph per line.
  const html = /<\/?[a-z][^>]*>/i.test(content)
    ? content
    : lines.map((line) => `<p>${escapeText(line)}</p>`).join("");

  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "del", "sub", "sup", "ul", "ol", "li", "a", "h2", "h3", "h4", "blockquote", "hr", "span", "img", "figure", "figcaption"],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      "*": ["style"],
    },
    allowedStyles: { "*": { "text-align": [/^(?:left|center|right|justify)$/] } },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attributes) => ({
        tagName,
        attribs: attributes.target === "_blank" ? { ...attributes, rel: "noopener noreferrer" } : attributes,
      }),
    },
  });
}
