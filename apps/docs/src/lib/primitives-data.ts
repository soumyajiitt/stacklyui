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
