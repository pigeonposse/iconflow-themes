/**
 * Core for .Utils folder.
 *
 * @description Functions for .Utils folder.
 */

/* eslint-disable no-useless-catch */
import { spawn }         from 'child_process'
import { fileURLToPath } from 'url'
import fs                from 'fs'
import path              from 'path'

export const exec = async ( cmd ) => {

	console.log( `🐢 CMD: ${cmd}` )
	try {

		await new Promise( ( resolve, reject ) => {

			const childProcess = spawn( cmd, {
				shell : true,
				stdio : 'inherit',
			} )

			// Manejar eventos del proceso hijo
			childProcess.on( 'close', ( code ) => {

				if ( code === 0 ) {

					// El proceso hijo terminó con éxito
					console.log( 'Successfull executed ✨' )
					resolve( )
				
				} else {

					// El proceso hijo falló
					const error = new Error( `Command failed with code ${code}` )
					console.error( error )
					reject( error )
			
				}
		
			} )
	
		} )

	} catch ( err ) {

		// La promesa se rechazó, propagar el error
		throw err

	}

}

export const pkgFunct = ( fileName ) => {

	const json = ( projectPath ) => JSON.parse( fs.readFileSync( projectPath ) )

	let projectPath = path.join(
		path.dirname( fileURLToPath( import.meta.url ) ),
		'..', 
	)

	// when is used in the compilated files of 'dist' folder
	if ( projectPath.includes( 'dist' ) ) projectPath = path.join( projectPath, '..' )

	const pkgPath = path.join( projectPath, fileName + '.json' )
	const pkgData = json( pkgPath )

	return {
		path : pkgPath,
		dir  : projectPath,
		data : pkgData,
	}

}

export const pkg = pkgFunct( 'package' )

export const writeSync = ( projectPath, txt ) => {

	const filePath = path.join( pkg.dir, projectPath )

	console.log()

	console.group( `🐢 writeFileSync: ${filePath}` )
		
	fs.writeFileSync( filePath, txt )

	console.log( '✅ File overwritten!' )

	console.groupEnd()

}
export const joinPath = path.join

export const addTextBetweenAMark = async ( projectPath, startMarker, endMarker, textToAdd ) =>{

	const filePath       = path.join( pkg.dir, projectPath )
	const fileContent    = fs.readFileSync( filePath, 'utf-8' )
	const startIndex     = fileContent.indexOf( startMarker ) + startMarker.length
	const endIndex       = fileContent.indexOf( endMarker )
	const newTextContent = `${fileContent.substring( 0, startIndex )}\n${textToAdd}\n${fileContent.substring( endIndex )}`

	writeSync( projectPath, newTextContent )

}

export const addReadmeMarks = async ( readmeObj ) =>{
	
	try {

		for ( let i = 0; i < readmeObj.length; i++ ) {

			console.group( '🌈 Add readme text in mark: ' + readmeObj[i].key )

			addTextBetweenAMark( 
				'README.md', 
				`<!-- PIGEONPOSSE START ${readmeObj[i].key} -->`, 
				`<!-- PIGEONPOSSE END ${readmeObj[i].key} -->`, 
				readmeObj[i].value, 
			)

			console.log( '\n' )
			console.groupEnd()
			
		}

	} catch ( error ) {

		console.error( error )

	}

}
export const renameAndCopyFiles = async ( oldFileName, tempFileName, newFileName ) => {

	try {

		await fs.promises.rename( oldFileName, tempFileName )
		await fs.promises.copyFile( tempFileName, newFileName )
	
	} catch ( error ) {

		throw `❌ ${error}`
	
	}

}

export const createSymlink = async ( sourceDir, targetDir ) =>{

	try {

		await fs.promises.access( targetDir )
	
	} catch ( error ) {

		if ( error.code === 'ENOENT' ) {

			// El directorio destino no existe, lo creamos
			await fs.promises.mkdir( targetDir, { recursive: true } )
		
		} else {

			throw `❌🔗 ${error}`
		
		}
	
	}

	const sourceStat = await fs.promises.lstat( sourceDir )
	// const targetStat = await fs.promises.lstat( targetDir )
	const isWin = process.platform === 'win32'

	if ( sourceStat.isDirectory() ) {

		if ( isWin ) {

			// En Windows, debemos crear un enlace de tipo 'junction'
			await fs.promises.symlink( sourceDir, path.join( targetDir, path.basename( sourceDir ) ), 'junction' )
		
		} else {

			// En Linux y macOS, podemos crear enlaces simbólicos directos a directorios
			await fs.promises.symlink( sourceDir, path.join( targetDir, path.basename( sourceDir ) ), 'dir' )
		
		}
	
	} else if ( sourceStat.isFile() ) {

		// Si la fuente es un archivo, creamos un enlace simbólico a ese archivo
		await fs.promises.symlink( sourceDir, path.join( targetDir, path.basename( sourceDir ) ) )
	
	}

	console.log( `🔗 symlink: "${sourceDir}" to "${targetDir}".` )

}

export const copyDir = async ( src, dest ) => {

	try {

		// Read the source directory
		const entries = await fs.promises.readdir( src, { withFileTypes: true } )

		// Create the destination directory if it doesn't exist
		await fs.promises.mkdir( dest, { recursive: true } )

		// Loop through the entries in the source directory
		for ( const entry of entries ) {

			const srcPath  = path.join( src, entry.name )
			const destPath = path.join( dest, entry.name )

			if ( entry.isDirectory() ) {

				// Recursively copy the subdirectory
				await copyDir( srcPath, destPath )
			
			} else {

				// Copy the file
				await fs.promises.copyFile( srcPath, destPath )
			
			}
		
		}

		console.log( `📁 Directory copied from ${src} to ${dest}` )
	
	} catch ( error ) {

		throw `📁 Error copying directory: ${error.message}`
	
	}

}

const removeEmojiFromStart = ( inputString ) => {

	const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu
	return inputString.replace( emojiRegex, '' )

}

export const getMarkdownIndex = ( projectPath ) => {
	
	try {

		const filePath = path.join( pkg.dir, projectPath )
		const data     = fs.readFileSync( filePath, 'utf8' )

		const lines = data.split( '\n' )
		const index = []

		for ( let i = 0; i < lines.length; i++ ) {

			const line = lines[i].trim()

			if ( line.startsWith( '##' ) ) {

				const titleLevel = line.indexOf( ' ' )
				const titleText  = line.substring( titleLevel + 1 )
				const titleLink  = titleText.toLowerCase()
					.replace( /\s+/g, '-' )
					.replace( /^\p{Emoji}/u, '' )

				index.push( { level: titleLevel - 2, text: titleText, link: removeEmojiFromStart( titleLink ) } )

			}
			
		}

		const indexContent = index
			.map( ( { level, text, link } ) => {

				if ( level > 0 ) return `${' '.repeat( level * 2 )}- [${text}](#${link})`
				return `- [${text}](/#${link})`
				
			} )
			.join( '\n' )

		return indexContent

	} catch ( err ) {

		throw 'Error reading file:', err
	
	}

}
