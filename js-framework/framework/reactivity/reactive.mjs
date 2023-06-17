"use strict";
function possiblyChanged(prev, curr) {
    if (prev !== curr)
        return true; // x -> y: definitely changed.
    return (typeof prev === 'object'
        && typeof curr === 'object'); // object -> object: possibly changed.
}
class ReactiveObject {
    constructor(cb, deps) {
        var _this = this;
        this.callback = cb;
        this.reactives = new Set();
        this.deps = deps;
        this.deps.forEach(function (d) { return d.addReactive(_this); });
        // run on init
        this.wasCalled = false;
        this.initialRun();
    }
}

ReactiveObject.prototype.setCallback = function (cb) {
    this.callback = cb;
};
ReactiveObject.prototype.addReactive = function (r) {
    this.reactives.add(r);
};
// runners: always use in-order DFS.
ReactiveObject.prototype.initialRun = function () {
    var args = this.deps.map(function (d) { return d.value; });
    this.value = this.callback.apply(this, args);
    this.reactives.forEach(function (r) { return r.run(); });
};
ReactiveObject.prototype.run = function () {
    if (this.wasCalled)
        return;
    this.wasCalled = true;
    // compute.
    var prevValue = this.value;
    var args = this.deps.map(function (d) { return d.value; });
    this.value = this.callback.apply(this, args);
    // recurse on children if possible change detected.
    if (possiblyChanged(prevValue, this.value)) {
        this.reactives.forEach(function (r) { return r.run(); });
    }
    this.wasCalled = false;
};
// cleanup
ReactiveObject.prototype.delete = function () {
    var _this = this;
    this.deps.forEach(function (d) { return d.removeReactive(_this); });
    this.deps = undefined;
    this.reactives.forEach(function (r) { return r.delete(); });
    this.reactives = undefined;
    this.value = undefined;
};
ReactiveObject.prototype.removeReactive = function (r) {
    this.reactives.delete(r);
};

export default ReactiveObject;
