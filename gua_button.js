
class GuaButton extends GuaObject {
    constructor(position, size) {
        super()
        this.position = position
        this.size = size

        this.canvas = null
        this.clickHandler = null
        this.mousedownHandler = null
        this.mouseupHandler = null

        this.fillColor = GuaColor.white()
        this.borderColor = GuaColor.black()

        this.setup()

    }
    setup() {
        this.clickHandler = (e, i) => {
            let offsetX = e.offsetX
            let offsetY = e.offsetY
            if (this.hasPoint(offsetX, offsetY)) {
                log('click', i)
                return true
            }
        }

        this.mousedownHandler = e => {
            let offsetX = e.offsetX
            let offsetY = e.offsetY
            if (this.hasPoint(offsetX, offsetY)) {
                // log('mouse down')
                this.fillColor = GuaColor.red()
                return true
            }

        }
        this.mouseupHandler = e => {
            this.fillColor = GuaColor.white()
        }
    }

    hasPoint(x, y) {
        this.x = this.position.x
        this.y = this.position.y
        this.w = this.size.w
        this.h = this.size.h
        let xIn = x >= this.x && x <= this.x + this.w
        let yIn = y >= this.y && y <= this.y + this.h
        return xIn && yIn
    }

    draw() {
        this.canvas.drawRect(this.position, this.size, this.borderColor, this.fillColor, )
    }

}

