"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const features = [
  "Find real local leads",
  "Save campaigns",
  "CRM pipeline",
  "AI outreach generator",
  "Revenue forecast",
  "Follow-up center",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <section className="relative px-6 py-8">
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-300/20 blur-[140px]" />
        <div className="absolute right-0 top-40 h-[400px] w-[400px] rounded-full bg-fuchsia-500/20 blur-[120px]" />

        <div className="relative mx-auto max-w-[1500px]">
          <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-6 py-4 backdrop-blur">
            <a href="/" className="text-2xl font-black tracking-tight">
              Pilako<span className="text-cyan-300">.</span>
            </a>

            <div className="flex items-center gap-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="rounded-full border border-white/15 px-5 py-2 text-sm font-bold hover:bg-white hover:text-black">
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <a
                  href="/dashboard"
                  className="rounded-full bg-cyan-300 px-5 py-2 text-sm font-black text-black hover:bg-cyan-200"
                >
                  Dashboard
                </a>
                <UserButton />
              </SignedIn>
            </div>
          </nav>

          <div className="grid items-center gap-12 py-24 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-200">
                AI Lead Generation CRM
              </div>

              <h1 className="mt-8 max-w-5xl text-6xl font-black leading-[0.95] tracking-tight md:text-8xl">
                Turn local search into a sales pipeline.
              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-8 text-slate-300">
                Pilako finds leads, saves campaigns, scores opportunities,
                tracks follow-ups, and generates AI outreach from one premium
                dashboard.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="rounded-full bg-cyan-300 px-8 py-4 text-lg font-black text-black shadow-[0_0_60px_rgba(103,232,249,0.35)] hover:bg-cyan-200">
                      Start free
                    </button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <a
                    href="/dashboard"
                    className="rounded-full bg-cyan-300 px-8 py-4 text-lg font-black text-black shadow-[0_0_60px_rgba(103,232,249,0.35)] hover:bg-cyan-200"
                  >
                    Open Dashboard
                  </a>
                </SignedIn>

                <a
                  href="#features"
                  className="rounded-full border border-white/15 bg-white/10 px-8 py-4 text-lg font-bold hover:bg-white hover:text-black"
                >
                  See features
                </a>
              </div>

              <div className="mt-12 grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-3">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-slate-200"
                  >
                    ✓ {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-cyan-300/20 blur-3xl" />
              <div className="relative rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm text-slate-400">Executive dashboard</p>
                    <h2 className="text-2xl font-black">Sales overview</h2>
                  </div>
                  <div className="rounded-full bg-green-400/10 px-4 py-2 text-sm font-bold text-green-200">
                    Live
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  {[
                    ["Campaigns", "24"],
                    ["Leads", "1,284"],
                    ["Pipeline", "$48.5K"],
                    ["Forecast", "$9.7K"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-3xl border border-white/10 bg-white/[0.05] p-5"
                    >
                      <p className="text-sm text-slate-400">{label}</p>
                      <h3 className="mt-2 text-4xl font-black">{value}</h3>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-black">Lead quality</p>
                    <p className="text-sm text-cyan-300">AI scored</p>
                  </div>

                  <div className="mt-5 space-y-4">
                    {[
                      ["Hot leads", "72%", "bg-red-300"],
                      ["Warm leads", "51%", "bg-yellow-300"],
                      ["Cold leads", "24%", "bg-slate-300"],
                    ].map(([label, width, color]) => (
                      <div key={label}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-slate-300">{label}</span>
                          <span className="text-slate-400">{width}</span>
                        </div>
                        <div className="h-3 rounded-full bg-white/10">
                          <div
                            className={`h-3 rounded-full ${color}`}
                            style={{ width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                  <p className="text-sm text-cyan-200">AI outreach</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    “Hi Team, I noticed your company serves the local market.
                    I had a quick idea that could help you find more qualified
                    customers...”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-[1500px]">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Built for speed
            </p>
            <h2 className="mt-4 text-5xl font-black">
              Everything you need before sending the first message.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              [
                "Find leads",
                "Search by niche and location, then save clean campaigns.",
              ],
              [
                "Score leads",
                "Automatically rank hot, warm, and cold opportunities.",
              ],
              [
                "Track pipeline",
                "Manage status, notes, follow-ups, and deal value.",
              ],
              [
                "Generate outreach",
                "Create cold emails, follow-ups, and LinkedIn messages.",
              ],
              [
                "Analyze revenue",
                "See pipeline value, forecast revenue, and top campaigns.",
              ],
              [
                "Search globally",
                "Find any lead across all campaigns in one place.",
              ],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 transition hover:-translate-y-1 hover:border-cyan-300/30"
              >
                <div className="mb-6 h-12 w-12 rounded-2xl bg-cyan-300/20" />
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-4 leading-7 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-[1500px] rounded-[3rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 via-white/[0.04] to-fuchsia-500/15 p-10 text-center">
          <h2 className="text-5xl font-black">
            Build your first lead pipeline today.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Start searching, saving, scoring, and contacting leads from one AI
            sales workspace.
          </p>

          <div className="mt-8">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="rounded-full bg-white px-8 py-4 text-lg font-black text-black hover:bg-cyan-200">
                  Get started
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <a
                href="/dashboard"
                className="inline-block rounded-full bg-white px-8 py-4 text-lg font-black text-black hover:bg-cyan-200"
              >
                Go to dashboard
              </a>
            </SignedIn>
          </div>
        </div>
      </section>
    </main>
  );
}