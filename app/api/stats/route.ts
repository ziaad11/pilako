import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

function hasValue(value: string | null | undefined) {
  if (!value) return false;

  const cleaned = value.toLowerCase().trim();

  return (
    cleaned !== "" &&
    cleaned !== "not found" &&
    cleaned !== "not provided" &&
    cleaned !== "n/a" &&
    cleaned !== "unknown"
  );
}

function calculateLeadScore(lead: any) {
  let score = 0;

  if (hasValue(lead.website)) score += 25;
  if (hasValue(lead.email)) score += 30;
  if (hasValue(lead.phone)) score += 20;
  if (hasValue(lead.location)) score += 10;
  if (hasValue(lead.score)) score += 15;

  return Math.min(score, 100);
}

export async function GET(req: Request) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const { data: campaigns, error } = await supabase
      .from("campaigns")
      .select("*, leads(*)")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const allCampaigns = campaigns || [];
    const allLeads = allCampaigns.flatMap((campaign: any) =>
      (campaign.leads || []).map((lead: any) => ({
        ...lead,
        campaign_id: campaign.id,
        campaign_name: campaign.name,
        campaign_location: campaign.location,
        campaign_niche: campaign.niche,
      }))
    );

    const totalCampaigns = allCampaigns.length;
    const totalLeads = allLeads.length;

    const totalEmails = allLeads.filter(
      (lead: any) =>
        lead.email &&
        lead.email !== "Not found" &&
        lead.email !== "Not provided"
    ).length;

    const conversionRate =
      totalLeads > 0 ? Math.round((totalEmails / totalLeads) * 100) : 0;

    const pipelineValue = allLeads.reduce(
      (sum: number, lead: any) => sum + Number(lead.deal_value || 0),
      0
    );

    const averageDealSize =
      totalLeads > 0 ? Math.round(pipelineValue / totalLeads) : 0;

    const forecastRevenue = Math.round(pipelineValue * 0.2);

    const today = new Date().toISOString().slice(0, 10);

    const followUpsOverdue = allLeads.filter(
      (lead: any) => lead.follow_up_date && lead.follow_up_date < today
    );

    const followUpsToday = allLeads.filter(
      (lead: any) => lead.follow_up_date && lead.follow_up_date === today
    );

    const followUpsUpcoming = allLeads
      .filter((lead: any) => lead.follow_up_date && lead.follow_up_date > today)
      .sort((a: any, b: any) =>
        String(a.follow_up_date).localeCompare(String(b.follow_up_date))
      )
      .slice(0, 8);

    const closedDeals = allLeads.filter(
      (lead: any) => lead.status === "Closed"
    ).length;

    const scoredLeads = allLeads.map((lead: any) => {
      const leadScore = calculateLeadScore(lead);

      return {
        ...lead,
        leadScore,
        temperature:
          leadScore >= 80 ? "Hot" : leadScore >= 50 ? "Warm" : "Cold",
      };
    });

    const hotLeads = scoredLeads.filter((lead: any) => lead.leadScore >= 80).length;
    const warmLeads = scoredLeads.filter(
      (lead: any) => lead.leadScore >= 50 && lead.leadScore < 80
    ).length;
    const coldLeads = scoredLeads.filter((lead: any) => lead.leadScore < 50).length;

    const topLeads = [...scoredLeads]
      .sort((a: any, b: any) => b.leadScore - a.leadScore)
      .slice(0, 8)
      .map((lead: any) => ({
        id: lead.id,
        campaign_id: lead.campaign_id,
        company: lead.company,
        location: lead.location,
        email: lead.email,
        phone: lead.phone,
        leadScore: lead.leadScore,
        temperature: lead.temperature,
      }));

    const topLocations = Object.values(
      allCampaigns.reduce((acc: Record<string, any>, campaign: any) => {
        const key = campaign.location || "Unknown";

        if (!acc[key]) {
          acc[key] = { location: key, leads: 0, campaigns: 0 };
        }

        acc[key].leads += campaign.leads_count || 0;
        acc[key].campaigns += 1;

        return acc;
      }, {})
    )
      .sort((a: any, b: any) => b.leads - a.leads)
      .slice(0, 5);

    const topNiches = Object.values(
      allCampaigns.reduce((acc: Record<string, any>, campaign: any) => {
        const key = campaign.niche || "Unknown";

        if (!acc[key]) {
          acc[key] = { niche: key, leads: 0, campaigns: 0 };
        }

        acc[key].leads += campaign.leads_count || 0;
        acc[key].campaigns += 1;

        return acc;
      }, {})
    )
      .sort((a: any, b: any) => b.leads - a.leads)
      .slice(0, 5);

    const recentCampaigns = allCampaigns.slice(0, 5);

    const topCampaigns = [...allCampaigns]
      .sort((a: any, b: any) => (b.leads_count || 0) - (a.leads_count || 0))
      .slice(0, 5)
      .map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name,
        location: campaign.location,
        niche: campaign.niche,
        leads_count: campaign.leads_count || 0,
        emails_count: campaign.emails_count || 0,
      }));

    const recentActivity = allCampaigns.slice(0, 8).map((campaign: any) => ({
      id: campaign.id,
      title: campaign.name,
      description: `${campaign.leads_count || 0} leads saved in ${campaign.location}`,
      created_at: campaign.created_at,
    }));

    return NextResponse.json({
      totalCampaigns,
      totalLeads,
      totalEmails,
      conversionRate,
      pipelineValue,
      forecastRevenue,
      averageDealSize,
      followUpsDue: followUpsOverdue.length + followUpsToday.length,
      followUpsOverdue: followUpsOverdue.slice(0, 8),
      followUpsToday: followUpsToday.slice(0, 8),
      followUpsUpcoming,
      closedDeals,
      hotLeads,
      warmLeads,
      coldLeads,
      topLeads,
      topLocations,
      topNiches,
      recentCampaigns,
      topCampaigns,
      recentActivity,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}