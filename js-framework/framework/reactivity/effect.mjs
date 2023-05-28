export default class EffectObject {
    constructor(func, reactiveDeps) {
        reactiveDeps.forEach(r => r.activate(func));
    }
}