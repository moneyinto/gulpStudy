/**
 * Created by Lenovo on 2016/4/26.
 */
class myPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    printf() {
        return '打印新的东西' + this.x + this.y + '!';
    }
}

let newData = new myPoint(1, 2);

console.log(newData.printf());