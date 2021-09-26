const { ccclass, property, menu } = cc._decorator

let curDR: cc.Size
let that: ImageObjectFit

@ccclass
@menu('Common/ImageObjectFit')
export default class ImageObjectFit extends cc.Component {
    /**
     * 自动调整背景图，设置在cover模式，自动裁切显示图片
     */
    private resize() {
        if (!curDR) {
            curDR = that.node.getContentSize()
        }
        let cvs = cc.find('Canvas').getComponent(cc.Canvas)
        if (cvs) {
            let { width: oldW, height: oldH } = curDR
            let { width, height } = cvs.designResolution

            if (height <= width) {
                let scale = height / oldH
                if (width > oldW) {
                    scale = width / oldW
                }
                that.node.scale = scale
            } else {
                let scale = width / oldW
                if (height > oldH) {
                    scale = height / oldH
                }
                that.node.scale = scale
            }
        }
    }

    onLoad() {
        that = this
        // 绑定resize事件
        window.addEventListener('resize', this.resize, false)
        // 初始设置
        this.resize()

        let widget = this.node.getComponent(cc.Widget)
        if (widget) {
            widget.enabled = false
        }
    }

    onDestroy() {
        window.removeEventListener('resize', this.resize, false)
    }
}
