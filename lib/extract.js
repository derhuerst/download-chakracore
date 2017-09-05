'use strict'

const decompress = require('decompress-archive')

const extract = (src, dest) => {
	return new Promise((yay, nay) => {
		decompress(src, dest, 1, (err) => {
			if (err) nay(err)
			else yay()
		})
	})
}

module.exports = extract
