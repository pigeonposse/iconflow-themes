/**
 * Main file.
 *
 * @description Set all functions.
 */
import fs                                from 'fs/promises'
import { existsSync, createWriteStream } from 'fs'
import path                              from 'path'
import { pkg }                           from '../.utils/_core.js'

export class SuperThemes {

	constructor(){

		this.pkg                 = pkg
		this.path                = path
		this.fs                  = fs
		this.themeConfigFileName = '.conf.json'
		this.listThemesFileName  = 'list.json'
		this.themesFolders       = [
			'community',
			'official',
		]
		this.ignoredPaths        = [
			'.DS_Store',
		]
		this.dataPath            = this.path.join( this.pkg.dir, this.pkg.data.extra.paths.data )
		this.listThemesFilePath  = this.path.join( this.dataPath, this.listThemesFileName )
		this.distPath            = this.path.join( this.pkg.dir, this.pkg.data.extra.paths.dist )
		this.existPath           = existsSync
		this.createWriteStream   = createWriteStream
	
	}

}
