export function toUserDto(db) {
    if (!db) return null;

    return {
        id: db.id,
        createdAt: db.created_at,
        updatedAt: db.updated_at,
        deletedAt: db.deleted_at,
        username: db.username,
        email: db.email,
        nickname: db.nickname,
        avatar: db.avatar,
    };
}
