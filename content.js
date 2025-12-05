document.querySelectorAll("*").forEach((el) => {
  if (el.tagName === "STYLE" || el.tagName === "SCRIPT" || el.tagName === "HEAD") {
    return;
  }

  const bionifyWord = (token) => {
    const parts = token.split(/([^\p{L}]+)/u);

    return parts
      .map((part) => {
        if (!/\p{L}/u.test(part)) {
          return part;
        }

        const len = part.length;
        let boldCount;

        if (len === 1) {
          return part;
        } else if (len === 2) {
          boldCount = 1;
        } else if (len <= 4) {
          boldCount = 2;
        } else {
          boldCount = Math.ceil(len * 0.4);
        }

        const boldPart = part.slice(0, boldCount);
        const normalPart = part.slice(boldCount);

        return `<span style="font-weight:bold">${boldPart}</span><span style="font-weight:normal">${normalPart}</span>`;
      })
      .join("");
  };

  // Applying "better" line spacing
  if (el.childNodes.length > 0) {
    const hasText = Array.from(el.childNodes).some(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
    );

    if (hasText) {
      el.style.letterSpacing = "0.03em";
    }
  }

  // Bionifying text
  const childNodesArr = [...el.childNodes];
  childNodesArr.forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return;

    const parts = node.textContent.split(/(\s+)/);

    const span = document.createElement("span");
    span.innerHTML = parts
      .map((part) => {
        if (/^\s+$/.test(part)) {
          return part;
        }
        return bionifyWord(part);
      })
      .join("");

    node.replaceWith(span);
  });
});
