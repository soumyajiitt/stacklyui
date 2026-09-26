export interface PrimitiveExample {
  title: string;
  description?: string;
  /** react-live editable snippet (noInline — must call render(...)). */
  code: string;
}

export interface PrimitiveDoc {
  slug: string;
  title: string;
  description: string;
  /** react-live editable snippet (noInline — must call render(...)). */
  code: string;
  /** Optional usage note (plain text). */
  usage?: string;
  /** Variant/permutation demos, each its own editable playground. */
  examples?: PrimitiveExample[];
  /** Flag freshly-added components so the gallery/index can badge them. */
  badge?: "new";
}

export const PRIMITIVES: PrimitiveDoc[] = [
  {
    slug: "button",
    title: "Button",
    description: "Displays a button or a component that looks like a button.",
    code: `function Demo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  )
}
render(<Demo />)`,
    usage: "Choose a variant (primary, secondary, outline, ghost, destructive, link) and a size (sm, md, lg, icon). Pass asChild to render a link while keeping the button styling.",
    examples: [
      {
        title: "Sizes",
        description: "sm, md (default), and lg.",
        code: `render(
  <div className="flex items-center gap-3">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
)`,
      },
      {
        title: "With icon",
        description: "Icons auto-size to 1rem inside a button.",
        code: `render(
  <div className="flex items-center gap-3">
    <Button>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5v14"/></svg>
      New project
    </Button>
    <Button variant="outline">
      Continue
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </Button>
  </div>
)`,
      },
      {
        title: "Loading",
        description: "Compose with Spinner and disable while pending.",
        code: `render(
  <Button disabled>
    <Spinner size={16} />
    Saving…
  </Button>
)`,
      },
      {
        title: "Icon only",
        code: `render(
  <Button size="icon" variant="secondary" aria-label="Like">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
  </Button>
)`,
      },
    ],
  },
  {
    slug: "badge",
    title: "Badge",
    description: "A small pill for statuses, counts, and labels.",
    code: `render(
  <div className="flex flex-wrap items-center justify-center gap-2">
    <Badge>Soft</Badge>
    <Badge variant="solid">Solid</Badge>
    <Badge variant="outline">Outline</Badge>
    <Badge variant="success">Success</Badge>
    <Badge variant="warning">Warning</Badge>
    <Badge variant="destructive">Error</Badge>
  </div>
)`,
    examples: [
      {
        title: "With a dot",
        code: `render(
  <div className="flex gap-2">
    <Badge variant="success"><span className="h-1.5 w-1.5 rounded-full bg-current" />Live</Badge>
    <Badge variant="warning"><span className="h-1.5 w-1.5 rounded-full bg-current" />Beta</Badge>
    <Badge variant="soft"><span className="h-1.5 w-1.5 rounded-full bg-current" />New</Badge>
  </div>
)`,
      },
      {
        title: "On a button",
        code: `render(
  <Button variant="outline">
    Inbox
    <Badge variant="solid" className="ml-1">4</Badge>
  </Button>
)`,
      },
    ],
  },
  {
    slug: "input",
    title: "Input",
    description: "A form text input with focus ring and invalid state.",
    code: `render(
  <div className="w-full max-w-xs space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="you@stacklyui.in" />
  </div>
)`,
    examples: [
      {
        title: "States",
        description: "Default, disabled, and invalid (aria-invalid).",
        code: `render(
  <div className="w-full max-w-xs space-y-3">
    <Input placeholder="Default" />
    <Input placeholder="Disabled" disabled />
    <Input placeholder="Invalid" aria-invalid />
  </div>
)`,
      },
      {
        title: "With a button",
        code: `render(
  <div className="flex w-full max-w-sm gap-2">
    <Input type="email" placeholder="you@stacklyui.in" />
    <Button>Subscribe</Button>
  </div>
)`,
      },
    ],
  },
  {
    slug: "textarea",
    title: "Textarea",
    description: "A multi-line text input.",
    code: `render(
  <div className="w-full max-w-xs space-y-2">
    <Label htmlFor="msg">Message</Label>
    <Textarea id="msg" placeholder="Tell us what you think…" />
  </div>
)`,
  },
  {
    slug: "label",
    title: "Label",
    description: "An accessible label associated with a control.",
    code: `render(
  <div className="flex items-center gap-3">
    <Checkbox id="terms" defaultChecked />
    <Label htmlFor="terms">Accept terms and conditions</Label>
  </div>
)`,
  },
  {
    slug: "card",
    title: "Card",
    description: "A container for grouping related content and actions.",
    code: `render(
  <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Upgrade to Pro</CardTitle>
      <CardDescription>Unlock every component and priority support.</CardDescription>
    </CardHeader>
    <CardContent className="text-sm text-muted">
      Billed annually. Cancel anytime.
    </CardContent>
    <CardFooter>
      <Button className="w-full">Upgrade now</Button>
    </CardFooter>
  </Card>
)`,
  },
  {
    slug: "separator",
    title: "Separator",
    description: "Visually or semantically separates content.",
    code: `render(
  <div className="text-sm">
    <p className="font-semibold text-fg">StacklyUI</p>
    <p className="text-muted">An animated component library.</p>
    <Separator className="my-4" />
    <div className="flex h-5 items-center gap-4 text-muted">
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Guides</span>
      <Separator orientation="vertical" />
      <span>API</span>
    </div>
  </div>
)`,
  },
  {
    slug: "avatar",
    title: "Avatar",
    description: "An image element with a text fallback.",
    code: `render(
  <div className="flex items-center gap-3">
    <Avatar><AvatarFallback>SB</AvatarFallback></Avatar>
    <Avatar className="h-12 w-12"><AvatarFallback>UI</AvatarFallback></Avatar>
    <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">3D</AvatarFallback></Avatar>
  </div>
)`,
  },
  {
    slug: "skeleton",
    title: "Skeleton",
    description: "A placeholder shown while content loads.",
    code: `render(
  <div className="flex w-full max-w-xs items-center gap-3">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
)`,
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    description: "A control that toggles between checked and unchecked.",
    code: `function Demo() {
  const [checked, setChecked] = useState(true)
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-fg">
      <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
      Ship with animations
    </label>
  )
}
render(<Demo />)`,
  },
  {
    slug: "switch",
    title: "Switch",
    description: "A toggle between on and off, with a spring thumb.",
    code: `function Demo() {
  const [on, setOn] = useState(true)
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-fg">
      <Switch checked={on} onCheckedChange={setOn} />
      {on ? "Notifications on" : "Notifications off"}
    </label>
  )
}
render(<Demo />)`,
  },
  {
    slug: "radio-group",
    title: "Radio Group",
    description: "A set of checkable buttons where only one can be selected.",
    code: `function Demo() {
  const [value, setValue] = useState("comfortable")
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      {["comfortable", "compact", "spacious"].map((v) => (
        <label key={v} className="flex cursor-pointer items-center gap-3 text-sm capitalize text-fg">
          <RadioGroupItem value={v} />
          {v}
        </label>
      ))}
    </RadioGroup>
  )
}
render(<Demo />)`,
  },
  {
    slug: "select",
    title: "Select",
    description: "A dropdown for picking one value from a list.",
    code: `render(
  <Select defaultValue="next">
    <SelectTrigger className="w-56">
      <SelectValue placeholder="Framework" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="next">Next.js</SelectItem>
      <SelectItem value="remix">Remix</SelectItem>
      <SelectItem value="astro">Astro</SelectItem>
      <SelectItem value="vite">Vite</SelectItem>
    </SelectContent>
  </Select>
)`,
  },
  {
    slug: "combobox",
    title: "Combobox",
    badge: "new",
    description:
      "A searchable, data-driven single-select — typeahead filtering, grouping, keyboard navigation, an optional create-on-the-fly row, and a loading state, with no Radix or cmdk.",
    code: `function Demo() {
  const [value, setValue] = useState("next")
  const frameworks = [
    { value: "next", label: "Next.js", description: "The React framework for the web", group: "Full-stack" },
    { value: "remix", label: "Remix", description: "Web standards, nested routes", group: "Full-stack" },
    { value: "astro", label: "Astro", description: "Content-driven, islands", group: "Static" },
    { value: "vite", label: "Vite", description: "Instant dev server", group: "Build tools" },
    { value: "webpack", label: "webpack", description: "The battle-tested bundler", group: "Build tools" },
  ]
  return (
    <div className="w-72">
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Pick a framework"
        searchPlaceholder="Search frameworks…"
        clearable
      />
    </div>
  )
}
render(<Demo />)`,
    usage:
      "No Radix, no cmdk — pass an array of options and the Combobox handles the rest: case-insensitive typeahead (add keywords for extra match terms), group headings, and the full ARIA combobox keyboard pattern (↑/↓ to move, Home/End to jump, Enter to pick, Esc to close). The dropdown is portal-positioned and flips up automatically when there's no room below. Opt into clearable for a reset ×, creatable + onCreate for an inline “Create …” row, and loading for a spinner while you fetch. Works controlled (value + onValueChange) or uncontrolled (defaultValue), and drops a hidden input when you pass name.",
    examples: [
      {
        title: "Create on the fly",
        description: "Type a value that isn't in the list and press Enter to add it.",
        code: `function Demo() {
  const [options, setOptions] = useState([
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
  ])
  const [value, setValue] = useState("")
  return (
    <div className="w-72">
      <Combobox
        options={options}
        value={value}
        onValueChange={setValue}
        creatable
        onCreate={(input) => {
          const opt = { value: input.toLowerCase(), label: input }
          setOptions((o) => [...o, opt])
          setValue(opt.value)
        }}
        placeholder="Pick or create a tag"
      />
    </div>
  )
}
render(<Demo />)`,
      },
      {
        title: "Async loading state",
        description: "Show a spinner while options are being fetched.",
        code: `function Demo() {
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const load = () => {
    setLoading(true)
    setOptions([])
    setTimeout(() => {
      setOptions([
        { value: "ada", label: "Ada Lovelace" },
        { value: "alan", label: "Alan Turing" },
        { value: "grace", label: "Grace Hopper" },
      ])
      setLoading(false)
    }, 1200)
  }
  return (
    <div className="flex w-72 flex-col gap-3">
      <Button size="sm" variant="outline" onClick={load}>Simulate fetch</Button>
      <Combobox options={options} loading={loading} placeholder="Load people…" />
    </div>
  )
}
render(<Demo />)`,
      },
    ],
  },
  {
    slug: "multi-select",
    title: "Multi Select",
    badge: "new",
    description:
      "A searchable multi-select with inline chips — the component shadcn never shipped. Type to filter, Enter to toggle, Backspace to peel off the last chip, plus Select all, a +N more overflow collapse, and creatable tags.",
    code: `function Demo() {
  const [value, setValue] = useState(["react", "ts"])
  const skills = [
    { value: "react", label: "React", group: "Frontend" },
    { value: "vue", label: "Vue", group: "Frontend" },
    { value: "svelte", label: "Svelte", group: "Frontend" },
    { value: "node", label: "Node.js", group: "Backend" },
    { value: "go", label: "Go", group: "Backend" },
    { value: "rust", label: "Rust", group: "Backend" },
    { value: "ts", label: "TypeScript", group: "Languages" },
    { value: "py", label: "Python", group: "Languages" },
  ]
  return (
    <div className="w-80">
      <MultiSelect
        options={skills}
        value={value}
        onValueChange={setValue}
        placeholder="Add skills…"
        maxDisplay={3}
      />
    </div>
  )
}
render(<Demo />)`,
    usage:
      "Selected values live as removable chips right inside the control. Type to filter, Enter to toggle the highlighted option, and Backspace on an empty search peels off the last chip. Use maxDisplay to collapse extra chips into a +N more badge, maxSelected to cap choices (with a live counter), and showSelectAll for a header toggle. Group options with group, add keywords for search, and enable creatable + onCreate for ad-hoc tags. The dropdown is a self-contained, portal-positioned panel — no Radix. Controlled via value + onValueChange or uncontrolled via defaultValue.",
    examples: [
      {
        title: "Capped selection",
        description: "Limit how many options can be chosen — the counter and Select all adapt.",
        code: `function Demo() {
  const [value, setValue] = useState(["email"])
  const channels = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "push", label: "Push" },
    { value: "slack", label: "Slack" },
    { value: "webhook", label: "Webhook" },
  ]
  return (
    <div className="w-80">
      <MultiSelect
        options={channels}
        value={value}
        onValueChange={setValue}
        maxSelected={3}
        placeholder="Up to 3 channels"
      />
    </div>
  )
}
render(<Demo />)`,
      },
      {
        title: "Creatable tags",
        description: "Type a new label and add it as a fresh chip on the fly.",
        code: `function Demo() {
  const [options, setOptions] = useState([
    { value: "bug", label: "bug" },
    { value: "feature", label: "feature" },
    { value: "docs", label: "docs" },
  ])
  const [value, setValue] = useState(["bug"])
  return (
    <div className="w-80">
      <MultiSelect
        options={options}
        value={value}
        onValueChange={setValue}
        creatable
        onCreate={(input) => {
          const opt = { value: input.toLowerCase(), label: input }
          setOptions((o) => [...o, opt])
          setValue((v) => [...v, opt.value])
        }}
        placeholder="Label this issue…"
      />
    </div>
  )
}
render(<Demo />)`,
      },
    ],
  },
  {
    slug: "tabs",
    title: "Tabs",
    description: "Layered sections of content with a sliding indicator.",
    code: `render(
  <Tabs defaultValue="preview" className="w-full max-w-sm">
    <TabsList className="w-full">
      <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
      <TabsTrigger value="code" className="flex-1">Code</TabsTrigger>
      <TabsTrigger value="docs" className="flex-1">Docs</TabsTrigger>
    </TabsList>
    <TabsContent value="preview" className="text-sm text-muted">A live preview of the component.</TabsContent>
    <TabsContent value="code" className="text-sm text-muted">The copy-paste source.</TabsContent>
    <TabsContent value="docs" className="text-sm text-muted">The full API reference.</TabsContent>
  </Tabs>
)`,
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    description: "A popup label shown on hover or focus.",
    code: `render(
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Copy-paste or install — your call.</TooltipContent>
    </Tooltip>
  </TooltipProvider>
)`,
  },
  {
    slug: "accordion",
    title: "Accordion",
    description: "Vertically stacked, expandable sections.",
    code: `render(
  <Accordion type="single" collapsible defaultValue="a" className="w-full max-w-md">
    <AccordionItem value="a">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>Yes — it's built on Radix, so keyboard and screen-reader support are handled.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="b">
      <AccordionTrigger>Can I copy-paste it?</AccordionTrigger>
      <AccordionContent>Absolutely — use the registry CLI or install the package.</AccordionContent>
    </AccordionItem>
  </Accordion>
)`,
  },
  {
    slug: "dialog",
    title: "Dialog",
    description: "A modal window overlaid on the page.",
    code: `render(
  <Dialog>
    <DialogTrigger asChild>
      <Button>Open dialog</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete project?</DialogTitle>
        <DialogDescription>This can't be undone. The project and its data will be permanently removed.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
        <DialogClose asChild><Button variant="destructive">Delete</Button></DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)`,
  },
  {
    slug: "dropdown-menu",
    title: "Dropdown Menu",
    description: "A menu of actions triggered by a button.",
    code: `render(
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">Options</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>My account</DropdownMenuLabel>
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Sign out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)`,
  },
  {
    slug: "alert",
    title: "Alert",
    description: "A callout with a signature colored accent rail.",
    code: `render(
  <Alert variant="info" className="max-w-md">
    <div>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>You can add components to your project via the CLI.</AlertDescription>
    </div>
  </Alert>
)`,
    examples: [
      {
        title: "Variants",
        code: `render(
  <div className="w-full max-w-md space-y-3">
    <Alert variant="success"><div><AlertTitle>Saved</AlertTitle><AlertDescription>Your changes are live.</AlertDescription></div></Alert>
    <Alert variant="warning"><div><AlertTitle>Careful</AlertTitle><AlertDescription>This will affect billing.</AlertDescription></div></Alert>
    <Alert variant="destructive"><div><AlertTitle>Error</AlertTitle><AlertDescription>Something went wrong.</AlertDescription></div></Alert>
  </div>
)`,
      },
    ],
  },
  {
    slug: "toast",
    title: "Toast",
    badge: "new",
    description:
      "Imperative, Sonner-style toasts — call toast() from anywhere, no context wiring. A collapsed peek stack expands on hover, toasts pause on hover and swipe to dismiss, and toast.promise wires loading → success/error automatically.",
    code: `function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Toaster richColors closeButton />
      <Button size="sm" onClick={() => toast("Event created", { description: "Sunday, Dec 3 at 9:00 AM" })}>
        Show toast
      </Button>
      <Button size="sm" variant="outline" onClick={() => toast.success("Changes saved")}>Success</Button>
      <Button size="sm" variant="outline" onClick={() => toast.error("Something went wrong")}>Error</Button>
      <Button size="sm" variant="outline" onClick={() => toast.warning("Low on storage")}>Warning</Button>
      <Button size="sm" variant="outline" onClick={() => toast.info("A new version is available")}>Info</Button>
    </div>
  )
}
render(<Demo />)`,
    usage:
      "Drop a single <Toaster /> at your app root, then call the imperative API from anywhere — no provider, no context. The store is a singleton read through useSyncExternalStore, so toast(), toast.success/error/warning/info/loading, toast.custom (arbitrary JSX), and toast.promise (loading that resolves to success or error) all work from event handlers, effects, or plain functions. Pass an id to update a toast in place. Each toast takes a description, an action and a cancel button, and a duration (Infinity to persist). The stack shows as a collapsed peek that expands on hover, auto-dismiss pauses while hovered, and toasts can be swiped away. Configure the <Toaster /> with position, richColors, closeButton, expand, visibleToasts, gap, offset, and width.",
    examples: [
      {
        title: "Promise toasts",
        description: "One call shows a loading toast, then swaps to success or error when the promise settles.",
        code: `function Demo() {
  const run = () => {
    const upload = new Promise((resolve, reject) =>
      setTimeout(() => (Math.random() > 0.3 ? resolve({ name: "report.pdf" }) : reject()), 1800),
    )
    toast.promise(upload, {
      loading: "Uploading…",
      success: (data) => data.name + " uploaded",
      error: "Upload failed — try again",
    })
  }
  return (
    <div>
      <Toaster />
      <Button size="sm" onClick={run}>Upload file</Button>
    </div>
  )
}
render(<Demo />)`,
      },
      {
        title: "Action & undo",
        description: "Attach a primary action — perfect for an undoable, destructive step.",
        code: `function Demo() {
  const remove = () =>
    toast.warning("File moved to trash", {
      description: "You can still get it back.",
      action: { label: "Undo", onClick: () => toast.success("File restored") },
    })
  return (
    <div>
      <Toaster />
      <Button size="sm" variant="outline" onClick={remove}>Delete with undo</Button>
    </div>
  )
}
render(<Demo />)`,
      },
      {
        title: "Update in place",
        description: "Reuse an id to morph one toast through several states instead of stacking new ones.",
        code: `function Demo() {
  const run = () => {
    const id = toast.loading("Connecting…")
    setTimeout(() => toast.loading("Authenticating…", { id }), 900)
    setTimeout(() => toast.success("Connected", { id, duration: 3000 }), 1800)
  }
  return (
    <div>
      <Toaster />
      <Button size="sm" onClick={run}>Connect</Button>
    </div>
  )
}
render(<Demo />)`,
      },
    ],
  },
  {
    slug: "alert-dialog",
    title: "Alert Dialog",
    description: "A modal that interrupts to confirm a destructive action.",
    code: `render(
  <AlertDialog>
    <AlertDialogTrigger asChild><Button variant="destructive">Delete account</Button></AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>This permanently deletes your account and all data.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel asChild><Button variant="ghost">Cancel</Button></AlertDialogCancel>
        <AlertDialogAction asChild><Button variant="destructive">Delete</Button></AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)`,
  },
  {
    slug: "popover",
    title: "Popover",
    description: "Rich floating content anchored to a trigger.",
    code: `render(
  <Popover>
    <PopoverTrigger asChild><Button variant="outline">Open popover</Button></PopoverTrigger>
    <PopoverContent>
      <p className="font-semibold text-fg">Dimensions</p>
      <p className="mt-1 text-sm text-muted">Set the width and height for the layer.</p>
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2"><Label className="w-16">Width</Label><Input defaultValue="100%" className="h-8" /></div>
        <div className="flex items-center gap-2"><Label className="w-16">Height</Label><Input defaultValue="24px" className="h-8" /></div>
      </div>
    </PopoverContent>
  </Popover>
)`,
  },
  {
    slug: "hover-card",
    title: "Hover Card",
    description: "A preview card shown on hover — great for profiles and links.",
    code: `render(
  <HoverCard>
    <HoverCardTrigger asChild><Button variant="link">@stacklyui</Button></HoverCardTrigger>
    <HoverCardContent>
      <div className="flex items-center gap-3">
        <Avatar><AvatarFallback>SB</AvatarFallback></Avatar>
        <div><p className="font-semibold text-fg">StacklyUI</p><p className="text-sm text-muted">Animated, accessible React components.</p></div>
      </div>
    </HoverCardContent>
  </HoverCard>
)`,
  },
  {
    slug: "collapsible",
    title: "Collapsible",
    description: "Show and hide a section of content.",
    code: `function Demo() {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-sm">
      <div className="flex items-center justify-between rounded-lg border border-border-strong px-4 py-2.5">
        <span className="text-sm font-medium">@stacklyui starred 3 repos</span>
        <CollapsibleTrigger asChild><Button size="sm" variant="ghost">{open ? "Hide" : "Show"}</Button></CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2 space-y-2">
        <div className="rounded-lg border border-border px-4 py-2 text-sm">@stacklyui/ui</div>
        <div className="rounded-lg border border-border px-4 py-2 text-sm">stackly-docs</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
render(<Demo />)`,
  },
  {
    slug: "aspect-ratio",
    title: "Aspect Ratio",
    description: "Lock content to a width/height ratio.",
    code: `render(
  <div className="w-full max-w-sm">
    <AspectRatio ratio={16 / 9}>
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-[linear-gradient(120deg,var(--color-accent),var(--color-accent-3))] font-mono text-sm text-white">16 / 9</div>
    </AspectRatio>
  </div>
)`,
  },
  {
    slug: "progress",
    title: "Progress",
    description: "A determinate progress bar with a gradient fill.",
    code: `function Demo() {
  const [value, setValue] = useState(66)
  return (
    <div className="w-full max-w-sm space-y-4">
      <Progress value={value} />
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setValue(Math.max(0, value - 10))}>-10</Button>
        <Button size="sm" variant="outline" onClick={() => setValue(Math.min(100, value + 10))}>+10</Button>
      </div>
    </div>
  )
}
render(<Demo />)`,
  },
  {
    slug: "slider",
    title: "Slider",
    description: "Pick a value or range along a track.",
    code: `render(
  <div className="w-full max-w-sm">
    <Slider defaultValue={[40]} max={100} step={1} />
  </div>
)`,
    examples: [
      {
        title: "Range",
        description: "Two thumbs for a min/max range.",
        code: `render(
  <div className="w-full max-w-sm">
    <Slider defaultValue={[25, 75]} max={100} step={1} />
  </div>
)`,
      },
    ],
  },
  {
    slug: "calendar",
    title: "Calendar",
    badge: "new",
    description:
      "A dependency-free date picker — single, multiple, or range selection with sliding month transitions, a month/year quick-jump, event markers, and preset shortcuts.",
    code: `function Demo() {
  const [date, setDate] = useState(new Date())
  const marks = { 12: "accent", 18: "accent-2", 24: "accent-3" }
  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        showToday
        markers={(d) => marks[d.getDate()]}
      />
      <p className="text-sm text-muted">
        {date ? date.toLocaleDateString(undefined, { dateStyle: "full" }) : "Pick a day"}
      </p>
    </div>
  )
}
render(<Demo />)`,
    usage:
      "No react-day-picker, no date-fns — just native Date + Intl. Set mode to single, multiple, or range. Click the month or year in the header to zoom out and jump across years. Use markers to drop coloured event dots on any day, presets for one-click ranges, and showToday for a Today/Clear footer. Arrow keys move day-by-day, Home/End jump to week edges, PageUp/PageDown change months (hold Shift for years).",
    examples: [
      {
        title: "Range across two months",
        description: "Drag from one day to another — hover previews the span before you commit.",
        code: `function Demo() {
  const [range, setRange] = useState({ from: undefined, to: undefined })
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      selected={range}
      onSelect={setRange}
    />
  )
}
render(<Demo />)`,
      },
      {
        title: "Multiple days",
        description: "Toggle any number of individual days on and off.",
        code: `function Demo() {
  const [days, setDays] = useState([])
  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar mode="multiple" selected={days} onSelect={setDays} />
      <p className="text-sm text-muted">{days.length} day(s) selected</p>
    </div>
  )
}
render(<Demo />)`,
      },
      {
        title: "Week numbers & Monday start",
        description: "ISO week column, weeks starting on Monday, no outside days.",
        code: `render(
  <Calendar
    weekStartsOn={1}
    showWeekNumbers
    showOutsideDays={false}
  />
)`,
      },
      {
        title: "Bounded & disabled days",
        description: "Limit the window with fromDate/toDate and grey out weekends via disabled.",
        code: `function Demo() {
  const today = new Date()
  const in30 = new Date()
  in30.setDate(today.getDate() + 30)
  return (
    <Calendar
      mode="single"
      fromDate={today}
      toDate={in30}
      disabled={(d) => d.getDay() === 0 || d.getDay() === 6}
    />
  )
}
render(<Demo />)`,
      },
      {
        title: "Range with quick-pick presets",
        description: "A side rail of one-click shortcuts — the range picker analytics dashboards ship.",
        code: `function Demo() {
  const [range, setRange] = useState({ from: undefined, to: undefined })
  const days = (n) => {
    const to = new Date()
    const from = new Date()
    from.setDate(to.getDate() - (n - 1))
    return { from, to }
  }
  const monthToDate = () => {
    const to = new Date()
    return { from: new Date(to.getFullYear(), to.getMonth(), 1), to }
  }
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      selected={range}
      onSelect={setRange}
      showToday
      presets={[
        { label: "Today", value: () => ({ from: new Date(), to: new Date() }) },
        { label: "Last 7 days", value: () => days(7) },
        { label: "Last 30 days", value: () => days(30) },
        { label: "Month to date", value: monthToDate },
      ]}
    />
  )
}
render(<Demo />)`,
      },
      {
        title: "Event markers",
        description: "Drop up to three coloured dots on any day — meetings, deadlines, availability.",
        code: `function Demo() {
  const events = {
    9: ["accent"],
    14: ["accent", "accent-2"],
    18: ["destructive"],
    23: ["accent-3", "accent", "accent-2"],
  }
  return (
    <Calendar
      mode="single"
      defaultSelected={new Date()}
      markers={(d) => events[d.getDate()]}
    />
  )
}
render(<Demo />)`,
      },
    ],
  },
  {
    slug: "date-picker",
    title: "Date Picker",
    badge: "new",
    description:
      "A polished date field — a formatted trigger wired to the dependency-free Calendar in a popover. Single or range mode, dual-month panels, quick-pick presets, colour-coded markers, a clearable value, and native form support.",
    code: `function Demo() {
  const [date, setDate] = useState()
  return (
    <div className="w-64">
      <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
    </div>
  )
}
render(<Demo />)`,
    usage:
      "Built on the self-contained Calendar + Popover — native Date + Intl, no react-day-picker or date-fns. Set mode to single or range (range defaults to two side-by-side months). The trigger label is formatted with Intl.DateTimeFormat — tune it with formatOptions + locale, or pass a fully custom format function. Bound the window with fromDate / toDate, grey out days with disabledDate, drop event dots with markers, and add one-click ranges with presets. clearable shows a reset ×; closeOnSelect closes once a (complete) selection is made. Works controlled (value + onChange) or uncontrolled (defaultValue), and emits hidden inputs when you pass name (name.from / name.to in range mode).",
    examples: [
      {
        title: "Range with presets",
        description: "Two months side by side, plus a rail of one-click shortcuts.",
        code: `function Demo() {
  const [range, setRange] = useState()
  const days = (n) => {
    const to = new Date()
    const from = new Date()
    from.setDate(to.getDate() - (n - 1))
    return { from, to }
  }
  return (
    <div className="w-72">
      <DatePicker
        mode="range"
        value={range}
        onChange={setRange}
        placeholder="Pick a range"
        presets={[
          { label: "Last 7 days", value: () => days(7) },
          { label: "Last 30 days", value: () => days(30) },
        ]}
      />
    </div>
  )
}
render(<Demo />)`,
      },
      {
        title: "Bounded & custom format",
        description: "Weekdays only for the next 60 days, with a long-form label.",
        code: `function Demo() {
  const [date, setDate] = useState()
  const today = new Date()
  const in60 = new Date()
  in60.setDate(today.getDate() + 60)
  return (
    <div className="w-64">
      <DatePicker
        value={date}
        onChange={setDate}
        fromDate={today}
        toDate={in60}
        disabledDate={(d) => d.getDay() === 0 || d.getDay() === 6}
        formatOptions={{ weekday: "short", month: "long", day: "numeric" }}
        placeholder="Weekdays only"
      />
    </div>
  )
}
render(<Demo />)`,
      },
    ],
  },
  {
    slug: "toggle",
    title: "Toggle",
    description: "A button that stays pressed on.",
    code: `render(
  <Toggle aria-label="Bold">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z"/></svg>
    Bold
  </Toggle>
)`,
  },
  {
    slug: "toggle-group",
    title: "Toggle Group",
    description: "A set of toggles — single or multiple selection.",
    code: `render(
  <ToggleGroup type="single" defaultValue="center">
    <ToggleGroupItem value="left" aria-label="Left">L</ToggleGroupItem>
    <ToggleGroupItem value="center" aria-label="Center">C</ToggleGroupItem>
    <ToggleGroupItem value="right" aria-label="Right">R</ToggleGroupItem>
  </ToggleGroup>
)`,
    examples: [
      {
        title: "Multiple",
        code: `render(
  <ToggleGroup type="multiple" defaultValue={["bold"]}>
    <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
    <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
    <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
  </ToggleGroup>
)`,
      },
    ],
  },
  {
    slug: "breadcrumb",
    title: "Breadcrumb",
    description: "Shows the path to the current page.",
    code: `render(
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbLink href="#">Components</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
)`,
  },
  {
    slug: "pagination",
    title: "Pagination",
    badge: "new",
    description:
      "A batteries-included, stateful pagination control — give it a total and it computes the page count, the ellipsis-truncated range, the summary line, and the disabled edge states. The active page is an accent pill that glides between numbers.",
    code: `function Demo() {
  const [page, setPage] = useState(3)
  return (
    <div className="w-full max-w-md">
      <Pagination
        page={page}
        onPageChange={setPage}
        total={240}
        pageSize={10}
        size="sm"
        showSummary
        showProgress
      />
    </div>
  )
}
render(<Demo />)`,
    usage:
      "Unlike a bag of static links, this is stateful: pass total (and optionally pageSize) and it derives the page count, the ellipsis-truncated range, and the “Showing 1–10 of 240” summary — or set pageCount explicitly. Every control lives inside one raised “paper rail” so the pager reads as a single object, and the active page is an accent pill that glides between numbers via Motion's layoutId. Opt into showSummary, showJumper (a go-to-page input), and pageSizeOptions + onPageSizeChange for an instant rows-per-page picker; flip on showProgress for a slim accent meter that tracks page ÷ count. Tune density with siblingCount / boundaryCount, toggle first/last jumps with showEdges, and pick a size. Controlled via page + onPageChange or uncontrolled via defaultPage. The exported paginationRange helper returns the raw item array if you want to render your own markup.",
    examples: [
      {
        title: "Data-table controls",
        description: "Summary, a rows-per-page picker, and a go-to-page jumper — everything a table footer needs.",
        code: `function Demo() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  return (
    <Pagination
      page={page}
      onPageChange={setPage}
      total={1000}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      pageSizeOptions={[10, 20, 50, 100]}
      showSummary
      showJumper
    />
  )
}
render(<Demo />)`,
      },
      {
        title: "Compact, more siblings",
        description: "Small size, no edge jumps, two siblings each side of the current page.",
        code: `function Demo() {
  const [page, setPage] = useState(5)
  return (
    <Pagination
      page={page}
      onPageChange={setPage}
      pageCount={10}
      size="sm"
      showEdges={false}
      siblingCount={2}
    />
  )
}
render(<Demo />)`,
      },
    ],
  },
  {
    slug: "kbd",
    title: "Kbd",
    description: "Styled keyboard-key hints.",
    code: `render(
  <div className="flex items-center gap-1.5 text-sm text-muted">
    Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search
  </div>
)`,
  },
  {
    slug: "spinner",
    title: "Spinner",
    description: "An accessible loading indicator.",
    code: `render(
  <div className="flex items-center gap-4">
    <Spinner size={16} />
    <Spinner size={24} />
    <Spinner size={32} />
  </div>
)`,
  },
  {
    slug: "sheet",
    title: "Sheet",
    description: "A panel that slides in from an edge.",
    code: `render(
  <Sheet>
    <SheetTrigger asChild><Button variant="outline">Open sheet</Button></SheetTrigger>
    <SheetContent side="right">
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>Make changes and save when you're done.</SheetDescription>
      </SheetHeader>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="Soumyajit" />
      </div>
      <SheetClose asChild><Button className="mt-2">Save changes</Button></SheetClose>
    </SheetContent>
  </Sheet>
)`,
    examples: [
      {
        title: "Left side",
        code: `render(
  <Sheet>
    <SheetTrigger asChild><Button variant="outline">From left</Button></SheetTrigger>
    <SheetContent side="left">
      <SheetHeader><SheetTitle>Navigation</SheetTitle></SheetHeader>
      <nav className="grid gap-1 text-sm">
        <a className="rounded-lg px-3 py-2 hover:bg-surface-strong" href="#">Dashboard</a>
        <a className="rounded-lg px-3 py-2 hover:bg-surface-strong" href="#">Projects</a>
        <a className="rounded-lg px-3 py-2 hover:bg-surface-strong" href="#">Settings</a>
      </nav>
    </SheetContent>
  </Sheet>
)`,
      },
    ],
  },
];

export const PRIMITIVE_SLUGS = PRIMITIVES.map((p) => p.slug);

export function getPrimitive(slug: string): PrimitiveDoc | undefined {
  return PRIMITIVES.find((p) => p.slug === slug);
}
