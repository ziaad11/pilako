"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
        <a href="/" className="text-2xl font-black">Pilako</a>

        <div className="flex items-center gap-3">
          {!isLoaded ? null : isSignedIn ? (
            <>
              <a
                href="/dashboard"
                className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-black text-black"
              >
                Dashboard
              </a>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-black text-black">
                  Get Started
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2">
        <div>
          <p className="mb-6 inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
            AI Employee Platform
          </p>

          <h1 className="text-6xl font-black leading-[0.95] md:text-8xl">
            Hire an
            <br />
            AI Sales
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
              Employee.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
            Pilako finds leads, discovers public emails, generates personalized outreach,
            and exports ready-to-use sales campaigns in minutes.
          </p>

          <div className="mt-10 flex gap-4">
            {isSignedIn ? (
              <a
                href="/dashboard"
                className="rounded-full bg-cyan-300 px-8 py-4 font-black text-black"
              >
                Open Dashboard
              </a>
            ) : (
              <SignUpButton mode="modal">
                <button className="rounded-full bg-cyan-300 px-8 py-4 font-black text-black">
                  Start Free
                </button>
              </SignUpButton>
            )}

            <a
              href="#features"
              className="rounded-full border border-white/15 px-8 py-4 font-bold"
            >
              See Features
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Live workflow
          </p>
          <h2 className="mt-3 text-3xl font-black">Dubai Law Firms</h2>

          <div className="mt-6 grid gap-4">
            {[
              ["Al Noor Legal Group", "website found", "4.8/5"],
              ["Dubai Legal Partners", "email found", "4.6/5"],
              ["Emirates Corporate Law", "phone found", "4.7/5"],
            ].map(([name, status, score]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 p-4"
              >
                <div>
                  <p className="font-bold">{name}</p>
                  <p className="text-sm text-slate-400">{status}</p>
                </div>
                <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-200">
                  {score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-4xl font-black">Everything for outbound sales.</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            "Real lead search",
            "Public email finder",
            "AI cold outreach",
            "Bulk personalized emails",
            "CSV export",
            "Manual lead entry",
          ].map((item) => (
            <div key={item} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
              <h3 className="text-2xl font-black">{item}</h3>
              <p className="mt-4 text-slate-400">
                Built inside your AI Sales Employee dashboard.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}