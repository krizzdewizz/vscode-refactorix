namespace access {
    class Color {
        _rgb: string;
        get rgb(): string {
            return 'this._rgb';
        }
        set rgb(value: string) {
            this._rgb = value;
        }
        constructor(x: string, private y:number) {
            /* */
        }

        public foo() {

        }
    }
}