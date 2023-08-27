/**
 * Readme file.
 *
 * @description Set differents seccions of Readme file with parametres from package.json.
 */

import { mark } from './mark.js'
import { pkg }  from '../_core.js'

const collective = pkg.data.extra.collective
const fundingUrl = pkg.data.funding.url
const repogUrl   = pkg.data.repository.url
const app        = pkg.data.extra.app

const org =  `
## ☕ Donate

Help us to develop more interesting things.

[![Donate](https://img.shields.io/badge/Donate-grey?style=flat-square)](${fundingUrl})

## 📜 License

This software is licensed with **[${pkg.data.license}](/LICENSE)**.

[![Read more](https://img.shields.io/badge/Read-more-grey?style=flat-square)](/LICENSE)

## 🐦 About us

_PigeonPosse_ is a ✨ **code development collective** ✨ focused on creating practical and interesting tools that help developers and users enjoy a more agile and comfortable experience. Our projects cover various programming sectors and we do not have a thematic limitation in terms of projects.

[![More](https://img.shields.io/badge/Read-more-grey?style=flat-square)](https://github.com/PigeonPosse/PigeonPosse)

### Collaborators

|                                                                                    | Role         | Name                                         |
| ---------------------------------------------------------------------------------- | ------------ | ---------------------------------------------- |
| <img src="${pkg.data.author.url}.png?size=72" /> | Author & Development | [@${pkg.data.author.name}](${pkg.data.author.url}) |
| <img src="${pkg.data.contributors[0].url}.png?size=72" /> | Icon Designer | [@${pkg.data.contributors[0].name}](${pkg.data.contributors[0].url}) |
| <img src="https://github.com/${collective.name}.png?size=72" /> | Collective | [@${collective.name}](https://github.com/${collective.name}) |
`

const header = `# Free Macos icons for ${app.name} app

![HEADER](docs/banner.png)

[![Web](https://img.shields.io/badge/Web-grey?style=flat-square)](${collective.web})
[![About us](https://img.shields.io/badge/About%20us-grey?style=flat-square)](${collective.web}/?popup=about)
[![Github](https://img.shields.io/badge/Github-grey?style=flat-square)](https://github.com/pigeonposse)
[![Donate](https://img.shields.io/badge/Donate-pink?style=flat-square)](${fundingUrl})

[![LICENSE](https://img.shields.io/badge/License-grey?style=flat-square)](/LICENSE)
[![Version](https://img.shields.io/github/package-json/v/${collective.name.toLowerCase()}/${pkg.data.name.toLowerCase()}?color=a1b858&label=GitHub%20Releases&style=flat-square)](${pkg.data.repository.url}/releases)`

const desc = `Download lots of icons for your mac apps. In this repository you can find the icon themes for the ${app.name} app, but they can also be downloaded independently.

## Download links 🖥️💫

- [![Themes](https://img.shields.io/badge/Themes-grey?style=flat-square)](${repogUrl}/releases)
- [![${app.name} app](https://img.shields.io/badge/${app.name}-app-grey?style=flat-square)](${app.downloadUrl})`

const markFunct = `<!--\n${mark( pkg )}\n-->`

export const readme = {
	org,
	header,
	mark : markFunct,
	desc,
}
