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
          <header className="rounded-2xl border border-[#2f3b56] bg-[#151b2e] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <p className="text-xs uppercase tracking-[0.4em] text-[#8a96c9]">
              {accentLabel}
            </p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">
                  {title}
                </h1>
                {description ? (
                  <p className="mt-3 max-w-2xl text-sm text-white/70">
                    {description}
                  </p>
                ) : null}
              </div>
            </div>
          </header>

          {children}
        </section>

        <aside className="w-full lg:col-start-2 lg:row-start-1">
          <ChatSidebar />
        </aside>
      </main>
    </div>
  );
}
