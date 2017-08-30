'use strict'

const assert = require('assert')
const path = require('path')

assert.strictEqual(process.argv[0], path.join(__dirname, 'node'))
assert.strictEqual(process.jsEngine.toLowerCase(), 'chakracore')
