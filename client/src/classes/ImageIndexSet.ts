export default class ImageIndexSet {
    private _indexes = [5] as number[];
    public SetIndexs = (arr: number[]): void => {
        this._indexes = arr;
    }
    public GetIndexs = (): number[] => {
        return this._indexes;
    }
}