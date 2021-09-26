import { EventType } from "../common/Const";
import EventManager from "../common/EventManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TableView extends cc.Component {
    @property(cc.Graphics)
    strokeGfx: cc.Graphics = null;

    private fillGfx: cc.Graphics = null;
    private rects:Array<cc.Rect> = [];
    onLoad () {
        this.fillGfx = this.node.getComponent(cc.Graphics);
    }

    start () {
        this.scheduleOnce(this.initStroke, 0);
    }

    initStroke () {
        this.strokeGfx.clear();
        this.drawTable(true);
        this.drawTable(false);
        EventManager.emit(EventType.TABLE_INIT_OVER);
    }

    checkCross (wpos) {
        let boxWidth = 100;
        let cpos = this.node.convertToNodeSpaceAR(wpos);
        let rect = new cc.Rect(cpos.x-boxWidth/2, cpos.y-boxWidth/2, boxWidth, boxWidth);
        let gfx = this.fillGfx;
        let max = 0;
        let mid = 0;
        this.rects.forEach((r: cc.Rect, index)=>{
            if (r.intersects(rect)) {
                let ri = new cc.Rect();
                r.intersection(ri, rect);
                let rs = ri.width * ri.height;
                max = Math.max(max, rs);
                if (max === rs) {
                    mid = index;
                }
            }
        });
        
        gfx.clear();
        this.rects.forEach((r: cc.Rect, index)=>{
            if (max !== 0 && mid === index) {
                gfx.fillColor = cc.color(0,255,0,255);
                gfx.fillRect(r.x, r.y, r.width, r.height);
            }
        })
    }

    drawTable (isLeft) {
        let boxWidth = 100;
        let count = 3;
        let gfx = this.strokeGfx;
        let width = this.node.width, height = this.node.height;
        let bottom = -height/2;
        let delay = width/2 - count * boxWidth;
        let sign = (isLeft?-1:1)
        gfx.moveTo((width/2-delay/2)*sign, bottom);
        gfx.lineTo((delay/2)*sign, bottom);
        gfx.lineTo((delay/2)*sign, bottom + boxWidth * count);
        gfx.lineTo((width/2-delay/2)*sign, bottom + boxWidth * count);
        gfx.close();

        gfx.moveTo((delay/2+boxWidth)*sign, bottom);
        gfx.lineTo((delay/2+boxWidth)*sign, bottom + boxWidth * count);
        gfx.moveTo((delay/2+boxWidth*2)*sign, bottom);
        gfx.lineTo((delay/2+boxWidth*2)*sign, bottom + boxWidth * count);
        
        gfx.moveTo((width/2-delay/2)*sign, bottom + boxWidth);
        gfx.lineTo((delay/2)*sign, bottom + boxWidth);
        gfx.moveTo((width/2-delay/2)*sign, bottom + boxWidth * 2);
        gfx.lineTo((delay/2)*sign, bottom + boxWidth * 2);
        gfx.stroke();

        for (let i=0;i<count;++i) {
            for (let j=0;j<count;++j) {
                let x = (delay/2 + boxWidth * (i+(isLeft?1:0)))*sign;
                let y = bottom + boxWidth * j;
                let rect = new cc.Rect(x, y, boxWidth, boxWidth);
                this.rects.push(rect);
            }
        }
    }

    getRects () {
        return this.rects;
    }
}