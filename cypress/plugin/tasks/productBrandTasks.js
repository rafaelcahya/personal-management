import {
    getSingleProductBrandFromDb,
    getTotalProductBrandsFromDb,
} from "../../support/db/inventory/product_brand/productBrandDb";

export const productBrandTasks = (supabaseAdmin) => ({
    async getSingleProductBrandFromDb({ productBrandId, userId }) {
        return getSingleProductBrandFromDb(
            supabaseAdmin,
            productBrandId,
            userId,
        );
    },

    async getTotalProductBrandsFromDb({ userId }) {
        return getTotalProductBrandsFromDb(supabaseAdmin, userId);
    },
});
