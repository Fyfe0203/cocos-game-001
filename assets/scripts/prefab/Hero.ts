import { MAX_ENERGY, EventType, CAMPS, MAX_DEFENCE } from "../common/Const";
import EventManager from "../common/EventManager";
import GameModel from "../model/GameModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hero extends cc.Component {
    // 节点
    @property(cc.Label)
    lb_name: cc.Label = null;
    @property(cc.Label)
    lb_hp: cc.Label = null;
    @property(cc.Label)
    lb_data: cc.Label = null;
    @property(cc.ProgressBar)
    pb_hp: cc.ProgressBar = null;
    @property(cc.ProgressBar)
    pb_eg: cc.ProgressBar = null;


    // 人物属性
    private _hp: number = 0;
    private _maxHp: number = 0;
    private _hero_name: string = "";
    private _attack: number = 0;
    private _defence: number = 0;
    private _speed: number = 0;
    private _dead: boolean = false;
    private _camp: number = 0;
    private _pos: cc.Vec2 = cc.v2(0, 0);
    private _energy: number = 0;
    private _hero_id: number = 0;
    get hp () {
        return this._hp;
    }
    set hp (value: number) {
        this._hp = Math.min(Math.round(value), this.maxHp);
        if (this.hp <= 0) {
            this.isdead = true;
        } else {
            this.lb_hp.string = this.hp + "/" + this.maxHp;
            this.pb_hp.progress = this.hp / this.maxHp;
        }
    }
    get maxHp () {
        return this._maxHp;
    }
    set maxHp (value: number) {
        let i_hp = Math.round(value);
        this._maxHp = i_hp;
        this.hp = i_hp;
    }
    get heroname () {
        return this._hero_name;
    }
    set heroname (value: string) {
        this._hero_name = value;
        this.lb_name.string = value;
    }
    get attack () {
        return this._attack;
    }
    set attack (value: number) {
        this._attack = Math.round(value);
        this.displayData();
    }
    get defence () {
        return this._defence;
    }
    set defence (value: number) {
        this._defence = Math.min(Math.round(value), MAX_DEFENCE);
        this.displayData();
    }
    get speed () {
        return this._speed;
    }
    set speed (value: number) {
        this._speed = Math.round(value);
        this.displayData();
    }
    get isdead () {
        return this._dead;
    }
    set isdead (value: boolean) {
        this._dead = value;
        this.node.active = !value;
    }
    get camp () {
        return this._camp;
    }
    set camp (value: number) {
        this._camp = value;
    }
    get pos () {
        return this._pos;
    }
    set pos (value: cc.Vec2) {
        if (!this._pos.equals(value)) {
            this._pos = value;
        }
        this.node.setPosition(this.pos);
    }
    get energy () {
        return this._energy;
    }
    set energy (value: number) {
        this._energy = Math.min(value, MAX_ENERGY);
        this.pb_eg.progress = this.energy / MAX_ENERGY;
    }
    get hero_id () {
        return this._hero_id;
    }

    onInit (npos: cc.Vec2, id: number) {
        let names = ["曹操", "刘备", "孙权", "陆逊", "周瑜", "诸葛亮", "司马懿", "郭嘉", "荀彧", "戏志才", "贾诩", "鲁肃", "法正", "姜维", "赵云", "吕布", "关羽", "张飞"]
        let rand = Math.random();
        this.heroname = names[Math.floor(rand * names.length)];
        this.maxHp = 200 + rand * 100;
        this.attack = 50 + rand * 20;
        this.defence = 20 + rand * 10;
        this.speed = 20 + rand * 5;
        this.isdead = false;
        this.pos = npos;
        this.energy = 0;
        this._hero_id = id;
    }

    getEnergy (dt) {
        this.energy += this.speed * dt;
        if (this.energy >= MAX_ENERGY) {
            let data = {camp: this.camp, id: this.hero_id};
            EventManager.emit(EventType.HERO_ATTACK, data);
            this.energy = 0;
        }
    }

    doAttack (pos: cc.Vec2) {
        let sign = this.camp === CAMPS.LEFT ? -1 : 1;
        let tpos = pos.add(cc.v2(this.node.width*0.9*sign, 0));
        cc.tween(this.node)
            .to(.1, {x: tpos.x, y: tpos.y}, {easing: 'cubicOut'})
            .to(.1, {x: this.pos.x, y: this.pos.y}, {easing: 'cubicOut'})
            .start();

    }

    onAttack (from: Hero) {
        let damage = GameModel.calculateDamage(from.attack, this.defence);
        cc.tween(this.node)
            .delay(.1)
            .to(.05, {scale: .8})
            .call(()=>{
                this.hp -= damage;
                EventManager.emit(EventType.HERO_ATTACK_OVER);
            })
            .to(.05, {scale: 1})
            .start();
    }

    private displayData () {
        let str = `攻:${this.attack} 防:${this.defence} 速:${this.speed}`;
        this.lb_data.string = str;
    }
}
