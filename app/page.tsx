const leads = [
  { name: "Atlas Dental Clinic", location: "Casablanca", email: "contact found", score: "94%" },
  { name: "Dubai Legal Partners", location: "Dubai", email: "email found", score: "91%" },
  { name: "Miami Yacht Services", location: "Miami", email: "website found", score: "88%" },
];

const useCases = [
  "Agencies",
  "Freelancers",
  "SaaS teams",
  "Local services",
  "Real estate",
  "Recruiters",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.22),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.22),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(14,165,233,0.12),transparent_35%)]" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-400 text-lg font-black text-black">
            P
          </div>
          <span className="text-2xl font-black tracking-tight">Pilako</span>
        </div>

        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#product">Product</a>
          <a href="#usecases">Use cases</a>
          <a href="#pricing">Pricing</a>
        </div>

        <button className="rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur-xl">
          Get Started
        </button>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            AI Lead Generation Employee
          </div>

          <h1 className="max-w-4xl text-6xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Find leads.
            <br />
            Extract emails.
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
              Send outreach.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
            Pilako is your AI sales employee that finds companies, collects public
            contact data, writes personalized cold emails, and turns prospecting
            into a repeatable system.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
  href="/dashboard"
  className="rounded-full bg-cyan-300 px-8 py-4 font-black text-slate-950 shadow-[0_0_60px_rgba(103,232,249,0.35)]"
>
  Find My First Leads
</a>
            <button className="rounded-full border border-white/15 bg-white/[0.06] px-8 py-4 font-bold backdrop-blur">
              View Demo
            </button>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 text-sm">
            {["Lead search", "Email finder", "AI outreach"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-slate-300">
                ✓ {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -right-12 top-20 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative rotate-0 rounded-[2rem] border border-white/15 bg-white/[0.08] p-4 shadow-2xl backdrop-blur-2xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#050816] p-5">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Live campaign</p>
                  <h3 className="mt-1 text-2xl font-black">Find new customers</h3>
                </div>
                <div className="rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
                  Active
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
                <p className="text-sm text-slate-400">Target</p>
                <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-black/30 px-4 py-4">
                  <span className="font-semibold">Yacht repair companies in Miami</span>
                  <button className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-black text-black">
                    Search
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {leads.map((lead) => (
                  <div
                    key={lead.name}
                    className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.045] p-4 transition hover:bg-white/[0.08]"
                  >
                    <div>
                      <p className="font-bold">{lead.name}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {lead.location} • {lead.email}
                      </p>
                    </div>
                    <div className="rounded-full bg-cyan-300/10 px-3 py-1 text-sm font-bold text-cyan-200">
                      {lead.score}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/[0.05] p-4">
                  <p className="text-2xl font-black">247</p>
                  <p className="text-xs text-slate-400">leads found</p>
                </div>
                <div className="rounded-2xl bg-white/[0.05] p-4">
                  <p className="text-2xl font-black">89</p>
                  <p className="text-xs text-slate-400">emails</p>
                </div>
                <div className="rounded-2xl bg-white/[0.05] p-4">
                  <p className="text-2xl font-black">3</p>
                  <p className="text-xs text-slate-400">follow-ups</p>
                </div>
              </div>

              <button className="mt-5 w-full rounded-2xl bg-white px-5 py-4 font-black text-black">
                Generate Personalized Outreach
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">Product</p>
          <h2 className="mt-4 text-4xl font-black md:text-6xl">
            Replace manual prospecting with an AI sales workflow.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ["01", "Lead discovery", "Find businesses by niche, city, country, service, or keyword."],
            ["02", "Contact extraction", "Collect public websites, emails, phone numbers, and contact pages."],
            ["03", "AI outreach", "Generate cold emails, follow-ups, and campaign messages instantly."],
          ].map(([num, title, text]) => (
            <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8">
              <p className="text-cyan-300">{num}</p>
              <h3 className="mt-6 text-2xl font-black">{title}</h3>
              <p className="mt-4 leading-7 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="usecases" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-8 md:p-12">
          <h2 className="text-4xl font-black">Built for anyone who sells.</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {useCases.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-black/25 px-5 py-3 text-slate-300">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-black md:text-5xl">Simple pricing</h2>
          <p className="mt-4 text-slate-400">Start with leads. Scale into outreach.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ["Starter", "$29", "500 leads/month"],
            ["Growth", "$79", "5,000 leads/month"],
            ["Agency", "$199", "25,000 leads/month"],
          ].map(([plan, price, limit]) => (
            <div key={plan} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8">
              <h3 className="text-2xl font-black">{plan}</h3>
              <p className="mt-5 text-5xl font-black">{price}<span className="text-lg text-slate-400">/mo</span></p>
              <p className="mt-4 text-slate-400">{limit}</p>
              <button className="mt-8 w-full rounded-full bg-white px-5 py-4 font-black text-black">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}