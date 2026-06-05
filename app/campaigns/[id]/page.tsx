"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Campaign = {
  id: string;
  name: string;
  niche: string;
  location: string;
  leads_count: number;
  emails_count: number;
  created_at: string;
};

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = params.id;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaign() {
      try {
        const res = await fetch("/api/campaigns");
        const data = await res.json();

        const found = data.campaigns?.find(
          (c: Campaign) => c.id.toString() === campaignId
        );

        setCampaign(found || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadCampaign();
  }, [campaignId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        Loading...
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        Campaign not found
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Pilako
            </p>

            <h1 className="mt-2 text-3xl font-black">
              {campaign.name}
            </h1>
          </div>

          <a
            href="/campaigns"
            className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-bold hover:bg-white hover:text-black"
          >
            Back
          </a>
        </nav>

        <div className="mt-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-slate-400">Niche</p>
            <p className="mt-2 text-xl font-black">
              {campaign.niche}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-slate-400">Location</p>
            <p className="mt-2 text-xl font-black">
              {campaign.location}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-slate-400">Leads</p>
            <p className="mt-2 text-xl font-black">
              {campaign.leads_count}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-slate-400">Emails</p>
            <p className="mt-2 text-xl font-black">
              {campaign.emails_count}
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">
            Saved Leads
          </h2>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-10 text-center text-slate-400">
            Leads table coming next...
          </div>
        </section>
      </div>
    </main>
  );
}