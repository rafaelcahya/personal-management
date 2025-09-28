import { getCreateFee } from "@/lib/services/fee/getCreateFee";

export async function POST(req) {
    try {
        const { fee_name, fee, fee_date } = await req.json();

        const newFee = await getCreateFee(fee_name, fee, fee_date);

        return new Response(JSON.stringify({ success: true, fee: newFee }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
}
