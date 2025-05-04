export class V2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(o) {
        return new V2(this.x + o.x, this.y + o.y);
    }
    sub(o) {
        return new V2(this.x - o.x, this.y - o.y);
    }
    mul(s) {
        return new V2(this.x * s, this.y * s);
    }
    div(s) {
        return new V2(this.x / s, this.y / s);
    }
    dot(o) {
        return this.x * o.x + this.y * o.y;
    }
    norm2() {
        return this.x * this.x + this.y * this.y;
    }
    norm() {
        return Math.sqrt(this.norm2());
    }
}

