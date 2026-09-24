import type { Metadata } from "next";
import { PrimitivesGallery } from "@/components/primitives-gallery";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Every StacklyUI primitive — buttons, inputs, overlays and more — shown live. Built on Radix, dressed in a warm design with micro-motion.",
};

export default function ComponentsPage() {
  return (
    <main className="pt-[4.5rem]">
      <PrimitivesGallery />
      <SiteFooter />
    </main>
  );
}
