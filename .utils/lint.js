/**
 * Lint.
 *
 * @description File that are called in [pnpm lint] cmd.
 */

import inquirer      from 'inquirer'
import { exec, pkg } from './_core.js'

const execLint = async ( flag = '' ) => {

	const res = await exec( `eslint ${pkg.dir} --ext .js ${flag}` )
	res

}

const questions = async () => {

	try {

		const answers = await inquirer.prompt( [
			{
				type    : 'list',
				name    : 'lint',
				message : 'Select lint type',
				default : 'check',
				choices : [
					{
						name : 'Check', value : 'check',
					},
					{
						name : 'Fix', value : 'fix',
					},
				],
			},
		] )
		if ( answers && answers.lint === 'check' ) await execLint()
		if ( answers && answers.lint === 'fix' ) await execLint( '--fix' )
	
	}catch( error ) {

		throw `❌ LINT Error: ${error}` 
	
	} 

}

try{

	if ( process.argv.includes( '--fix' ) ) {

		execLint( '--fix' )
	
	}else if ( process.argv.includes( '--check' ) ) {

		execLint( )
	
	}else {

		questions()
	
	}

}catch( e ){

	console.error( e )

}
