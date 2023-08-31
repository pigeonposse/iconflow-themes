/**
 * Check file.
 *
 * @description Set function for check if the themes are okey for upload.
 */

import { CheckThemesList } from './list-themes.js'
import { CheckThemesApps } from './list-apps.js'

export class Check {
	
	async init(){

		try {

			const listCheck       = new CheckThemesList()
			const appsCheck       = new CheckThemesApps()
			const validThemesList = await listCheck.init()

			await appsCheck.init( validThemesList )
		
		} catch ( error ) {

			throw Error( 'A error occurred in Check: \n  ' + error )
		
		}
	
	}

}

export const checkThemes = new Check( )
