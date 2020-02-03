function storeNameModel() {
    storeIndex: number;
    storeName: string
}
function storeEnum() {
    this.Unselect = -1,
        this.Costco = 1,
        this.Safeway = 2,
        this.FredMeyer = 3
}
function productDetail() {
    this.storeNumber,
        this.category,
        this.productDescription,
        this.quantity,
        this.price,
        this.unitMeasurement,
        this.note,
        getTotalPrice = function () {
            return this.price * this.quantity;
        }
}