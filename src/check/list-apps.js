/**
 * Check file.
 *
 * @description Set function for check if the themes are okey for upload.
 */

import { SuperThemes } from '../_super.js'

export class CheckThemesApps extends SuperThemes {
    
	async _processThemesFiles( themesList ) {

		let res = []

		const _process = async ( currentPath, currentAppType, currentThemeName, themeType ) => {

			const files = await this.fs.readdir( currentPath )
			
			for ( const file of files ) {

				if ( this.ignoredPaths.includes( file ) ) continue

				const filePath  = this.path.join( currentPath, file )
				const fileStats = await this.fs.stat( filePath )

				if ( fileStats.isFile() ) {

					const extname            = this.path.extname( file )
					const fileNameWithoutExt = this.path.basename( file, extname )
			
					if( !this.validIconExts.includes( extname ) ) throw `Not valid file in apps folder ${filePath}`
					
					const existingItem = res.find( item => item.name === fileNameWithoutExt )
					if ( !existingItem ) {

						res.push( {
							name    : fileNameWithoutExt,
							appType : currentAppType,
							themes  : [ {
								type : themeType,
								name : currentThemeName,
							} ],
						} )

					} else {

						existingItem.themes.push( {
							type : themeType,
							name : currentThemeName,
						} )

					}

				} else if ( fileStats.isDirectory() ) {

					await _process( filePath, file, currentThemeName, themeType )

				}

			}

		}

		for ( const theme of themesList ) {

			if( theme['free'] == true ){

				const themesPath = this.getThemeAppsPath( theme['name'], theme['type'] )
				await _process( 
					themesPath, 
					this.themeAppsFolderName, 
					theme['name'], 
					theme['type'], 
				) 
			
			}

		}

		return res

	}

	async init( themesList ){

		try{

			console.group( 'Check themes apps' )

			const res = await this._processThemesFiles( themesList )

			await this.fs.writeFile( 
				this.appsListFilePath, 
				JSON.stringify( res, null, 2 ), 
			)
				
			console.log( `✅ Succesfully added apps in ${this.appsListFilePath}` )
			console.groupEnd()

		}catch( e ){

			throw Error( `Error checking Apps in themes \n:  ${e}` )
		
		}
	
	}

}
