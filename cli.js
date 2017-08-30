#!/usr/bin/env node
'use strict'

const pkg = require('./package.json')

const args = process.argv.slice(2).join(' ')
if (args === '-h' || args === '--help') {
	process.stdout.write(`See ${pkg.homepage} for more details.\n`)
	process.exit()
}
if (args === '-v' || args === '--version') {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit()
}

const {fileExists} = require('./lib/helpers')
const download = require('.')

const showError = (err) => {
	if (process.env.NODE_ENV === 'debug') console.error(err)
	else console.error(err.message || err + '')
	process.exit(1)
}

const dest = process.argv[2]
if (!dest) showError('You must pass a destination directory.')

fileExists(dest)
.then((exists) => {
	if (!exists) return showError('Destination directory does not exist.')

	const version = process.env.DOWNLOAD_CHAKRACORE_VERSION || null
	const arch = process.env.DOWNLOAD_CHAKRACORE_ARCH || null
	const platform = process.env.DOWNLOAD_CHAKRACORE_PLATFORM || null
	const cache = process.env.DOWNLOAD_CHAKRACORE_CACHE || null

	return download(dest, version, arch, platform, cache)
})
.catch(showError)
