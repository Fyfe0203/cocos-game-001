import { HERO_COUNT, CAMPS, EventType } from '../common/Const';
import EventManager from '../common/EventManager';
import Hero from '../prefab/Hero';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameView extends cc.Component {
	@property(cc.Node)
	table: cc.Node = null;

	@property(cc.Prefab)
	hero: cc.Prefab = null;

	@property(cc.SpriteFrame)
	leftSprite: cc.SpriteFrame = null;

	@property(cc.SpriteFrame)
	rightSprite: cc.SpriteFrame = null;

	private leftList: Array<cc.Node> = [];
	private rightList: Array<cc.Node> = [];
	private isGaming: boolean = false;
	onLoad() {
		EventManager.on(EventType.HERO_ATTACK, this.doAttack, this);
		EventManager.on(EventType.HERO_ATTACK_OVER, this.checkGameOver, this);
	}

	start() {
		this.scheduleOnce(this.initHeros, 0.5);
	}

	onDestroy() {
		EventManager.off(EventType.HERO_ATTACK, this.doAttack, this);
		EventManager.off(EventType.HERO_ATTACK_OVER, this.checkGameOver, this);
	}

	initHeros() {
		let id = 10000;
		for (let i = 0; i < HERO_COUNT; i++) {
			let heroNode = cc.instantiate(this.hero);
			let hero = heroNode.getComponent(Hero);
			this.node.addChild(heroNode);

			let rect: cc.Node = this.table.getChildByName('left' + i);

			let wpos = this.table.convertToWorldSpaceAR(cc.v2(rect.x, rect.y));
			let npos = this.node.convertToNodeSpaceAR(wpos);

			hero.onInit(npos, ++id);
			hero.camp = CAMPS.LEFT;
			hero.bg.spriteFrame = this.leftSprite;
			this.leftList.push(heroNode);
		}

		for (let i = 0; i < HERO_COUNT; i++) {
			let heroNode = cc.instantiate(this.hero);
			let hero = heroNode.getComponent(Hero);
			this.node.addChild(heroNode);

			let rect: cc.Node = this.table.getChildByName('right' + i);

			let wpos = this.table.convertToWorldSpaceAR(cc.v2(rect.x, rect.y));
			let npos = this.node.convertToNodeSpaceAR(wpos);

			hero.onInit(npos, ++id);
			hero.camp = CAMPS.RIGHT;
			hero.bg.spriteFrame = this.rightSprite;
			this.rightList.push(heroNode);
		}
		this.isGaming = true;
	}

	doAttack(event: cc.Event.EventCustom) {
		let data = event.getUserData();
		let [camp, hero] = this.getAttackHero(data);
		let target = this.getRandomTarget(camp);
		// 如果找不到目标，游戏停止
		if (!target) {
			this.isGaming = false;
			return;
		}
		// 攻击对方
		hero.doAttack(target.pos);
		// 对方被攻击的响应
		target.onAttack(hero);
	}

	/**
	 * 通过id找到攻击英雄
	 * @param data
	 * @returns
	 */
	getAttackHero(data: any): [CAMPS, Hero] {
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
				console.log('get hero error==>', data);
				return;
		}
		list.forEach((item) => {
			if (item.getComponent(Hero).hero_id === data.id) {
				hero = item.getComponent(Hero);
				return;
			}
		});
		return [camp, hero];
	}

	/**
	 * 随机一个对方的英雄作为攻击目标
	 * @param camp 随机
	 * @returns
	 */
	getRandomTarget(camp: CAMPS): Hero {
		let list, target;
		switch (camp) {
			case CAMPS.LEFT:
				list = this.rightList.filter((item) => {
					let hero = item.getComponent(Hero);
					return !hero.isdead;
				});
				break;
			case CAMPS.RIGHT:
				list = this.leftList.filter((item) => {
					let hero = item.getComponent(Hero);
					return !hero.isdead;
				});
				break;
			default:
				console.log('get target error==>', camp);
				return;
		}
		if (list.length === 0) {
			return;
		}
		target = list[Math.floor(Math.random() * list.length)];
		return target.getComponent(Hero);
	}

	/**
	 * 判断游戏是否结束
	 */
	checkGameOver() {
		let leftList = this.leftList.filter(
			(n) => !n.getComponent(Hero).isdead
		);
		let rightList = this.rightList.filter(
			(n) => !n.getComponent(Hero).isdead
		);
		this.isGaming = leftList.length > 0 && rightList.length > 0;
	}

	update(dt) {
		if (this.isGaming) {
			this.leftList.forEach((node) => {
				node.getComponent(Hero).getEnergy(dt);
			});
			this.rightList.forEach((node) => {
				node.getComponent(Hero).getEnergy(dt);
			});
		}
	}
}
