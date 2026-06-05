"use client";

import { useEffect, useState } from "react";
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

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Pilako
            </p>
            <h1 className="mt-2 text-3xl font-black">My Campaigns</h1>
          </div>

          <a
            href="/dashboard"
            className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-bold transition hover:bg-white hover:text-black"
          >
            Back to Dashboard
          </a>
        </nav>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Saved campaigns</h2>
          <p className="mt-2 text-slate-400">
            Click any campaign to open its saved leads.
          </p>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[800px] border-collapse text-left">
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
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                      Loading campaigns...
                    </td>
                  </tr>
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                      No campaigns saved yet.
                    </td>
                  </tr>
                ) : (
                  campaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      onClick={() => router.push(`/campaigns/${campaign.id}`)}
                      className="cursor-pointer border-t border-white/10 transition hover:bg-cyan-300/10"
                    >
                      <td className="px-5 py-4 font-bold">
                        {campaign.name}
                      </td>
                      <td className="px-5 py-4 text-slate-300">
                        {campaign.niche}
                      </td>
                      <td className="px-5 py-4 text-slate-300">
                        {campaign.location}
                      </td>
                      <td className="px-5 py-4 text-cyan-300">
                        {campaign.leads_count}
                      </td>
                      <td className="px-5 py-4 text-cyan-300">
                        {campaign.emails_count}
                      </td>
                      <td className="px-5 py-4 text-slate-400">
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