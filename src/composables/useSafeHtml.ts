export function useSafeHtml() {
  
  function sanitizeHtml(html: string): string {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const allowedTags = [
      "p",
      "br",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "img",
      "ul",
      "ol",
      "li",
      "a",
      "span",
      "div",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ];
    const allowedAttributes: Record<string, string[]> = {
      img: ["src", "alt", "width", "height", "class", "style"],
      a: ["href", "target", "rel", "class"],
      "*": ["class", "style"], // Para todas as tags
    };

    function cleanNode(node: Element): Element | null {
      const tagName = node.tagName.toLowerCase();
      if (!allowedTags.includes(tagName)) {
        return null;
      }
      const cleaned = document.createElement(tagName);
      const allowed = allowedAttributes[tagName] || allowedAttributes["*"];
      Array.from(node.attributes).forEach((attr) => {
        if (allowed.includes(attr.name)) {
          if (attr.name === "href" || attr.name === "src") {
            if (
              attr.value.startsWith("http://") ||
              attr.value.startsWith("https://") ||
              attr.value.startsWith("/") ||
              attr.value.startsWith("data:image/")
            ) {
              cleaned.setAttribute(attr.name, attr.value);
            }
          } else if (attr.name === "style") {
            const safeStyle = attr.value.replace(/javascript:/gi, "");
            cleaned.setAttribute(attr.name, safeStyle);
          } else {
            cleaned.setAttribute(attr.name, attr.value);
          }
        }
      });
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          cleaned.appendChild(document.createTextNode(child.textContent || ""));
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const cleanedChild = cleanNode(child as Element);
          if (cleanedChild) {
            cleaned.appendChild(cleanedChild);
          }
        }
      });

      return cleaned;
    }
    const result = document.createElement("div");
    Array.from(temp.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        result.appendChild(document.createTextNode(child.textContent || ""));
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const cleaned = cleanNode(child as Element);
        if (cleaned) {
          result.appendChild(cleaned);
        }
      }
    });

    return result.innerHTML;
  }

  function truncateHtml(html: string, maxLength: number = 150): string {
    const sanitized = sanitizeHtml(html);
    const temp = document.createElement("div");
    temp.innerHTML = sanitized;
    const text = temp.textContent || "";

    if (text.length <= maxLength) {
      return sanitized;
    }
    const truncated = text.substring(0, maxLength) + "...";
    return truncated;
  }

  function stripHtml(html: string): string {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || "";
  }

  function autoConvertToHtml(text: string): string {
    if (!text) return "";
    const tempDiv = document.createElement("div");
    tempDiv.textContent = text;
    let html = tempDiv.innerHTML;
    html = html.replace(/\n/g, "<br>");

    return html;
  }

  function isHtml(text: string): boolean {
    if (!text) return false;
    const htmlPattern = /<\/?[a-z][\s\S]*>/i;
    return htmlPattern.test(text);
  }

  function processDescription(description: string): string {
    if (!description) return "";
    if (isHtml(description)) {
      return sanitizeHtml(description);
    }
    const converted = autoConvertToHtml(description);
    return sanitizeHtml(converted);
  }

  return {
    sanitizeHtml,
    truncateHtml,
    stripHtml,
    autoConvertToHtml,
    isHtml,
    processDescription,
  };
}
