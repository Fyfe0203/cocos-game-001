import { MAX_DEFENCE } from "../common/Const";

export default class GameModel {

    public static calculateDamage (attack: number, defence: number) {
        return Math.ceil(attack * (MAX_DEFENCE - defence) / MAX_DEFENCE);
    }
}
