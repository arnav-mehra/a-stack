// HTML Templating/Generation

const path = require("path");
const fs = require("fs");

function ClientEntry(
    name,
    props = {}
) {
    return (
        `<component name=${name}`
        + Object.entries(props)
                .map(([key, value]) => ` ${key}=${value}`)
        + `></component>`
    );
};

class ServerComponent {
    constructor(props) {
        this.props = props;
    }

    Element(
        tag = 'div',
        props = {},
        children = []
    ) {
        let html = '<' + tag;
        for (const [ key, val ] of Object.entries(props)) {
            html += ' ' + key + '=' + val;
        }
        html += '>';

        for (const ch of children) {
            if (ch instanceof ServerComponent) {
                html += ch.render();
            }
            html += ch;
        }

        html += '</' + tag + '>';
        return html;
    }

    styleSheetImports() {
        return (this.styleSheets || [])
            .map(relUrl => `<style>@import url("${relUrl}")</style>`)
            .join('\n');
    }

    _render() {
        const body = this.render();
        return (
`<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="bundle.js" type="module"></script>
        ${this.styleSheetImports()}
        <title>${this.title}</title>
    </head>
    <body>
        ${body}
    </body>
</html>`
        );
    }
};

module.exports = {
    ClientEntry,
    ServerComponent
};