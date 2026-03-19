import {
    getSingleProductNameFromDb,
    getTotalProductNamesFromDb,
} from "../../support/db/inventory/product_name/productNameDb";

export const productNameTasks = (supabaseAdmin) => ({
    async getSingleProductNameFromDb({ productNameId, userId }) {
        return getSingleProductNameFromDb(
            supabaseAdmin,
            productNameId,
            userId,
        );
    },

    async getTotalProductNamesFromDb({ userId }) {
        return getTotalProductNamesFromDb(supabaseAdmin, userId);
    },
});
