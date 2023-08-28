/**
 * Check file.
 *
 * @description Set function for check if the themes are okey for upload.
 */

import { SuperThemes } from '../_super.js'

export class CheckThemes extends SuperThemes {
    
	_isConfigValidStructure( content, path ){

		const expectedTypes = {
			version : 'number',
			banners : 'object',
			author  : 'object',
			desc    : 'string',
			title   : 'string',
		}
        
		for ( const key in expectedTypes ) {

			if ( !content.hasOwnProperty( key ) ) {

				throw Error( `Missing key: ${key} in path ${path}` )
			
			} else if ( typeof content[key] !== expectedTypes[key] ) {

				throw Error( `Incorrect type for ${key}. Expected ${expectedTypes[key]}, but got ${typeof content[key]}. In path ${path}` )
			
			}
		
		}
        
		console.log( `✅ Verification completed in: \n  ${path}` )

	}

	async _checkTheme( themePath ){

		try {

			const configPath = this.path.join( themePath, this.themeConfigFileName )
			await this.fs.access( configPath )

			const content = await this.fs.readFile( configPath, 'utf-8' )
			this._isConfigValidStructure( JSON.parse( content ), configPath )
			return true

		} catch ( error ) {

			throw Error( `No .config file found in ${themePath}` )
        
		}
	
	}

	async _checkThemes( ){

		const res = {}

		for ( const themesFolderName of this.themesFolders ) {

			const themesFolderPath = this.path.join( this.dataPath , themesFolderName )
			const themesFolder     = await this.fs.readdir( themesFolderPath )
            
			res[themesFolderName] = []
		
			for ( const themeName of themesFolder ) {

				const themePath = this.path.join( themesFolderPath, themeName )
				const stat      = await this.fs.stat( themePath )
				
				if( stat.isDirectory( ) ){

					const check = await this._checkTheme( themePath )
					if( check )res[themesFolderName].push( themeName )
				
				}
			
			}
        
		}
	
		const listJsonPath = this.path.join( this.dataPath , this.listThemesFileName )

		await this.fs.writeFile( listJsonPath, JSON.stringify( res, null, 2 ) )
		console.log( '' )
		console.log( 'ℹ️  Folders added to list.json:', res )
	
	}
    
	async _isThemesDataFolder(){

		const paths = await this.fs.readdir( this.dataPath )
		
		let res = {
			themes   : true,
			listFile : false,
		}

		for ( const pathName of paths ) {

			if( pathName === this.listThemesFileName ) 
				res.listFile = true
			else if( pathName !== this.listThemesFileName && !this.ignoredPaths.includes( pathName ) ){

				const isThemeFolder = this.themesFolders.includes( pathName )
				if( !isThemeFolder ) res.themes = false
			
			}
		
		}
		
		return res
	
	}

	async init(){

		try {

			const isThemesData = await this._isThemesDataFolder()
		
			if( isThemesData.themes && isThemesData.listFile )
				await this._checkThemes()
			else if( isThemesData.themes && !isThemesData.listFile ) {

				await this.fs.writeFile( this.listThemesFilePath, [] )
				await this._checkThemes()
			
			}else 
				throw Error( `Not valid themes folder ${this.dataPath}` )
		
		} catch ( error ) {

			throw Error( 'An error occurred: ' + error )
		
		}
	
	}

}

export const checkThemes = new CheckThemes( )
