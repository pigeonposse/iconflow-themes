/**
 * Check file.
 *
 * @description Set function for check if the themes are okey for upload.
 */

import { SuperThemes } from '../_super.js'

export class CheckThemeConfig extends SuperThemes {

	_isConfigValidStructure( content, path ){

		const expectedTypes = {
			version : 'number',
			banners : 'object',
			author  : 'object',
			desc    : 'string',
			title   : 'string',
		}
        
		for ( const key in expectedTypes ) {

			if ( !content.hasOwnProperty( key ) ) 
				throw Error( `Missing key: ${key} in path ${path}` )
			else if ( typeof content[key] !== expectedTypes[key] ) 
				throw Error( `Incorrect type for ${key}. Expected ${expectedTypes[key]}, but got ${typeof content[key]}. In path ${path}` )
		
		}

		for ( const k in content ) {
			
			if ( k.startsWith( 'title_' ) || k.startsWith( 'desc_' ) ) {

				if ( typeof content[k] !== 'string' ) 
					throw Error( `Incorrect type for ${k}. Expected string, but got ${typeof content[k]}. In path ${path}` )
				
			}

		}
	
	}

	async _validateConfig( { type, name, free, content, configPath } ){

		this._isConfigValidStructure( content, configPath )

		content.free = free ? true : false

		if ( free ) 
			content.downloadUrl = this.getReleaseDownloadUrl( name + '.zip' )
		else if ( !content.downloadUrl ) 
			throw new Error( `downloadUrl does not exist in ${type} ${name}` )

		await this.fs.writeFile( 
			configPath, 
			JSON.stringify( content, null, 2 ), 
		)
	
	}

	async init( { type, name, free } ){

		try {

			console.group( `Check app config for ${type} ${name}` )

			const configPath = this.getThemeConfigPath( name, type )
			await this.fs.access( configPath )

			const contentFile = await this.fs.readFile( configPath, 'utf-8' )
			const content     = JSON.parse( contentFile )
			const args        = { type, name, free, content, configPath }
			this._validateConfig( args )
		
			console.log()
			console.log( `✅ Verification completed in: \n  ${configPath}` )
			console.groupEnd()

			return true

		} catch ( e ) {

			throw Error( `No .config file found in theme ${type} ${name}` )
		
		}
	
	}
	
}
