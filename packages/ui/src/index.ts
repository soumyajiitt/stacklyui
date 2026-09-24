// StacklyUI — public API surface.

// Utilities
export { cn } from "./lib/cn";

// Hooks
export { useReducedMotion } from "./hooks/use-reduced-motion";
export { useInView, type UseInViewOptions } from "./hooks/use-in-view";
export {
  usePointerVars,
  type PointerVarsOptions,
} from "./hooks/use-pointer-vars";

// Components
export {
  AuroraBackground,
  type AuroraBackgroundProps,
} from "./components/aurora-background";
export {
  SpotlightCard,
  type SpotlightCardProps,
} from "./components/spotlight-card";
export { Card3D, type Card3DProps } from "./components/card-3d";
export { GradientText, type GradientTextProps } from "./components/gradient-text";
export { Reveal, type RevealProps } from "./components/reveal";
export {
  BentoGrid,
  BentoCard,
  type BentoGridProps,
  type BentoCardProps,
} from "./components/bento-grid";
export { AnimatedBeam, type AnimatedBeamProps } from "./components/animated-beam";
export { Marquee, type MarqueeProps } from "./components/marquee";
export {
  MagneticButton,
  type MagneticButtonProps,
} from "./components/magnetic-button";
export {
  NumberTicker,
  type NumberTickerProps,
} from "./components/number-ticker";
export {
  ThemeProvider,
  ThemeScript,
  useTheme,
  type Theme,
  type ThemeProviderProps,
} from "./components/theme-provider";
export { ThemeToggle, type ThemeToggleProps } from "./components/theme-toggle";

// ---------------------------------------------------------------- Primitives
export {
  Button,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from "./components/button";
export { Badge, type BadgeProps, type BadgeVariant } from "./components/badge";
export { Input, type InputProps } from "./components/input";
export { Textarea, type TextareaProps } from "./components/textarea";
export { Label, type LabelProps } from "./components/label";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./components/card";
export { Separator, type SeparatorProps } from "./components/separator";
export { Avatar, AvatarImage, AvatarFallback } from "./components/avatar";
export { Skeleton, type SkeletonProps } from "./components/skeleton";
export { Checkbox, type CheckboxProps } from "./components/checkbox";
export { Switch, type SwitchProps } from "./components/switch";
export { RadioGroup, RadioGroupItem } from "./components/radio-group";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from "./components/select";
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabsProps,
} from "./components/tabs";
export {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./components/tooltip";
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./components/accordion";
export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/dialog";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./components/dropdown-menu";
export {
  Alert,
  AlertTitle,
  AlertDescription,
  type AlertProps,
  type AlertVariant,
} from "./components/alert";
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "./components/alert-dialog";
export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverContent,
} from "./components/popover";
export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "./components/hover-card";
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./components/collapsible";
export { AspectRatio } from "./components/aspect-ratio";
export { Progress, type ProgressProps } from "./components/progress";
export { Slider, type SliderProps } from "./components/slider";
export { Toggle, type ToggleProps } from "./components/toggle";
export { ToggleGroup, ToggleGroupItem } from "./components/toggle-group";
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/breadcrumb";
export { Kbd, type KbdProps } from "./components/kbd";
export { Spinner, type SpinnerProps } from "./components/spinner";
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./components/sheet";
