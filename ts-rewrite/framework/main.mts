export { default as Component } from './schemes/component.mjs';
import { Component } from './main.mjs';
import ReactiveObject from './reactivity/reactive.mjs';

import ConditionalComponent from './schemes/conditional.mjs';
import MapperComponent from './schemes/mapper.mjs';

Component.prototype.Mapper = function(
    wrapper:    HTMLElement,
    reactive:   ReactiveObject,
    mapperFunc: (i: Number) => HTMLElement
) {
    return this.Component(MapperComponent, wrapper, this, reactive, mapperFunc);
}

Component.prototype.Conditional = function(
    wrapper:        HTMLElement,
    reactive:       ReactiveObject,
    trueRenderFunc: () => HTMLElement
) {
    return this.Component(ConditionalComponent, wrapper, this, reactive, trueRenderFunc);
}