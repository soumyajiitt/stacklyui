export interface DocLink {
  href: string;
  label: string;
  /** Flag freshly-added entries so the nav can badge them. */
  badge?: "new";
}

export interface DocSection {
  title: string;
  links: DocLink[];
}

export const DOCS_NAV: DocSection[] = [
  {
    title: "Getting started",
    links: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/theming", label: "Theming" },
    ],
  },
  {
    title: "Motion & effects",
    links: [
      { href: "/docs/components/aurora-background", label: "Aurora Background" },
      { href: "/docs/components/spotlight-card", label: "Spotlight Card" },
      { href: "/docs/components/card-3d", label: "3D Tilt Card" },
      { href: "/docs/components/gradient-text", label: "Gradient Text" },
      { href: "/docs/components/bento-grid", label: "Bento Grid" },
      { href: "/docs/components/animated-beam", label: "Animated Beam" },
      { href: "/docs/components/marquee", label: "Marquee" },
      { href: "/docs/components/magnetic-button", label: "Magnetic Button" },
      { href: "/docs/components/number-ticker", label: "Number Ticker" },
    ],
  },
  {
    title: "Forms & inputs",
    links: [
      { href: "/docs/components/button", label: "Button" },
      { href: "/docs/components/input", label: "Input" },
      { href: "/docs/components/textarea", label: "Textarea" },
      { href: "/docs/components/label", label: "Label" },
      { href: "/docs/components/checkbox", label: "Checkbox" },
      { href: "/docs/components/switch", label: "Switch" },
      { href: "/docs/components/radio-group", label: "Radio Group" },
      { href: "/docs/components/select", label: "Select" },
      { href: "/docs/components/combobox", label: "Combobox", badge: "new" },
      { href: "/docs/components/multi-select", label: "Multi Select", badge: "new" },
      { href: "/docs/components/slider", label: "Slider" },
      { href: "/docs/components/calendar", label: "Calendar", badge: "new" },
      { href: "/docs/components/date-picker", label: "Date Picker", badge: "new" },
      { href: "/docs/components/toggle", label: "Toggle" },
      { href: "/docs/components/toggle-group", label: "Toggle Group" },
    ],
  },
  {
    title: "Display",
    links: [
      { href: "/docs/components/badge", label: "Badge" },
      { href: "/docs/components/card", label: "Card" },
      { href: "/docs/components/avatar", label: "Avatar" },
      { href: "/docs/components/separator", label: "Separator" },
      { href: "/docs/components/skeleton", label: "Skeleton" },
      { href: "/docs/components/aspect-ratio", label: "Aspect Ratio" },
      { href: "/docs/components/progress", label: "Progress" },
      { href: "/docs/components/spinner", label: "Spinner" },
      { href: "/docs/components/kbd", label: "Kbd" },
      { href: "/docs/components/breadcrumb", label: "Breadcrumb" },
      { href: "/docs/components/pagination", label: "Pagination", badge: "new" },
    ],
  },
  {
    title: "Overlays & disclosure",
    links: [
      { href: "/docs/components/dialog", label: "Dialog" },
      { href: "/docs/components/alert-dialog", label: "Alert Dialog" },
      { href: "/docs/components/sheet", label: "Sheet" },
      { href: "/docs/components/popover", label: "Popover" },
      { href: "/docs/components/hover-card", label: "Hover Card" },
      { href: "/docs/components/dropdown-menu", label: "Dropdown Menu" },
      { href: "/docs/components/tooltip", label: "Tooltip" },
      { href: "/docs/components/tabs", label: "Tabs" },
      { href: "/docs/components/accordion", label: "Accordion" },
      { href: "/docs/components/collapsible", label: "Collapsible" },
      { href: "/docs/components/alert", label: "Alert" },
      { href: "/docs/components/toast", label: "Toast", badge: "new" },
    ],
  },
];

/** Flat, ordered list of all doc links for prev/next navigation. */
export const DOCS_FLAT: DocLink[] = DOCS_NAV.flatMap((s) => s.links);
