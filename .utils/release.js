/**
 * Release inquirer.
 *
 * @description Inquirer for release versions in github.
 *
 * @see /templates/release.js
 */

import inquirer                           from 'inquirer'
import { releaseIt }                      from './templates/releaseIt.js'
import { exec, writeSync, pkg, joinPath } from './_core.js'
import { releaseFile }                    from './templates/releaseFile.js'

const noRelease = process.argv.includes( '--no-release' )

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
			push      : 'git push -u origin main',
			releaseIt : 'pnpm exec release-it -c ' + joinPath( pkg.dir, pkg.data.extra.paths.releaseIt ),
		}

		exec( cmd.gitAdd )
		exec( cmd.gitCommit )
		
		if ( noRelease )
			await exec( cmd.push )
		else
			await exec( cmd.releaseIt )
	
	}catch( e ){

		console.group( 'Error' )
		console.error( e )
		console.groupEnd()
		process.exit( 1 )
	
	}finally{

		process.exit( 0 )
	
	}

}

release()
