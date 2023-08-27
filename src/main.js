/**
 * Main file.
 *
 * @description Set all functions.
 */
import { checkThemes } from './check/main.js'
import { buildThemes } from './build/main.js'

try {
    
	const init = async () => {

		if ( process.argv.includes( '--build' ) ) {

			await buildThemes.init()
		
		}else if ( process.argv.includes( '--check' ) ) {

			await checkThemes.init()
		
		}else{

			console.group( 'Check function: ' )
			await checkThemes.init()
			console.groupEnd()
			console.log()
			console.group( 'Build function:' )
			await buildThemes.init()
			console.groupEnd()
		
		}
	
	}

	init()

}catch( e ){

	console.error( e )    

}
