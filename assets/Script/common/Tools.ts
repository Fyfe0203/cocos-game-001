export default class Tools {
    
    static setOffsetUV (sp: cc.Sprite, offset:string = "u_uvOffset", rotated:string = "u_uvRotated") {
        let frame = sp.spriteFrame;
        //@ts-ignore
        let uvs = frame.uv
        let material = sp.getMaterial(0);
        let l = 0, r = 0, b = 1, t = 1;
        l = uvs[0];
        t = uvs[5];
        r = uvs[6];
        b = uvs[3];
        let u_uvOffset = new cc.Vec4(l, t, r, b);
        let u_uvRotated = frame.isRotated() ? 1.0 : 0.0;
        material.setProperty(offset, u_uvOffset);
        material.setProperty(rotated, u_uvRotated);
    }
}