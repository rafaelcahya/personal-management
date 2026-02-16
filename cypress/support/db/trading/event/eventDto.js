export function toEventDto(db) {
    if (!db) return null;

    return {
        id: db.id,
        createdAt: db.created_at,
        updatedAt: db.updated_at,
        deletedAt: db.deleted_at,
        eventDate: db.event_date,
        eventDescription: db.event_description,
        impactDirection: db.impact_direction,
        uuid: db.uuid,
    };
}
