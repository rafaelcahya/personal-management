export function toProductNameListDto(db) {
    if (!db) return null;

    return {
        id: db.id,
        createdAt: db.created_at,
        updatedAt: db.updated_at,
        deletedAt: db.deleted_at,
        uuid: db.uuid,
        productName: db.product_name,
        productNameStatus: db.product_name_status,
        note: db.note,
    };
}
