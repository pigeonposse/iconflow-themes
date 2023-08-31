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

			const content    = await this.fs.readFile( this.getListThemesPath() )
			const contentObj = JSON.parse( content )
			
			// renew dist path
			if ( this.existPath( this.distPath ) ) await this.fs.rm( this.distPath, { recursive: true } )
			await this.fs.mkdir( this.distPath )
                    
			for ( const key in contentObj ) {

				const theme = contentObj[key]

				if( theme.free ){

					const zipName   = this.getZipThemeName( theme.name )
					const themePath = this.getThemePath( theme.name, theme.type )
					const zipPath   = this.path.join( this.distPath, zipName )

					// Add zip folder
					await this.zipDirectory( themePath, zipPath )
				
					console.log( `✅ Added ${zipName} in: \n  ${zipPath}` )
				
				}
			
			}
		
		}catch( e ){

			throw Error( 'Error in build: ' + e )
		
		}
	
	}

}

export const buildThemes = new BuildThemes( )
