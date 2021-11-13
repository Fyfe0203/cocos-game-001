cc.Class({
    extends: cc.Component,

    properties: {
        robot: {
            type: dragonBones.ArmatureDisplay,
            default: null,
        },
        head: {
            type: dragonBones.ArmatureDisplay,
            default: null,
        },
        clothes: {
            type: dragonBones.ArmatureDisplay,
            default: null,
        },
        eye: {
            type: dragonBones.ArmatureDisplay,
            default: null,
        }
    },

    start() {

        let factory = dragonBones.CCFactory.getInstance();
        this.head.armatureName = 'head03'
        // this.head.animationName = 'wait'
        // this.robot.armature().getSlot("head01").childArmature = factory.buildArmature('head03')
        factory.replaceSlotDisplay(
            this.head.getArmatureKey(),
            "head03",
            "head03",
            "head03",
            this.robot.armature().getSlot("head01")
        );


        this.clothes.armatureName = 'clothes03'
        // this.clothes.animationName = 'wait'

        // this.robot.armature().getSlot("clothes01").childArmature = factory.buildArmature('eye03')

        // factory.replaceSlotDisplay(
        //     this.clothes.getArmatureKey(),
        //     "clothes03",
        //     "clothes03",
        //     "clothes03",
        //     this.robot.armature().getSlot("clothes01")
        // );

        this.eye.armatureName = 'eye03'
        factory.replaceSlotDisplay(
            this.eye.getArmatureKey(),
            "eye03",
            "eye03",
            "eye03",
            this.robot.armature().getSlot("eye01")
        );
        // this.robot.armature().getSlot("eye01").childArmature = factory.buildArmature('eye03')

        this.robot.animationName = 'wait'
    },
});