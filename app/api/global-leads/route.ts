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
      .select("id, name, niche, location, leads(*)")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const leads = (campaigns || []).flatMap((campaign: any) =>
      (campaign.leads || []).map((lead: any) => {
        const leadScore = calculateLeadScore(lead);

        return {
          ...lead,
          campaign_id: campaign.id,
          campaign_name: campaign.name,
          campaign_niche: campaign.niche,
          campaign_location: campaign.location,
          leadScore,
          temperature:
            leadScore >= 80 ? "Hot" : leadScore >= 50 ? "Warm" : "Cold",
        };
      })
    );

    return NextResponse.json({ leads });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}