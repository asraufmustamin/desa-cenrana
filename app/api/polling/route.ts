import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Get active poll with results
export async function GET() {
    try {
        // Get active poll
        const { data: poll, error: pollError } = await supabase
            .from("polls")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (pollError || !poll) {
            return NextResponse.json({ poll: null });
        }

        // Get vote counts for this poll
        const { data: votes, error: votesError } = await supabase
            .from("poll_votes")
            .select("option_id")
            .eq("poll_id", poll.id);

        if (votesError) {
            console.error("Error fetching votes:", votesError);
        }

        // Count votes per option
        const voteCounts: Record<number, number> = {};
        const totalVotes = votes?.length || 0;

        if (votes) {
            for (const vote of votes) {
                voteCounts[vote.option_id] = (voteCounts[vote.option_id] || 0) + 1;
            }
        }

        // Add vote counts and percentages to options
        const options = (poll.options as any[]).map((opt: any) => ({
            ...opt,
            votes: voteCounts[opt.id] || 0,
            percentage: totalVotes > 0
                ? Math.round(((voteCounts[opt.id] || 0) / totalVotes) * 100)
                : 0
        }));

        return NextResponse.json({
            poll: {
                ...poll,
                options,
                totalVotes
            }
        });
    } catch (error) {
        console.error("Error fetching poll:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST - Submit a vote
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { pollId, optionId, voterId } = body;

        if (!pollId || !optionId || !voterId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if already voted
        const { data: existing } = await supabase
            .from("poll_votes")
            .select("id")
            .eq("poll_id", pollId)
            .eq("voter_id", voterId)
            .single();

        if (existing) {
            return NextResponse.json({ error: "Anda sudah memberikan suara" }, { status: 400 });
        }

        // Insert vote
        const { error } = await supabase
            .from("poll_votes")
            .insert({
                poll_id: pollId,
                option_id: optionId,
                voter_id: voterId
            });

        if (error) {
            console.error("Error inserting vote:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Terima kasih! Suara Anda sudah tercatat." });
    } catch (error) {
        console.error("Error submitting vote:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
