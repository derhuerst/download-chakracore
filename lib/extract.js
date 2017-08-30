'use strict'

const path = require('path')
const {exec} = require('child_process')
const esc = require('any-shell-escape')

const cmds = { // signature: path, dest, filter
	'.zip': (p, d, f) => [
		'unzip',
		'-j', '-o', // flatten, overwrite
		'-d', d, // destination dir
		p, // archive
	],
	'.tar.gz': (p, d, f) => [
		'gtar', '-xz',
		'--strip-components', '1', // flatten
		'-C', d, // destination dir
		'-f', p, // archive
	]
}
const endings = Object.keys(cmds)

const extract = (src, dest) => {
	const file = path.basename(src)
	const ending = endings.find(e => file.slice(-e.length) === e)
	if (!ending) return Promise.reject(new Error('cannot extract ' + file))

	const cmd = cmds[ending](src, dest, 'bin/node')
	return new Promise((yay, nay) => {
		exec(esc(cmd), {stdio: 'ignore'}, (err) => {
			if (err) nay(err)
			else yay()
		})
	})
}

module.exports = extract
