import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Get all polls with vote counts (admin)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pollId = searchParams.get("pollId");
        const getOthers = searchParams.get("others");

        // Get "Lainnya" votes for specific poll
        if (pollId && getOthers) {
            const { data: otherVotes, error } = await supabase
                .from("poll_votes")
                .select("id, other_text, voted_at")
                .eq("poll_id", pollId)
                .not("other_text", "is", null)
                .order("voted_at", { ascending: false });

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            return NextResponse.json({ otherVotes: otherVotes || [] });
        }

        // Get all polls
        const { data: polls, error: pollsError } = await supabase
            .from("polls")
            .select("*")
            .order("created_at", { ascending: false });

        if (pollsError) {
            return NextResponse.json({ error: pollsError.message }, { status: 500 });
        }

        // Get vote counts for each poll
        const pollsWithVotes = await Promise.all(
            (polls || []).map(async (poll) => {
                const { data: votes } = await supabase
                    .from("poll_votes")
                    .select("option_id")
                    .eq("poll_id", poll.id);

                const voteCounts: Record<number, number> = {};
                const totalVotes = votes?.length || 0;

                if (votes) {
                    for (const vote of votes) {
                        voteCounts[vote.option_id] = (voteCounts[vote.option_id] || 0) + 1;
                    }
                }

                const options = (poll.options as any[]).map((opt: any) => ({
                    ...opt,
                    votes: voteCounts[opt.id] || 0,
                    percentage: totalVotes > 0
                        ? Math.round(((voteCounts[opt.id] || 0) / totalVotes) * 100)
                        : 0
                }));

                return { ...poll, options, totalVotes };
            })
        );

        return NextResponse.json({ polls: pollsWithVotes });
    } catch (error) {
        console.error("Error in admin polling GET:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST - Create new poll
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { question, options, end_date } = body;

        if (!question || !options || options.length < 2) {
            return NextResponse.json({ error: "Invalid poll data" }, { status: 400 });
        }

        // Deactivate other polls first (only one active at a time)
        await supabase
            .from("polls")
            .update({ is_active: false })
            .eq("is_active", true);

        const { data, error } = await supabase
            .from("polls")
            .insert({
                question,
                options,
                is_active: true,
                end_date: end_date || null
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ poll: data, message: "Polling berhasil dibuat" });
    } catch (error) {
        console.error("Error creating poll:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PATCH - Toggle poll active status
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { pollId, is_active } = body;

        if (!pollId) {
            return NextResponse.json({ error: "Poll ID required" }, { status: 400 });
        }

        // If activating, deactivate others first
        if (is_active) {
            await supabase
                .from("polls")
                .update({ is_active: false })
                .eq("is_active", true);
        }

        const { error } = await supabase
            .from("polls")
            .update({ is_active })
            .eq("id", pollId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating poll:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE - Delete poll and its votes
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { pollId } = body;

        if (!pollId) {
            return NextResponse.json({ error: "Poll ID required" }, { status: 400 });
        }

        // Delete votes first (cascade should handle this, but just to be safe)
        await supabase
            .from("poll_votes")
            .delete()
            .eq("poll_id", pollId);

        const { error } = await supabase
            .from("polls")
            .delete()
            .eq("id", pollId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Polling berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting poll:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
