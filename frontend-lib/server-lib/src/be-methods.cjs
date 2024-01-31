const { METHODS } = require("./pages.cjs");

const loadBackendMethods = (userMethods) => {
    for (const method of Object.keys(userMethods)) {
        const new_methods = userMethods[method];
        const old_methods = METHODS[method.toUpperCase()];

        if (!old_methods) {
            console.error(`${method} is not a recognized method type.`);
            continue;
        }

        for (const [ route, fn ] of Object.entries(new_methods)) {
            if (old_methods[route]) {
                console.error(`${method}/${route} already exists and cannot be overwritten.`);
                continue;
            }

            old_methods[route] = { fn, mime: 'application/json' };
        }
    }
};

module.exports = {
    loadBackendMethods
};