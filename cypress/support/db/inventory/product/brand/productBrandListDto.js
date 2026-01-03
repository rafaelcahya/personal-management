export function toProductBrandListDto(db) {
    if (!db) return null;

    return {
        id: db.id,
        createdAt: db.created_at,
        updatedAt: db.updated_at,
        deletedAt: db.deleted_at,
        uuid: db.uuid,
        brand: db.brand,
        note: db.note,
        brandStatus: db.brand_status,
    };
}
