const {ccclass, property} = cc._decorator;

@ccclass
export default class HeroList extends cc.Component {
    private gfx: cc.Graphics = null;

    onLoad () {
        this.gfx = this.node.getComponent(cc.Graphics);
    }

    start () {
        this.scheduleOnce(this.initStroke, 0);
    }

    initStroke () {
        this.gfx.fillRect(-this.node.width/2,-this.node.height/2,this.node.width,this.node.height)
        this.gfx.fill();
        this.gfx.rect(-this.node.width/2,-this.node.height/2,this.node.width,this.node.height);
        this.gfx.stroke();
    }
}
