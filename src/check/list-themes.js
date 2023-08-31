/**
 * Check file.
 *
 * @description Set function for check if the themes are okey for upload.
 */

import { SuperThemes }      from '../_super.js'
import { CheckThemeConfig } from './app-config.js'

export class CheckThemesList extends SuperThemes {

	async _checkThemeStructure( data ){

		const themeFolder = await this.fs.readdir( this.getThemePath( data.name, data.type ) )
		const validPaths  = [ ...this.ignoredPaths, this.themeDocsFolderName, this.themeConfigFileName ]
		if( data.free ) validPaths.push( this.themeAppsFolderName )

		const check = themeFolder.filter( d => !validPaths.includes( d ) )

		if ( check.length > 0 ) throw `Theme does has valid structure, file allowed: ${validPaths}`
	
	}

	async _checkThemes( ){

		const res = []

		for ( const themesFolderName of this.themesFolders ) {

			const themesFolderPath = this.getThemeTypePath( themesFolderName )
			const themesFolder     = await this.fs.readdir( themesFolderPath )
		
			for ( const themeName of themesFolder ) {

				const themePath = this.getThemePath( themeName, themesFolderName )
				const stat      = await this.fs.stat( themePath )
				
				if( stat.isDirectory( ) ){

					const themeAppsPath = this.getThemeAppsPath( themeName, themesFolderName )
					const config        = new CheckThemeConfig()
					const configData    = {
						name : themeName,
						type : themesFolderName,
						free : this.existPath( themeAppsPath ) ? true : false,
					} 
					
					await this._checkThemeStructure( configData )

					const checkConfig = await config.init( configData )
					
					if( checkConfig ) res.push( configData )
				
				}else {

					// when is not a theme DIRECTORY or Readme file
					if( !this.ignoredPaths.includes( themeName ) ) throw `Theme type ${themesFolderName} has a not allowed file: ${themeName}`
				
				}
			
			}
        
		}
	
		const listJsonPath = this.getListThemesPath()

		await this.fs.writeFile( listJsonPath, JSON.stringify( res, null, 2 ) )
		
		return res

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
			else if( !this.dataFolderJsonFiles.includes( pathName ) && !this.ignoredPaths.includes( pathName ) ){

				const isThemeFolder = this.themesFolders.includes( pathName )
				if( !isThemeFolder ) res.themes = false
			
			}
		
		}
		
		if( !res.themes && !res.listFile ) throw `Not valid data folder ${this.dataPath}` 
		if( !res.listFile ) await this.fs.writeFile( this.listThemesFilePath, [] )

		return res
	
	}

	async init(){

		try {

			console.group( 'Check themes structure' )

			await this._isThemesDataFolder()
			const res = await this._checkThemes()
			
			console.log()
			console.log( '✅ Folders added to list.json:', res )
			console.groupEnd()

			return res

		} catch ( e ) {

			throw Error( e )
		
		}
	
	}
	
}
