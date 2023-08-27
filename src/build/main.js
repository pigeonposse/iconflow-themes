/**
 * Main file.
 *
 * @description Set all functions.
 */
import { SuperThemes } from '../_super.js'
import archiver        from 'archiver'

export class BuildThemes extends SuperThemes {

	zipDirectory ( sourceDir, outPath ){

		const archive = archiver( 'zip', { zlib: { level: 9 } } )
		const stream  = this.createWriteStream( outPath )
    
		return new Promise( ( resolve, reject ) => {
    
			archive
				.directory( sourceDir, false )
				.on( 'error', err => reject( err ) )
				.pipe( stream )
    
			stream.on( 'close', () => resolve() )
			archive.finalize()
        
		} )
    
	}

	async init(){

		try{

			const content    = await this.fs.readFile( this.listThemesFilePath )
			const contentObj = JSON.parse( content )
			
			// renew dist path
			if ( this.existPath( this.distPath ) ) await this.fs.rm( this.distPath, { recursive: true } )
			await this.fs.mkdir( this.distPath )
                    
			for ( const key in contentObj ) {

				const array = contentObj[key]
				for ( let index = 0; index < array.length; index++ ) {

					const themeName = array[index]
					if( themeName ){

						const themePath = this.path.join( this.dataPath, key, themeName )
						const zipPath   = this.path.join( this.distPath, `${themeName}.zip` )

						// Add zip folder
						await this.zipDirectory( themePath, zipPath )
					
						console.log( `✅ Added ${themeName}.zip in: \n  ${zipPath}` )
					
					}
				
				}
			
			}
		
		}catch( e ){

			throw Error( 'Error in build: ' + e )
		
		}
	
	}

}

export const buildThemes = new BuildThemes( )
