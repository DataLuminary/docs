import { useEffect } from "react";
import mermaid from "mermaid";

const BLOCK_SELECTOR = [
  ".rp-codeblock.language-mermaid",
  "pre[data-lang='mermaid']",
  "pre code.language-mermaid",
].join(", ");

const HIDDEN_CLASS = "mermaid-source-hidden";

interface MermaidMount {
  anchor: HTMLElement;
  host: HTMLElement;
}

const mounts = new Set<MermaidMount>();
let mutating = false;

function resolveContainer(el: Element): HTMLElement {
  const codeblock = el.closest<HTMLElement>(".rp-codeblock");
  if (codeblock) {
    return codeblock;
  }
  if (el instanceof HTMLElement && el.matches("pre")) {
    return el;
  }
  return (el.closest("pre") as HTMLElement | null) ?? (el as HTMLElement);
}

function resolveSource(container: HTMLElement): string {
  const code =
    container.querySelector("pre code") ??
    container.querySelector("code") ??
    container;
  return code.textContent?.trim() ?? "";
}

function findMount(anchor: HTMLElement): MermaidMount | undefined {
  for (const mount of mounts) {
    if (mount.anchor === anchor) {
      return mount;
    }
  }
  return undefined;
}

function dropMount(mount: MermaidMount): void {
  mount.host.remove();
  mounts.delete(mount);
}

function collectMermaidContainers(root: ParentNode): HTMLElement[] {
  const seen = new Set<HTMLElement>();
  const result: HTMLElement[] = [];

  for (const el of root.querySelectorAll(BLOCK_SELECTOR)) {
    const container = resolveContainer(el);
    if (seen.has(container) || !container.isConnected) {
      continue;
    }
    if (findMount(container)) {
      container.classList.add(HIDDEN_CLASS);
      continue;
    }
    const source = resolveSource(container);
    if (!source) {
      continue;
    }
    seen.add(container);
    result.push(container);
  }

  return result;
}

function removeDetachedMounts(): void {
  for (const mount of mounts) {
    if (mount.anchor.isConnected) {
      continue;
    }
    dropMount(mount);
  }
}

async function renderMermaidBlocks(root: ParentNode = document): Promise<void> {
  mutating = true;
  try {
    removeDetachedMounts();
  } finally {
    mutating = false;
  }

  const blocks = collectMermaidContainers(root);
  if (blocks.length === 0) {
    return;
  }

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "neutral",
  });

  for (const [index, container] of blocks.entries()) {
    if (!container.isConnected || findMount(container)) {
      continue;
    }

    const source = resolveSource(container);
    const host = document.createElement("div");
    host.className = "mermaid-diagram";
    host.setAttribute("data-mermaid-rendered", "true");
    const mount: MermaidMount = { anchor: container, host };

    mutating = true;
    try {
      container.classList.add(HIDDEN_CLASS);
      container.insertAdjacentElement("afterend", host);
      mounts.add(mount);
    } finally {
      mutating = false;
    }

    try {
      const id = `mermaid-${Date.now()}-${index}`;
      const { svg } = await mermaid.render(id, source);
      if (!container.isConnected || !host.isConnected) {
        dropMount(mount);
        continue;
      }
      mutating = true;
      try {
        host.innerHTML = svg;
      } finally {
        mutating = false;
      }
    } catch (error) {
      if (!host.isConnected) {
        mounts.delete(mount);
        continue;
      }
      mutating = true;
      try {
        host.classList.add("mermaid-diagram--error");
        host.textContent =
          error instanceof Error ? error.message : "Mermaid render failed";
      } finally {
        mutating = false;
      }
    }
  }
}

/**
 * Client-side Mermaid renderer for ```mermaid fences (Rspress 2 Shiki DOM).
 * Keep the Shiki node in place: replaceWith() removes a React-owned child and
 * the next route commit throws NotFoundError in removeChild.
 */
export default function MermaidRuntime(): null {
  useEffect(() => {
    let cancelled = false;
    let running = false;
    let pending = false;

    const flush = async (): Promise<void> => {
      if (cancelled) {
        return;
      }
      if (running) {
        pending = true;
        return;
      }
      running = true;
      try {
        do {
          pending = false;
          await renderMermaidBlocks();
        } while (pending && !cancelled);
      } finally {
        running = false;
      }
    };

    void flush();

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (cancelled || mutating || scheduled) {
        return;
      }
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        if (!cancelled) {
          void flush();
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return null;
}
