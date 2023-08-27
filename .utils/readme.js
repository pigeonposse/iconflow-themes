/**
 * Readme.
 *
 * @description File that are called in [pnpm readme] cmd.
 *
 * @see /templates/readme.js
 */

import { readme }                           from './templates/readme.js'
import { addReadmeMarks, getMarkdownIndex } from './_core.js'

const dynamicReadme = () => {

	try{

		const readmeObj = [
			{
				key   : 'MARK',
				value : readme.mark,
			},
			{
				key   : 'ORG',
				value : readme.org,
			},
			{
				key   : 'HEADER',
				value : readme.header,
			},
			{
				key   : 'DESCRIPTION',
				value : readme.desc,
			},
			{
				key   : 'INDEX',
				value : `<details>\n<summary>Index</summary>\n\n${getMarkdownIndex( 'README.md' )}\n\n</details>\n`,
			},
		]

		addReadmeMarks( readmeObj )

	}catch( e ){

		throw '📝 ' + e

	}

}

try {
	
	dynamicReadme()

}catch( e ){

	console.log( '❌ ' + e )

}
