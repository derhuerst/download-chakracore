'use strict'

const paths = require('env-paths')('download-chakracore')
const path = require('path')

const {ensureDir, fileExists, downloadToPath, link} = require('./lib/helpers')
const findAsset = require('./lib/find-asset')
const extract = require('./lib/extract')

const defaults = {
	version: 'latest',
	arch: process.arch,
	platform: process.platform,
	cache: paths.cache,
	githubToken: null,
	log: () => {}
}

const download = (dest, opt = {}) => {
	opt = {
		version: opt.version || defaults.version,
		arch: opt.arch || defaults.arch,
		platform: opt.platform || defaults.platform,
		cache: opt.cache || defaults.cache,
		githubToken: opt.githubToken || defaults.githubToken,
		log: opt.log || defaults.log
	}
	if (opt.version !== 'latest' && opt.version[0] !== 'v') {
		opt.version = 'v' + opt.version
	}

	return ensureDir(opt.cache)
	.then(() => {
		opt.log(`Fetching ${opt.version} release from GitHub.`)
		return findAsset(opt)
	})
	.then((asset) => {
		const archive = path.join(opt.cache, asset.name)
		const extracted = path.join(opt.cache, asset.basename)
		const src = path.join(extracted, 'bin', 'node')

		return fileExists(archive)
		.then((exists) => {
			if (exists) return
			opt.log(`Downloading ${asset.name}.`)
			return downloadToPath(asset.url, archive)
		})
		.then(() => ensureDir(extracted))
		.then(() => fileExists(src))
		.then((exists) => {
			if (exists) return
			opt.log(`Extracting ${asset.name}.`)
			return extract(archive, extracted)
		})
		.then(() => {
			opt.log(`Linking Node-ChakraCore to ${dest}.`)
			return link(src, dest)
		})
	})
}

module.exports = download
