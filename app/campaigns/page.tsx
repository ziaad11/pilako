"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Campaign = {
  id: number;
  name: string;
  niche: string;
  location: string;
  leads_count: number;
  emails_count: number;
  created_at: string;
};

export default function CampaignsPage() {
  const { user } = useUser();
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  async function loadCampaigns() {
    if (!user?.id) return;

    try {
      setLoading(true);

      const response = await fetch(`/api/campaigns?user_id=${user.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load campaigns");
      }

      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, [user?.id]);

  const filteredCampaigns = useMemo(() => {
    const query = search.toLowerCase().trim();

    let result = campaigns.filter((campaign) =>
      `${campaign.name} ${campaign.niche} ${campaign.location}`
        .toLowerCase()
        .includes(query)
    );

    if (sortBy === "oldest") {
      result = [...result].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }

    if (sortBy === "newest") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    if (sortBy === "most-leads") {
      result = [...result].sort((a, b) => b.leads_count - a.leads_count);
    }

    if (sortBy === "most-emails") {
      result = [...result].sort((a, b) => b.emails_count - a.emails_count);
    }

    return result;
  }, [campaigns, search, sortBy]);

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-8 text-white">
      <div className="mx-auto max-w-[1500px]">
        <nav className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Pilako
            </p>
            <h1 className="mt-2 text-4xl font-black">My Campaigns</h1>
          </div>

          <a
            href="/dashboard"
            className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-bold transition hover:bg-white hover:text-black"
          >
            Back to Dashboard
          </a>
        </nav>

        <section className="mt-10 rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-white/[0.04] to-fuchsia-500/10 p-6 shadow-[0_0_80px_rgba(34,211,238,0.10)]">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-3xl font-black">Saved campaigns</h2>
              <p className="mt-2 text-slate-400">
                Search, sort, and open your saved lead campaigns.
              </p>
            </div>

            <div className="grid w-full gap-3 md:grid-cols-[1fr_auto] lg:w-[720px]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by campaign, niche, or location..."
                className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none focus:border-cyan-300/60"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="most-leads">Most leads</option>
                <option value="most-emails">Most emails</option>
              </select>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-4">
            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
              <p className="text-sm text-slate-400">Total Campaigns</p>
              <h3 className="mt-2 text-4xl font-black">{campaigns.length}</h3>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
              <p className="text-sm text-slate-400">Visible Results</p>
              <h3 className="mt-2 text-4xl font-black">
                {filteredCampaigns.length}
              </h3>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
              <p className="text-sm text-slate-400">Total Leads</p>
              <h3 className="mt-2 text-4xl font-black">
                {campaigns.reduce((sum, item) => sum + item.leads_count, 0)}
              </h3>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
              <p className="text-sm text-slate-400">Emails Found</p>
              <h3 className="mt-2 text-4xl font-black">
                {campaigns.reduce((sum, item) => sum + item.emails_count, 0)}
              </h3>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead className="bg-white/[0.06] text-sm text-slate-300">
                <tr>
                  <th className="px-5 py-4">Campaign</th>
                  <th className="px-5 py-4">Niche</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Leads</th>
                  <th className="px-5 py-4">Emails</th>
                  <th className="px-5 py-4">Created</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-slate-400"
                    >
                      Loading campaigns...
                    </td>
                  </tr>
                ) : filteredCampaigns.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-slate-400"
                    >
                      No campaigns found.
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      onClick={() => router.push(`/campaigns/${campaign.id}`)}
                      className="cursor-pointer border-t border-white/10 transition hover:bg-cyan-300/10"
                    >
                      <td className="px-5 py-5 font-black">{campaign.name}</td>
                      <td className="px-5 py-5 text-slate-300">
                        {campaign.niche}
                      </td>
                      <td className="px-5 py-5 text-slate-300">
                        {campaign.location}
                      </td>
                      <td className="px-5 py-5 font-bold text-cyan-300">
                        {campaign.leads_count}
                      </td>
                      <td className="px-5 py-5 font-bold text-cyan-300">
                        {campaign.emails_count}
                      </td>
                      <td className="px-5 py-5 text-slate-400">
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}