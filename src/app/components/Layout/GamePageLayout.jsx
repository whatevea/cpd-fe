import ChatSidebar from "@/app/components/Chat/ChatSidebar";

export default function GamePageLayout({
  title,
  description,
  accentLabel = "Arcade mode",
  children,
}) {
  return (
    <div className="min-h-screen bg-[#101622] text-white">
      <main className="mx-auto flex w-full flex-col gap-8 px-4 pb-12 pt-28 lg:grid lg:w-[85%] lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:px-0 xl:w-[80%]">
        <section className="w-full space-y-6">
          {children}
        </section>

        <aside className="w-full lg:col-start-2 lg:row-start-1">
          <ChatSidebar />
        </aside>
      </main>
    </div>
  );
}
