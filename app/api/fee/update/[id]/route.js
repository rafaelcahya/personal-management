import { getUpdateFee } from "@/lib/services/fee/getUpdateFee";

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const updateFee = await getUpdateFee(id, body);

        return new Response(JSON.stringify({ success: true, updateFee }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
