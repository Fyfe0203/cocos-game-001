export default class EventManager {
    private static _target = new cc.EventTarget();

    public static emit (event: string, data?: any) {
        let e = new cc.Event.EventCustom(event, true);
        data !== null && e.setUserData(data);
        this._target.dispatchEvent(e);
    }

    public static on(event: string, func: Function, target?:any, useCapture?:boolean) {
        this._target.on(event, func, target, useCapture);
    }

    public static off(event: string, func: Function, target?:any) {
        this._target.off(event, func, target);
    }
}
