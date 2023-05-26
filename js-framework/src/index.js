import {
    Component,
    Element
} from "../framework/main.mjs";

import App from "./app.js";

class Root extends Component {
    constructor() {
        super();
        const element = Element();
        element.ref = document.body;
        this._wrapper = element;
    }

    render() {
        return this.Component(App)
    }
}

const root = new Root();
root._mount();