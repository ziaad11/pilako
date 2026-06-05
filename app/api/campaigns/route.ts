import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Lead = {
  company: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  score: string;
};

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    const body = await req.json();

    const {
      user_id,
      name,
      niche,
      location,
      leads_count,
      emails_count,
      leads,
    } = body;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .insert({
        user_id,
        name,
        niche,
        location,
        leads_count,
        emails_count,
      })
      .select()
      .single();

    if (campaignError) {
      return NextResponse.json(
        { error: campaignError.message },
        { status: 500 }
      );
    }

    if (Array.isArray(leads) && leads.length > 0) {
      const leadsToInsert = leads.map((lead: Lead) => ({
        campaign_id: campaign.id,
        company: lead.company,
        website: lead.website,
        email: lead.email,
        phone: lead.phone,
        location: lead.location,
        score: lead.score,
      }));

      const { error: leadsError } = await supabase
        .from("leads")
        .insert(leadsToInsert);

      if (leadsError) {
        return NextResponse.json(
          { error: leadsError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);

    const user_id = searchParams.get("user_id");
    const campaign_id = searchParams.get("campaign_id");

    if (campaign_id) {
      const { data: campaign, error: campaignError } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", campaign_id)
        .single();

      if (campaignError) {
        return NextResponse.json(
          { error: campaignError.message },
          { status: 500 }
        );
      }

      const { data: leads, error: leadsError } = await supabase
        .from("leads")
        .select("*")
        .eq("campaign_id", campaign_id)
        .order("created_at", { ascending: false });

      if (leadsError) {
        return NextResponse.json(
          { error: leadsError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        campaign,
        leads: leads || [],
      });
    }

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ campaigns: data || [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}