const leads = [
  {
    company: "Miami Yacht Services",
    website: "miamiyachtservices.com",
    email: "info@miamiyachtservices.com",
    phone: "+1 305 555 0182",
    location: "Miami, USA",
    score: "94%",
  },
  {
    company: "Atlantic Marine Repair",
    website: "atlanticmarinerepair.com",
    email: "contact@atlanticmarinerepair.com",
    phone: "+1 305 555 0144",
    location: "Miami, USA",
    score: "91%",
  },
  {
    company: "Biscayne Yacht Care",
    website: "biscayneyachtcare.com",
    email: "hello@biscayneyachtcare.com",
    phone: "+1 305 555 0199",
    location: "Miami, USA",
    score: "88%",
  },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <nav className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Pilako
            </p>
            <h1 className="mt-2 text-3xl font-black">AI Sales Employee</h1>
          </div>

          <a
            href="/"
            className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-bold"
          >
            Back Home
          </a>
        </nav>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Find leads</h2>
          <p className="mt-2 text-slate-400">
            Enter a niche and location. Pilako will prepare a lead list and
            outreach campaign.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <input
              className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none placeholder:text-slate-500"
              placeholder="Niche e.g. yacht repair companies"
            />
            <input
              className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none placeholder:text-slate-500"
              placeholder="Location e.g. Miami"
            />
            <button className="rounded-2xl bg-cyan-300 px-8 py-4 font-black text-black">
              Search Leads
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-4">
          {[
            ["247", "Leads found"],
            ["89", "Emails found"],
            ["64", "Websites found"],
            ["3", "Outreach drafts"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6"
            >
              <p className="text-3xl font-black">{number}</p>
              <p className="mt-2 text-sm text-slate-400">{label}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-black">Lead results</h2>
              <p className="mt-2 text-slate-400">
                Demo data now. Real search integration comes next.
              </p>
            </div>

            <div className="flex gap-3">
              <button className="rounded-full border border-white/15 px-5 py-3 font-bold">
                Export CSV
              </button>
              <button className="rounded-full bg-white px-5 py-3 font-black text-black">
                Generate Outreach
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead className="bg-white/[0.06] text-sm text-slate-300">
                <tr>
                  <th className="px-5 py-4">Company</th>
                  <th className="px-5 py-4">Website</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Score</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.company} className="border-t border-white/10">
                    <td className="px-5 py-4 font-bold">{lead.company}</td>
                    <td className="px-5 py-4 text-cyan-300">{lead.website}</td>
                    <td className="px-5 py-4 text-slate-300">{lead.email}</td>
                    <td className="px-5 py-4 text-slate-300">{lead.phone}</td>
                    <td className="px-5 py-4 text-slate-300">{lead.location}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-sm font-bold text-cyan-200">
                        {lead.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">AI outreach draft</h2>
            <div className="mt-5 rounded-2xl bg-black/30 p-5 text-slate-300">
              <p className="font-bold text-white">
                Subject: Quick question about your yacht repair services
              </p>
              <p className="mt-4 leading-7">
                Hi, I came across your company while researching yacht repair
                services in Miami. I noticed you work with boat owners who need
                reliable maintenance and repair support.
              </p>
              <p className="mt-4 leading-7">
                I wanted to reach out because there may be a simple way to help
                you attract more local customers searching for yacht repair in
                your area.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Campaign actions</h2>
            <div className="mt-5 grid gap-3">
              {[
                "Save campaign",
                "Export leads",
                "Generate follow-up 1",
                "Generate follow-up 2",
              ].map((item) => (
                <button
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-left font-bold"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}