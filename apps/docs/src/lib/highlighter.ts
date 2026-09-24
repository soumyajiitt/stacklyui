import {
  createHighlighter,
  type Highlighter,
  type BundledLanguage,
} from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

const LANGS: BundledLanguage[] = ["tsx", "ts", "bash", "json", "css"];

/** Lazily create a single Shiki highlighter and reuse it across renders. */
function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark-default", "github-light-default"],
      langs: LANGS,
    });
  }
  return highlighterPromise;
}

/** Highlight code to dual-theme HTML (CSS variables drive light/dark). */
export async function highlightCode(
  code: string,
  lang: string = "tsx",
): Promise<string> {
  const highlighter = await getHighlighter();
  const language = (LANGS as string[]).includes(lang)
    ? (lang as BundledLanguage)
    : "tsx";
  return highlighter.codeToHtml(code.trim(), {
    lang: language,
    themes: {
      dark: "github-dark-default",
      light: "github-light-default",
    },
    defaultColor: false,
  });
}
