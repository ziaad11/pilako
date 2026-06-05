"use client";

import { useParams } from "next/navigation";

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = params.id;

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Pilako
            </p>
            <h1 className="mt-2 text-3xl font-black">Campaign Details</h1>
          </div>

          <a
            href="/campaigns"
            className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-bold transition hover:bg-white hover:text-black"
          >
            Back to Campaigns
          </a>
        </nav>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Campaign
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Campaign #{campaignId}
          </h2>

          <p className="mt-3 text-slate-400">
            Soon, this page will show saved leads, emails, and outreach messages
            for this campaign.
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Leads</h2>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-10 text-center text-slate-400">
            No leads saved for this campaign yet.
          </div>
        </section>
      </div>
    </main>
  );
}