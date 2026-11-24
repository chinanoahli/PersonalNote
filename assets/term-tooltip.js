for (const term of document.querySelectorAll(".term-tooltip")) {
  const tooltip = term.querySelector(".term-tooltip-text");

  function placeTooltip() {
    const padding = 8;
    tooltip.style.removeProperty("--term-tooltip-shift");
    tooltip.classList.remove("term-tooltip-below");

    const bounds = tooltip.getBoundingClientRect();
    const rightEdge = document.documentElement.clientWidth - padding;
    const shift = Math.max(padding - bounds.left, Math.min(0, rightEdge - bounds.right));
    tooltip.style.setProperty("--term-tooltip-shift", `${shift}px`);
    tooltip.classList.toggle("term-tooltip-below", bounds.top < padding);
  }

  term.addEventListener("pointerenter", placeTooltip);
  term.addEventListener("focus", placeTooltip);
}
