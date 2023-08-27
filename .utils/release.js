/**
 * Release inquirer.
 *
 * @description Inquirer for release versions in github.
 *
 * @see /templates/release.js
 */

import inquirer                 from 'inquirer'
import { releaseIt }            from './templates/releaseIt.js'
import { exec, writeSync, pkg } from './_core.js'
import { releaseFile }          from './templates/releaseFile.js'

const release = async () => {

	writeSync( pkg.data.extra.paths.releaseIt, releaseIt )
	writeSync( pkg.data.extra.paths.releaseFile, releaseFile )
	
	console.log( '' )

	try {

		const questions = [
			{
				type    : 'input',
				name    : 'git_add',
				message : 'Add files for git',
				default() {
		
					return '.'
				
				},
			},
			{
				type    : 'input',
				name    : 'git_commit',
				message : 'Set release commit',
				default() {
		
					return 'Release commit 🌈⚡️'
				
				},
			},
		]
		
		const answers = await inquirer.prompt( questions )
		
		if ( !answers || !answers.git_add || ! answers.git_commit ) return

		const cmd = {
			gitAdd    : 'git add ' + answers.git_add,
			gitCommit : 'git commit -m "' + answers.git_commit + '"',
			releaseIt : 'pnpm release-it',
		}

		exec( cmd.gitAdd )
		exec( cmd.gitCommit )
		exec( cmd.releaseIt )
	
	}catch( e ){

		console.error( e )
	
	}

}

release()
