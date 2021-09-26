const { ccclass, property, menu } = cc._decorator

/**
 * 原始设计分辨率
 */
let curDR: cc.Size

@ccclass
@menu('Common/CanvasResize')
export default class CanvasResize extends cc.Component {
    private resize() {
        let cvs = cc.find('Canvas').getComponent(cc.Canvas)
        //保存原始设计分辨率，供屏幕大小变化时使用
        if (!curDR) {
            curDR = cvs.designResolution
        }

        let { width, height } = curDR
        let { width: rw, height: rh } = cc.view.getFrameSize()

        let finalW = rw
        let finalH = rh

        if (rw / rh > width / height) {
            //!#zh: 是否优先将设计分辨率高度撑满视图高度。 */
            // cvs.fitHeight = true;

            //如果更长，则用定高
            finalH = height
            finalW = (rw / rh) * finalH
        } else {
            /*!#zh: 是否优先将设计分辨率宽度撑满视图宽度。 */
            //cvs.fitWidth = true;
            //如果更短，则用定宽
            finalW = width
            finalH = (rh / rw) * finalW
        }

        if (rw < rh) {
            cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE)
        }

        cvs.designResolution = cc.size(finalW, finalH)
        cvs.node.width = finalW
        cvs.node.height = finalH
    }

    onLoad() {
        // 绑定resize事件
        window.addEventListener('resize', this.resize, false)
        // 初始设置
        this.resize()
    }

    onDestroy() {
        window.removeEventListener('resize', this.resize, false)
    }
}
