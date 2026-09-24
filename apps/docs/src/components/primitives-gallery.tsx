"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Reveal,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Alert,
  AlertTitle,
  AlertDescription,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Progress,
  Slider,
  ToggleGroup,
  ToggleGroupItem,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Kbd,
  Spinner,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@stacklyui/ui";
import { PRIMITIVES } from "@/lib/primitives-data";

function Stage({
  name,
  slug,
  span,
  children,
}: {
  name: string;
  slug: string;
  span?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className={span}>
      <div className="group/stage flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-accent/50">
        {/* Preview stage — solid, non-masked dotted backdrop so demos stay crisp */}
        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden p-8"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-border) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        >
          <div className="relative z-10 flex w-full items-center justify-center">
            {children}
          </div>
        </div>
        <Link
          href={`/docs/components/${slug}`}
          data-cursor="hover"
          className="flex items-center justify-between border-t border-border/70 px-4 py-2.5 transition-colors hover:bg-surface-strong"
        >
          <span className="eyebrow !text-[0.6rem]">{name}</span>
          <span className="flex items-center gap-1 text-[0.7rem] font-medium text-muted transition-colors group-hover/stage:text-accent">
            Open
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
        </Link>
      </div>
    </Reveal>
  );
}

function Group({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-20 first:mt-0">
      <Reveal className="mb-8 flex items-baseline gap-4 border-b border-line pb-4">
        <span className="rail-num">{index}</span>
        <h2 className="display text-3xl sm:text-4xl">{title}</h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}

export function PrimitivesGallery() {
  const [checked, setChecked] = useState(true);
  const [on, setOn] = useState(true);
  const [radio, setRadio] = useState("comfortable");

  return (
    <div className="relative mx-auto max-w-[86rem] px-5 py-16 sm:px-8">
      <div
        aria-hidden
        className="sui-page-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem]"
      />
      <div
        aria-hidden
        className="deco-ring pointer-events-none absolute -right-24 -top-16 -z-10 hidden h-[28rem] w-[28rem] lg:block"
      />

      <Reveal className="mb-14">
        <span className="eyebrow">[ UI kit ]</span>
        <h1 className="display mt-4 text-6xl sm:text-8xl">Components</h1>
        <p className="mt-5 max-w-xl border-l-2 border-accent pl-5 text-lg text-muted">
          The primitives you reach for every day — buttons, inputs, overlays and
          more. Built on Radix for rock-solid accessibility, dressed in
          StacklyUI&apos;s warm design and micro-motion.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {[
            { k: `${PRIMITIVES.length}+`, v: "Components" },
            { k: "Radix", v: "Accessibility core" },
            { k: "OKLCH", v: "Light & dark" },
            { k: "0", v: "Runtime lock-in" },
          ].map((s) => (
            <div key={s.v} className="border-l border-line pl-4">
              <div className="display text-2xl sm:text-3xl">{s.k}</div>
              <div className="eyebrow mt-1 !text-[0.55rem]">{s.v}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <TooltipProvider delayDuration={200}>
        {/* FORMS ---------------------------------------------------------- */}
        <Group index="01" title="Forms & inputs">
          <Stage name="Button" slug="button">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Delete</Button>
            </div>
          </Stage>

          <Stage name="Input & Label" slug="input">
            <div className="w-full max-w-[16rem] space-y-2">
              <Label htmlFor="g-email">Email</Label>
              <Input id="g-email" type="email" placeholder="you@stacklyui.in" />
            </div>
          </Stage>

          <Stage name="Textarea" slug="textarea">
            <div className="w-full max-w-[16rem] space-y-2">
              <Label htmlFor="g-msg">Message</Label>
              <Textarea id="g-msg" placeholder="Tell us what you think…" />
            </div>
          </Stage>

          <Stage name="Checkbox" slug="checkbox">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-fg">
              <Checkbox
                checked={checked}
                onCheckedChange={(v) => setChecked(v === true)}
              />
              Ship with animations
            </label>
          </Stage>

          <Stage name="Switch" slug="switch">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-fg">
              <Switch checked={on} onCheckedChange={setOn} />
              {on ? "Motion on" : "Motion off"}
            </label>
          </Stage>

          <Stage name="Radio Group" slug="radio-group">
            <RadioGroup value={radio} onValueChange={setRadio}>
              {["comfortable", "compact", "spacious"].map((v) => (
                <label key={v} className="flex cursor-pointer items-center gap-3 text-sm capitalize text-fg">
                  <RadioGroupItem value={v} />
                  {v}
                </label>
              ))}
            </RadioGroup>
          </Stage>

          <Stage name="Select" slug="select">
            <Select defaultValue="next">
              <SelectTrigger className="w-[13rem]">
                <SelectValue placeholder="Framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="next">Next.js</SelectItem>
                <SelectItem value="remix">Remix</SelectItem>
                <SelectItem value="astro">Astro</SelectItem>
                <SelectItem value="vite">Vite</SelectItem>
              </SelectContent>
            </Select>
          </Stage>
        </Group>

        {/* DISPLAY -------------------------------------------------------- */}
        <Group index="02" title="Display">
          <Stage name="Badge" slug="badge">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge>Soft</Badge>
              <Badge variant="solid">Solid</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="destructive">Error</Badge>
            </div>
          </Stage>

          <Stage name="Avatar" slug="avatar">
            <div className="flex items-center gap-3">
              <Avatar><AvatarFallback>SB</AvatarFallback></Avatar>
              <Avatar className="h-12 w-12"><AvatarFallback>UI</AvatarFallback></Avatar>
              <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">3D</AvatarFallback></Avatar>
            </div>
          </Stage>

          <Stage name="Card" slug="card">
            <Card className="w-full max-w-[16rem]">
              <CardHeader>
                <CardTitle>Pro plan</CardTitle>
                <CardDescription>Everything, unlocked.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted">
                Unlimited components and priority support.
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full">Upgrade</Button>
              </CardFooter>
            </Card>
          </Stage>

          <Stage name="Separator" slug="separator">
            <div className="flex h-6 items-center gap-4 text-sm text-muted">
              <span>Docs</span>
              <Separator orientation="vertical" />
              <span>Guides</span>
              <Separator orientation="vertical" />
              <span>API</span>
            </div>
          </Stage>

          <Stage name="Skeleton" slug="skeleton">
            <div className="flex w-full max-w-[15rem] items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3.5 w-1/2" />
              </div>
            </div>
          </Stage>

          <Stage name="Tooltip" slug="tooltip">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>Copy-paste or install — your call.</TooltipContent>
            </Tooltip>
          </Stage>
        </Group>

        {/* OVERLAYS & DISCLOSURE ----------------------------------------- */}
        <Group index="03" title="Overlays & disclosure">
          <Stage name="Dialog" slug="dialog">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete project?</DialogTitle>
                  <DialogDescription>
                    This action can&apos;t be undone. This will permanently remove
                    the project and its data.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="destructive">Delete</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Stage>

          <Stage name="Dropdown Menu" slug="dropdown-menu">
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
          </Stage>

          <Stage name="Tabs" slug="tabs">
            <Tabs defaultValue="preview" className="w-full max-w-[16rem]">
              <TabsList className="w-full">
                <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
                <TabsTrigger value="code" className="flex-1">Code</TabsTrigger>
                <TabsTrigger value="docs" className="flex-1">Docs</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="text-sm text-muted">Live component preview.</TabsContent>
              <TabsContent value="code" className="text-sm text-muted">Copy-paste source.</TabsContent>
              <TabsContent value="docs" className="text-sm text-muted">Full API reference.</TabsContent>
            </Tabs>
          </Stage>

          <Stage name="Accordion" slug="accordion" span="sm:col-span-2 lg:col-span-3">
            <Accordion type="single" collapsible defaultValue="a" className="w-full max-w-2xl">
              <AccordionItem value="a">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes — every interactive primitive is built on Radix, so keyboard
                  navigation, focus management and ARIA are handled for you.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="b">
                <AccordionTrigger>Can I copy-paste it?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. Use the registry CLI to drop the source into your
                  project, or install the npm package — same components either way.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="c">
                <AccordionTrigger>Does it support dark mode?</AccordionTrigger>
                <AccordionContent>
                  Both themes are tuned from the same OKLCH tokens. Toggle it in the
                  nav to see everything adapt.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Stage>
        </Group>

        {/* FEEDBACK & NAVIGATION ----------------------------------------- */}
        <Group index="04" title="Feedback & navigation">
          <Stage name="Alert" slug="alert" span="sm:col-span-2 lg:col-span-3">
            <Alert variant="info" className="w-full max-w-xl">
              <div>
                <AlertTitle>Heads up</AlertTitle>
                <AlertDescription>You can add components to your project via the registry CLI.</AlertDescription>
              </div>
            </Alert>
          </Stage>

          <Stage name="Progress" slug="progress">
            <div className="w-full max-w-[15rem]">
              <Progress value={66} />
            </div>
          </Stage>

          <Stage name="Slider" slug="slider">
            <div className="w-full max-w-[15rem]">
              <Slider defaultValue={[40]} max={100} step={1} />
            </div>
          </Stage>

          <Stage name="Spinner" slug="spinner">
            <div className="flex items-center gap-4">
              <Spinner size={18} />
              <Spinner size={26} />
              <Spinner size={34} />
            </div>
          </Stage>

          <Stage name="Toggle Group" slug="toggle-group">
            <ToggleGroup type="single" defaultValue="center">
              <ToggleGroupItem value="left" aria-label="Left">L</ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Center">C</ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Right">R</ToggleGroupItem>
            </ToggleGroup>
          </Stage>

          <Stage name="Kbd" slug="kbd">
            <div className="flex items-center gap-1.5 text-sm text-muted">
              Press <Kbd>⌘</Kbd> <Kbd>K</Kbd>
            </div>
          </Stage>

          <Stage name="Popover" slug="popover">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <p className="font-semibold text-fg">Dimensions</p>
                <p className="mt-1 text-sm text-muted">Set the width and height for the layer.</p>
              </PopoverContent>
            </Popover>
          </Stage>

          <Stage name="Sheet" slug="sheet">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open sheet</Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Edit profile</SheetTitle>
                  <SheetDescription>Make changes and save when you&apos;re done.</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </Stage>

          <Stage name="Breadcrumb" slug="breadcrumb">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Docs</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Stage>
        </Group>
      </TooltipProvider>

      {/* ALL COMPONENTS index ------------------------------------------- */}
      <div className="mt-24">
        <Reveal className="mb-8 flex items-baseline gap-4 border-b border-line pb-4">
          <span className="rail-num">05</span>
          <h2 className="display text-3xl sm:text-4xl">All components</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
          {PRIMITIVES.map((p) => (
            <Link
              key={p.slug}
              href={`/docs/components/${p.slug}`}
              data-cursor="hover"
              className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-surface-strong"
            >
              {p.title}
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-muted opacity-0 transition-opacity group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
