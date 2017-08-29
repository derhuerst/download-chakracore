'use strict'

const paths = require('env-paths')('download-chakracore')
const path = require('path')
const mkdirp = require('mkdirp')
const fs = require('fs')
const fetch = require('node-fetch')

const findAsset = require('./lib/find-asset')

const download = (version, arch, platform, cache, cb) => {
	version = version || 'latest'
	if (version !== 'latest' && version[0] !== 'v') version = 'v' + version
	arch = arch || process.arch
	platform = platform || process.platform
	cache = cache || process.platform
	console.error('version', version, 'arch', arch, 'platform', platform, 'cache', cache)

	mkdirp(cache, (err) => {
		if (err) return cb(err)

		const file = ['node', version, platform, arch].join('-') + '.zip'
		const dest = path.join(cache, file)
		console.error('dest', dest)
		fs.stat(dest, (err, stats) => {
			if (err && err.code !== 'ENOENT') return cb(err)

			// todo: what if it exists?
			// const exists = !err
			// if (exists) return cb(dest)

			findAsset(version, arch, platform, cache)
			.then((asset) => {
				console.error('asset', asset)
			})
			// const src = baseUrl + version + '/' + file
			// console.error('src', src)
			// fetch(src, {redirect: 'follow'})
			// .then((res) => {
			// 	if (!res.ok) {
			// 		const err = new Error(res.statusText)
			// 		err.statusCode = res.status
			// 		return cb(err)
			// 	}

			// 	const sink = fs.createWriteStream(dest)

			// 	res.body.once('error', (err) => {
			// 		res.body.destroy()
			// 		cb(err)
			// 	})
			// 	sink.once('error', (err) => {
			// 		sink.destroy()
			// 		cb(err)
			// 	})

			// 	res.body.pipe(sink)
			// 	sink.once('finish', cb)
			// })
			// .catch(cb)
		})
	})
}

module.exports = download
