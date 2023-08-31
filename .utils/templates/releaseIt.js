/**
 * Release-it config builder.
 *
 * @description Configuration for release versions in github.
 *
 * @see https://github.com/release-it/release-it/blob/main/docs/configuration.md
 * @see https://github.com/release-it/release-it/blob/main/config/release-it.json
 */

/* eslint-disable no-useless-escape */

import { pkg } from '../_core.js'

const topics = pkg.data.keywords.join( ',' )
const gitUrl = pkg.data.repository.url
const ver    = 'v${version}'

const data = {
	'git' : {
		'requireBranch' : 'main',
		'commitMessage' : `Release ${ver}`,
	},
	'hooks' : {
		'before:init' : [ 
			'git push', 
			'pnpm lint-fix',
			'pnpm check',
		],
		'after:bump' : [
			'pnpm auto-changelog -p',
			'pnpm readme',
		],
		'after:git:release' : 'echo \'After git push, before github release\'',
		'after:release'     : [
			`gh repo edit ${gitUrl} -d \"${pkg.data.description}\"`,
			`gh repo edit ${gitUrl} --add-topic ${topics}`,
			`echo \'Github action is now releasing: ${pkg.data.name} ${ver} to ${gitUrl}.\n Check if all is ok 🌈🤖\n ${gitUrl}/actions\'`,
		],
	},
	'github' : {
		'release' : false,
	},
	'npm' : {
		'publish' : false,
	},
}

export const releaseIt = JSON.stringify( data, null, 4 )
