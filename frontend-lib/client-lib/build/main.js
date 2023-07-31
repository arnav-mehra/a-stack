export { default as Component } from './schemes/component.js';
export { hydrate } from './hydrator/hydrator.js';
import Component from './schemes/component.js';
import ConditionalComponent from './schemes/conditional.js';
import MapperComponent from './schemes/mapper.js';
Component.prototype.Mapper = function (wrapper, reactive, mapperFunc) {
    return this.Component(MapperComponent, wrapper, this, reactive, mapperFunc);
};
Component.prototype.Conditional = function (wrapper, reactive, trueRenderFunc) {
    return this.Component(ConditionalComponent, wrapper, this, reactive, trueRenderFunc);
};
