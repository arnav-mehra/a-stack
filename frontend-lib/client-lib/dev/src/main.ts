export { default as Component } from './schemes/component.js';
export { hydrate } from './hydrator/hydrator.js';

import Component from './schemes/component.js';
import ReactiveObject from './reactivity/reactive.js';

import ConditionalComponent from './schemes/conditional.js';
import MapperComponent from './schemes/mapper.js';

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