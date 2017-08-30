'use strict'

const paths = require('env-paths')('download-chakracore')
const path = require('path')

const {ensureDir, fileExists, downloadToPath, link} = require('./lib/helpers')
const findAsset = require('./lib/find-asset')
const extract = require('./lib/extract')

const noop = () => {}

const download = (dest, version, arch, platform, cache, log = noop) => {
	version = version || 'latest'
	if (version !== 'latest' && version[0] !== 'v') version = 'v' + version
	arch = arch || process.arch
	platform = platform || process.platform
	cache = cache || paths.cache

	return ensureDir(cache)
	.then(() => {
		log(`Fetching ${version} release from GitHub.`)
		return findAsset(version, arch, platform, cache)
	})
	.then((asset) => {
		const archive = path.join(cache, asset.name)
		const extracted = path.join(cache, asset.basename)
		const src = path.join(extracted, 'bin', 'node')

		return fileExists(archive)
		.then((exists) => {
			if (exists) return
			log(`Downloading ${asset.name}.`)
			return downloadToPath(asset.url, archive)
		})
		.then(() => ensureDir(extracted))
		.then(() => fileExists(src))
		.then((exists) => {
			if (exists) return
			log(`Extracting ${asset.name}.`)
			return extract(archive, extracted)
		})
		.then(() => {
			log(`Linking Node-ChakraCore to ${dest}.`)
			return link(src, dest)
		})
	})
}

module.exports = download
