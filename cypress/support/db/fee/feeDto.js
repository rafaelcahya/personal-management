export function toFeeDto(db) {
    if (!db) return null;

    return {
        id: db.id,
        createdAt: db.created_at,
        updatedAt: db.updated_at,
        deletedAt: db.deleted_at,
        feeDate: db.fee_date,
        feeName: db.fee_name,
        fee: db.fee,
        uuid: db.uuid,
    };
}
