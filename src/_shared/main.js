/**
 * Main file.
 *
 * @description Set all functions.
 */
export class Shared {

	constructor(){

	}

	objDeepMerge( target, source ) {

		for ( const key in source ) {

			if ( source.hasOwnProperty( key ) ) {

				if ( typeof source[key] === 'object' && !Array.isArray( source[key] ) ) {

					if ( !target[key] ) {

						target[key] = {}
					
					}
					this.objDeepMerge( target[key], source[key] )
				
				} else if ( Array.isArray( source[key] ) ) {

					target[key] = target[key] || []
					target[key] = [ ...target[key], ...source[key] ]
				
				} else {

					target[key] = source[key]
				
				}
			
			}
		
		}
	
	}
      
}
