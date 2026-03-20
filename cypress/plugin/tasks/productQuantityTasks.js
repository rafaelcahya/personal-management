import {
    getLatestProductQuantityFromDb,
    getProductQuantityCountFromDb,
    getProductQuantityListFromDb,
    getProductQuantityHistoryFromDb
} from "../../support/db/inventory/product/productQuantityDb";

export const productQuantityTasks = (supabaseAdmin) => ({
    async getLatestProductQuantityFromDb({ productListId, userId }) {
        return getLatestProductQuantityFromDb(
            supabaseAdmin,
            productListId,
            userId,
        );
    },

    async getProductQuantityCountFromDb({ productListId, userId }) {
        return getProductQuantityCountFromDb(
            supabaseAdmin,
            productListId,
            userId,
        );
    },

    async getProductQuantityListFromDb({ productListId, userId }) {
        return getProductQuantityListFromDb(
            supabaseAdmin,
            productListId,
            userId,
        );
    },

    async getProductQuantityHistoryFromDb({ productListId, userId }) {
        return getProductQuantityHistoryFromDb(
            supabaseAdmin,
            productListId,
            userId,
        );
    },
});

