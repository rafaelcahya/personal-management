export function toProductListDto(db) {
    if (!db) return null;

    return {
        id: db.id,
        createdAt: db.created_at,
        updatedAt: db.updated_at,
        deletedAt: db.deleted_at,
        uuid: db.uuid,
        product: db.product,
        brand: db.brand,
        type: db.type,
        quantity: db.quantity,
        onHandQuantity: db.on_hand_quantity,
        note: db.note,
        productImage: db.product_image,
        productStatus: db.product_status,
    };
}
