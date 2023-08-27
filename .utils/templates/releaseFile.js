/**
 * Release file.
 *
 * @description Set release file with variables for release body file (.md).
 */

import { pkg } from '../_core.js'

const app = pkg.data.extra.app
export const releaseFile = `# List of downloadable themes for ${app.name} app

Manually download ${app.name} themes.
Custom mac icons in group and free. ✨🖼🍎

ℹ️ **Full changelog:** [Read more](${pkg.data.repository.url}/blob/main/CHANGELOG.md)
📜 **LICENSE:** [Read more](${pkg.data.repository.url}/blob/main/LICENSE)
`
