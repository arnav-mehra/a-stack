import { Component } from "../framework/main.mjs";

import App from "./app.js";

class Root extends Component {
    constructor() {
        super();
        const element = this.Element();
        element.ref = document.body;
        this._wrapper = element;
    }

    render() {
        return this.Component(
            App,
            this.Element(),
            {
                name: 'John',
                age: 20
            }
        );
    }
}

const root = new Root();
root._mount();