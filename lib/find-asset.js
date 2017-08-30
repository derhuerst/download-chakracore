'use strict'

const fetch = require('node-fetch')

const repo = 'nodejs/node-chakracore'
const endings = ['.zip', '.tar.gz'] // in order of preference

const filePattern = (platform, arch) => {
	return new RegExp(`^node-v[^-]+-${platform}-${arch}\\.`, 'i')
}

const findAsset = (version, arch, platform, cache) => {
	const url = `https://api.github.com/repos/${repo}/releases`
	return fetch(url, {redirect: 'follow'})
	.then((res) => {
		if (!res.ok) {
			const err = new Error(res.statusText)
			err.statusCode = res.status
			throw err
		}
		return res.json()
	})
	.then((all) => {
		const tag = version === 'latest' ? version : 'node-chakracore-' + version
		const r = version === 'latest' ? all[0] : all.find(r => r.tag_name === tag)

		if (!r) throw new Error(`Couldn't find release ${tag}.`)
		if (!Array.isArray(r.assets)) {
			throw new Error(`Release ${tag} has no assets.`)
		}

		const valid = filePattern(platform, arch)
		const a = r.assets
			.filter(a => valid.test(a.name))
			.find(a => endings.some(e => a.name.slice(-e.length) === e))
		if (!a) throw new Error(`Couldn't find a valid assets for release ${tag}.`)

		const ending = endings.find(e => a.name.slice(-e.length) === e)
		const basename = a.name.slice(0, -ending.length)
		return {name: a.name, basename, url: a.browser_download_url}
	})
}

module.exports = findAsset
