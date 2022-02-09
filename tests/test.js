// use ava test framework in nodejs environment and tape in browser
// ava does not have in-browser runner unfortunately
// see test-browser.js and package.json browser field

// https://github.com/import-js/eslint-plugin-import/issues/2352
// eslint-disable-next-line import/no-unresolved
module.exports = require('ava')
