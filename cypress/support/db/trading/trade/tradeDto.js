export function toTradeDto(db) {
    if (!db) return null;

    return {
        id: db.id,
        createdAt: db.created_at,
        updatedAt: db.updated_at,
        deletedAt: db.deleted_at,
        tradeDate: db.trade_date,
        ticker: db.ticker,
        margin: db.margin,
        proceeds: db.proceeds,
        returnPercent: db.return_percent,
        realizedGain: db.realized_gain,
        entrySessionOption: db.entry_session_option,
        buyReasonOption: db.buy_reason_option,
        sellReasonOption: db.sell_reason_option,
        notes: db.notes,
        uuid: db.uuid,
        entryOccasionOption: db.entry_occasion_option,
        stockTypeOption: db.stock_type_option,
    };
}
