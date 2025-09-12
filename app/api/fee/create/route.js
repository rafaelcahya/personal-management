import { getCreateFee } from "@/lib/services/fee/getCreateFee";

export async function POST(req) {
    try {
        const { fee_name, fee, fee_date } = await req.json();

        const newFee = await getCreateFee(fee_name, fee, fee_date);

        return new Response(JSON.stringify({ success: true, newFee }), {
            status: 200,
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
        });
    }
}
