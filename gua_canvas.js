class GuaCanvas extends GuaObject {
    constructor(selector) {
        super()
        let canvas = _e(selector)
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.w = canvas.width
        this.h = canvas.height
        this.pixels = this.context.getImageData(0, 0, this.w, this.h)
        this.bytesPerPixel = 4
        // this.pixelBuffer = this.pixels.data
    }
    render() {
        // 渲染
        let {pixels, context} = this
        context.putImageData(pixels, 0, 0)
    }
    clear(color=GuaColor.white()) {
        // color GuaColor
        // 用 color 填充整个 canvas
        // 遍历每个像素点, 设置像素点的颜色
        let {w, h} = this
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                this._setPixel(x, y, color)
            }
        }
        this.render()
    }
    _setPixel(x, y, color) {
        // color: GuaColor
        // 设置像素点
        // 浮点转 int
        let int = Math.floor
        x = int(x)
        y = int(y)
        // 用座标算像素下标
        let i = (y * this.w + x) * this.bytesPerPixel
        // 设置像素
        let p = this.pixels.data
        let {r, g, b, a} = color
        // 一个像素 4 字节, 分别表示 r g b a
        p[i] = r
        p[i+1] = g
        p[i+2] = b
        p[i+3] = a
    }
    drawPoint(point, color=GuaColor.black()) {
        // point: GuaPoint
        let {w, h} = this
        let p = point
        if (p.x >= 0 && p.x <= w) {
            if (p.y >= 0 && p.y <= h) {
                this._setPixel(p.x, p.y, color)
            }
        }
    }
    drawLine(p1, p2, color=GuaColor.black()) {
        // p1 p2 分别是起点和终点, GuaPoint 类型
        // color GuaColor
        // 使用 drawPoint 函数来画线

        // 根据 p1 p2 计算出所有需要绘制的点
        // (x1, y1) (x2, y2) 之间所有的点
        // ax + b = y
        const {x : x1, y : y1} = p1
        const {x : x2, y : y2} = p2

        const step = 0.01
        const points = [p1]

        if(x1 === x2) {
            for(let y = y1; y <= y2; y += step) {
                const p = GuaPoint.new(x1, y)
                points.push(p)
            }
        } else {
            const slope = (y1 - y2) / (x1 - x2)
            const intercept = y1 - slope * x1
            for(let x = x1; x <= x2; x += step) {
                const y = slope * x + intercept
                const p = GuaPoint.new(x, y)
                points.push(p)
            }
        }
        points.push(p2)
        points.forEach((p) => {
            this.drawPoint(p, color)
        })

    }

    drawRect(upperLeft, size, fillColor=null, borderColor=GuaColor.black()) {
        // upperLeft: GuaPoint, 矩形左上角座标
        // size: GuaSize, 矩形尺寸
        // fillColor: GuaColor, 矩形的填充颜色, 默认为空, 表示不填充
        // borderColor: GuaColor, 矩形的的边框颜色, 默认伪黑色

        // 点
        const {x, y} = upperLeft
        const {w, h} = size
        const upperRight = GuaPoint.new(x + w, y)
        const downLeft = GuaPoint.new(x, y + h)
        const downRight = GuaPoint.new(x + w, y + h)

        // 线
        this.drawLine(upperLeft, upperRight, borderColor)
        this.drawLine(upperLeft, downLeft, borderColor)
        this.drawLine(downLeft, downRight, borderColor)
        this.drawLine(upperRight, downRight, borderColor)

        // 面
        if(fillColor !== null) {
            const p = GuaPoint.new(x + 1, y + 1)
            this.drawFillRect(p, size, fillColor)
        }
    }

    // fill rect 没有边框
    drawFillRect(upperLeft, size, fillColor) {
        const {x, y} = upperLeft
        const {w, h} = size

        const step = 1
        for(let py = y; py < y + h - step; py += step ) {
            // const px = px + step
            let px = x
            const start = GuaPoint.new(px, py)
            const end = GuaPoint.new(px + w - 2 * step, py)
            this.drawLine(start, end, fillColor)
        }
    }
    __debug_draw_demo() {
        let {context, pixels} = this
        // 获取像素数据, data 是一个数组
        let data = pixels.data
        // 一个像素 4 字节, 分别表示 r g b a
        for (let i = 0; i < data.length; i += 4) {
            let [r, g, b, a] = data.slice(i, i + 4)
            r = 255
            a = 255
            data[i] = r
            data[i+3] = a
        }
        context.putImageData(pixels, 0, 0)
    }
}
