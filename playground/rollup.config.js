const { nodeResolve } = require('@rollup/plugin-node-resolve');

module.exports = {
    output: {
        format: 'es'
    },
    plugins: [
        nodeResolve()
    ]
};