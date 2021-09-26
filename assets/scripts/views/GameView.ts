import { HERO_COUNT, CAMPS, EventType } from "../common/Const";
import EventManager from "../common/EventManager";
import Tools from "../common/Tools";
import Hero from "../prefab/Hero";
import TableView from "../ui/TableView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameView extends cc.Component {
    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(TableView)
    table: TableView = null;

    @property(cc.Prefab)
    hero: cc.Prefab = null;

    private leftList: Array<cc.Node> = [];
    private rightList: Array<cc.Node> = [];
    private isGaming: boolean = false;
    onLoad () {
        EventManager.on(EventType.TABLE_INIT_OVER, this.initHeros, this);
        EventManager.on(EventType.HERO_ATTACK, this.doAttack, this);
        EventManager.on(EventType.HERO_ATTACK, this.checkGameOver, this);
    }

    onDestroy () {
        EventManager.off(EventType.TABLE_INIT_OVER, this.initHeros, this);
        EventManager.off(EventType.HERO_ATTACK, this.doAttack, this);
        EventManager.off(EventType.HERO_ATTACK_OVER, this.checkGameOver, this);
    }

    start () {
        this.scheduleOnce(()=>{
            Tools.setOffsetUV(this.bg);
        }, 0)
    }

    initHeros () {
        let rects = this.table.getRects();
        let leftRects = rects.slice(0, 9);
        let rightRects = rects.slice(9);
        let id = 10000;
        for (let i=0; i<HERO_COUNT; ++i) {
            let heroNode = cc.instantiate(this.hero);
            let hero = heroNode.getComponent(Hero);
            this.node.addChild(heroNode);
            let rect: cc.Rect = leftRects[Math.floor(Math.random() * leftRects.length)];
            leftRects = leftRects.filter(r=>!r.equals(rect));
            let wpos = this.table.node.convertToWorldSpaceAR(cc.v2(rect.x + rect.width / 2, rect.y + rect.height / 2));
            let npos = this.node.convertToNodeSpaceAR(wpos);
            hero.onInit(npos, ++id);
            hero.camp = CAMPS.LEFT;
            this.leftList.push(heroNode);
        }
        for (let i=0; i<HERO_COUNT; ++i) {
            let heroNode = cc.instantiate(this.hero);
            let hero = heroNode.getComponent(Hero);
            this.node.addChild(heroNode);
            let rect: cc.Rect = rightRects[Math.floor(Math.random() * rightRects.length)];
            rightRects = rightRects.filter(r=>!r.equals(rect));
            let wpos = this.table.node.convertToWorldSpaceAR(cc.v2(rect.x + rect.width / 2, rect.y + rect.height / 2));
            let npos = this.node.convertToNodeSpaceAR(wpos);
            hero.onInit(npos, ++id);
            hero.camp = CAMPS.RIGHT;
            this.rightList.push(heroNode);
        }
        this.isGaming = true;
    }

    doAttack (event: cc.Event.EventCustom) {
        let data = event.getUserData();
        let [camp, hero] = this.getAttackHero(data);
        let target = this.getRandomTarget(camp);
        if (!target) {
            this.isGaming = false;
            return;
        }
        hero.doAttack(target.pos);
        target.onAttack(hero);
    }

    getAttackHero (data: any) : [CAMPS, Hero] {
        let camp = data.camp;
        let list, hero;
        switch (camp) {
            case CAMPS.LEFT:
                list = this.leftList;
                break;
            case CAMPS.RIGHT:
                list = this.rightList;
                break;
            default:
                console.log("get hero error==>", data);
                return;
        }
        list.forEach(item=>{
            if (item.getComponent(Hero).hero_id === data.id) {
                hero = item.getComponent(Hero);
                return;
            }
        })
        return [camp, hero];
    }

    getRandomTarget (camp: CAMPS) : Hero {
        let list, target;
        switch (camp) {
            case CAMPS.LEFT:
                list = this.rightList.filter(item=>{
                    let hero = item.getComponent(Hero);
                    return !hero.isdead;
                });
                break;
            case CAMPS.RIGHT:
                list = this.leftList.filter(item=>{
                    let hero = item.getComponent(Hero);
                    return !hero.isdead;
                });
                break;
            default:
                console.log("get target error==>", camp);
                return;
        }
        if (list.length === 0) {
            return;
        }
        target = list[Math.floor(Math.random() * list.length)];
        return target.getComponent(Hero);
    }

    checkGameOver () {
        let leftList = this.leftList.filter(n=>!n.getComponent(Hero).isdead);
        let rightList = this.rightList.filter(n=>!n.getComponent(Hero).isdead);
        this.isGaming = leftList.length > 0 && rightList.length > 0;
    }

    update (dt) {
        if (this.isGaming) {
            this.leftList.forEach(node=>{
                node.getComponent(Hero).getEnergy(dt);
            });
            this.rightList.forEach(node=>{
                node.getComponent(Hero).getEnergy(dt);
            });
        }
    }
}



