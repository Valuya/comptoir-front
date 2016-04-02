/**
 * Created by cghislai on 02/04/16.
 */

export enum StockChangeType {
    INITIAL,
    SALE,
    TRANSFER,
    ADJUSTMENT
}

export var ALL_STOCK_CHANGE_TYPES = [
    StockChangeType.ADJUSTMENT,
    StockChangeType.INITIAL,
    StockChangeType.SALE,
    StockChangeType.TRANSFER
];