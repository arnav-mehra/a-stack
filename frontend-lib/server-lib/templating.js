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
            .map(relUrl => `<link href="${relUrl}" rel="stylesheet"/>`)
            .join('\n');
    }

    _render() {
        const body = this.render();
        return (
`<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>${this.title}</title>
        ${this.styleSheetImports()}
        <script src="bundle.js" type="module"></script>
    </head>
    <body id="main">
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