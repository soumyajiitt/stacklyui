import { DocsSidebar } from "@/components/docs-sidebar";
import { SiteFooter } from "@/components/site-footer";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto flex max-w-[86rem] gap-10 px-5 pt-[4.5rem] sm:px-8">
        <aside className="sticky top-[4.5rem] hidden h-[calc(100vh-4.5rem)] w-56 shrink-0 overflow-y-auto py-12 lg:block">
          <DocsSidebar />
        </aside>
        <div className="min-w-0 flex-1 py-12">{children}</div>
      </div>
      <SiteFooter />
    </>
  );
}
