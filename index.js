'use strict'

const paths = require('env-paths')('download-chakracore')
const path = require('path')

const {ensureDir, fileExists, downloadToPath} = require('./lib/helpers')
const findAsset = require('./lib/find-asset')

const download = (version, arch, platform, cache, cb) => {
	version = version || 'latest'
	if (version !== 'latest' && version[0] !== 'v') version = 'v' + version
	arch = arch || process.arch
	platform = platform || process.platform
	cache = cache || paths.cache
	console.error('version', version, 'arch', arch, 'platform', platform, 'cache', cache)

	ensureDir(cache)
	.then(() => findAsset(version, arch, platform, cache))
	.then((asset) => {
		const dest = path.join(cache, asset.name)

		return fileExists(dest)
		.then((exists) => {
			if (!exists) return downloadToPath(asset.url, dest)
		})
		.then(() => {
			console.log('done!', dest)
		})
	})
	.catch(cb)
}

module.exports = download
