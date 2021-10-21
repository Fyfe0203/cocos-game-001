cc.Class({
    extends: cc.Component,

    properties: {
        robot: {
            type: dragonBones.ArmatureDisplay,
            default: null,
        },
        zui: {
            type: dragonBones.ArmatureDisplay,
            default: null,
        },
        chibang: {
            type: dragonBones.ArmatureDisplay,
            default: null,
        }
    },

    start() {
        let robotArmature = this.robot.armature();
        let robotSlot = robotArmature.getSlot("Rchibang");
        let chibangSlot = robotArmature.getSlot("Lchibang");

        let factory = dragonBones.CCFactory.getInstance();
        factory.replaceSlotDisplay(
            this.zui.getArmatureKey(),
            "chibang2",
            "Lchibang2",
            "Lchibang2",
            robotSlot
        );

        factory.replaceSlotDisplay(
            this.zui.getArmatureKey(),
            "chibang2",
            "Rchibang2",
            "Rchibang2",
            chibangSlot
        );
    },
});