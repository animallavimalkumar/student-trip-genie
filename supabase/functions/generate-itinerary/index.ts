import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { source, destination, dates, duration, budget, interests, groupSize, transport, accommodation } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `Plan a student-friendly, budget trip with these details:
- Source: ${source || "Not specified"}
- Destination: ${destination || "Suggest the best destinations"}
- Duration: ${duration} days
- Budget: ₹${budget}
- Interests: ${interests?.join(", ") || "General"}
- Group size: ${groupSize || 1}
- Transport preference: ${transport || "Any"}
- Accommodation: ${accommodation || "Budget hostel"}
${dates ? `- Travel dates: ${dates}` : ""}

Return a JSON object with this exact structure (no markdown, just JSON):
{
  "destination": "string - the recommended destination",
  "summary": "string - 1-2 sentence trip summary",
  "days": [
    {
      "day": 1,
      "title": "string - theme for the day",
      "activities": [
        {
          "time": "string - e.g. 9:00 AM",
          "activity": "string - what to do",
          "description": "string - brief details",
          "cost": number
        }
      ]
    }
  ],
  "budget": {
    "travel": number,
    "stay": number,
    "food": number,
    "activities": number,
    "total": number
  },
  "tips": ["string - helpful tips for students"],
  "foodRecommendations": ["string - affordable food spots"],
  "accommodation": {
    "name": "string",
    "type": "string",
    "costPerNight": number
  }
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert travel planner specializing in budget-friendly student travel in India. Always respond with valid JSON only, no markdown formatting. Be realistic with costs in Indian Rupees (₹). Focus on affordable options, street food, hostels, and student-friendly activities.",
          },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Try to parse the JSON from the response
    let itinerary;
    try {
      // Remove potential markdown code blocks
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      itinerary = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to generate itinerary. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ itinerary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-itinerary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
