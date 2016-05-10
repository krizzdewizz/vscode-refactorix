namespace property {
    class Color {
        private _rgb: string;
        get rgb(): string {
            return this._rgb;
        }
        set rgb(value: string) {
            this._rgb = value;
        }
    }
}