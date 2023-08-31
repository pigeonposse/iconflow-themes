/**
 * Main file.
 *
 * @description Set all functions.
 */
import fs                                from 'fs/promises'
import { existsSync, createWriteStream } from 'fs'
import path                              from 'path'
import { pkg }                           from '../.utils/_core.js'
import { Shared }                        from './_shared/main.js'

export class SuperThemes {

	constructor(){

		this.pkg                 = pkg
		this.path                = path
		this.fs                  = fs
		this.utils               = new Shared()
		this.existPath           = existsSync
		this.createWriteStream   = createWriteStream
		this.themeConfigFileName = '.conf.json'
		this.listThemesFileName  = 'list.json'
		this.appsListFileName    = 'apps.json'
		this.themeAppsFolderName = 'apps'
		this.themeDocsFolderName = '.docs'
		this.branch              = 'main'
		this.dataFolderJsonFiles = [
			this.listThemesFileName,
			this.appsListFileName,
		]
		this.themesFolders       = [
			'community',
			'official',
		]
		this.ignoredPaths        = [
			'.DS_Store',
			'README.md',
			'.README.md',
		]
		this.validIconExts       = [
			'.icns',
			'.png',
		]
		this.dataPath            = this.path.join( this.pkg.dir, this.pkg.data.extra.paths.data )
		this.listThemesFilePath  = this.path.join( this.dataPath, this.listThemesFileName )
		this.appsListFilePath    = this.path.join( this.dataPath, this.appsListFileName )
		this.distPath            = this.path.join( this.pkg.dir, this.pkg.data.extra.paths.dist )
		
	}
	getReleaseDownloadUrl( name = '' ){

		return this.path.join( pkg.data.repository.url, 'releases/download/latest', name )
	
	}
	getRepoUrl( type = '' ){

		if( type === 'raw' )
			return this.path.join( pkg.data.repository.url.replace( 'github', 'raw.githubusercontent' ), this.branch )
		else
			return this.path.join( pkg.data.repository.url, 'tree', this.branch )
	
	}
	
	getThemeTypePath( themeType = 'official' ){

		return this.path.join( this.pkg.dir, this.pkg.data.extra.paths.data, themeType )
	
	}

	getThemePath( themeName, themeType = 'official' ){

		return this.path.join( this.getThemeTypePath( themeType ), themeName )
	
	}

	getThemeAppsPath( themeName, themeType = 'official' ){

		return this.path.join( this.getThemePath( themeName, themeType ), this.themeAppsFolderName )
	
	}

	getThemeRepoUrl( themeName, themeType = 'official', repoType = '' ) {

		return this.path.join( this.getRepoUrl( repoType ), this.pkg.data.extra.paths.data, themeType, themeName )
	
	}

	getThemeConfigUrl( themeName, themeType = 'official' ){

		return this.path.join( this.getThemeRepoUrl( themeName, themeType, 'raw' ), this.themeConfigFileName )
	
	}

	getThemeConfigPath( themeName, themeType = 'official' ){

		return this.path.join( this.getThemePath( themeName, themeType ), this.themeConfigFileName )
	
	}
	
	getListThemesPath(){

		return this.path.join( this.dataPath , this.listThemesFileName )
	
	}

}
