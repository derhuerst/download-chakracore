'use strict'

const mkdirp = require('mkdirp')
const fs = require('fs')
const fetch = require('node-fetch')

const ensureDir = (path) => {
	return new Promise((yay, nay) => {
		mkdirp(path, (err) => {
			if (err) nay(err)
			else yay()
		})
	})
}

const fileExists = (path) => {
	return new Promise((yay, nay) => {
		fs.stat(path, (err, stats) => {
			if (err && err.code !== 'ENOENT') nay(err)
			else yay(!err && stats)
		})
	})
}

const downloadToPath = (url, dest) => {
	return new Promise((yay, nay) => {
		return fetch(url, {redirect: 'follow'})
		.then((res) => {
			if (!res.ok) {
				const err = new Error(res.statusText)
				err.statusCode = res.status
				throw err
			}

			const sink = fs.createWriteStream(dest)
			res.body.pipe(sink)
			sink.once('finish', yay)

			res.body.once('error', (err) => {
				res.body.destroy()
				nay(err)
			})
			sink.once('error', (err) => {
				sink.destroy()
				nay(err)
			})
		})
		.catch(nay)
	})
}

module.exports = {ensureDir, fileExists, downloadToPath}
