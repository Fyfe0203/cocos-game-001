import { MAX_DEFENCE } from '../common/Const';

export default class GameModel {
	/**
	 * 计算伤害
	 * @param attack 对方攻击力
	 * @param defence 我方防御力
	 * @returns
	 */
	public static calculateDamage(attack: number, defence: number) {
		return Math.ceil((attack * (MAX_DEFENCE - defence)) / MAX_DEFENCE);
	}
}
