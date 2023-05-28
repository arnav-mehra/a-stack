export { default as Component } from './schemes/component.mjs';
import { Component } from './main.mjs';

import ConditionalComponent from './schemes/conditional.mjs';
import MapperComponent from './schemes/mapper.mjs';

Component.prototype.Mapper = function(wrapper, reactive, mapperFunc) {
    return this.Component(MapperComponent, wrapper, this, reactive, mapperFunc);
}

Component.prototype.Conditional = function(wrapper, reactive, trueFunc) {
    return this.Component(ConditionalComponent, wrapper, this, reactive, trueFunc);
}