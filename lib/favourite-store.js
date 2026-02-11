const path = require('path')
const fs = require('fs')
const CSON = require('cson')
const {Emitter, CompositeDisposable, File} = require('atom')

module.exports =
class FavouriteStore {
  constructor () {
    this.emitter = new Emitter()
    this.disposables = new CompositeDisposable()
    this.allEntries = []

    this.filePath = path.join(atom.getConfigDirPath(), 'favourites.cson')
    this.file = new File(this.filePath)

    this.load()

    this.disposables.add(
      this.file.onDidChange(() => {
        this.load()
        this.emitter.emit('did-change')
      })
    )
  }

  destroy () {
    this.disposables.dispose()
    this.emitter.dispose()
  }

  onDidChange (callback) {
    return this.emitter.on('did-change', callback)
  }

  load () {
    try {
      if (!fs.existsSync(this.filePath)) {
        this.allEntries = []
        return
      }
      const content = fs.readFileSync(this.filePath, 'utf8').trim()
      if (!content) {
        this.allEntries = []
        return
      }
      const data = CSON.parse(content)
      this.allEntries = Array.isArray(data) ? data : []
    } catch (err) {
      console.warn('[tree-view-favourites] Failed to load favourites:', err)
      this.allEntries = []
    }
  }

  save () {
    try {
      fs.writeFileSync(this.filePath, CSON.stringify(this.allEntries, null, 2))
    } catch (err) {
      console.warn('[tree-view-favourites] Failed to save favourites:', err)
    }
  }

  addEntry (filePath) {
    if (this.allEntries.includes(filePath)) return
    this.allEntries.push(filePath)
    this.save()
  }

  removeEntry (filePath) {
    const index = this.allEntries.indexOf(filePath)
    if (index === -1) return
    this.allEntries.splice(index, 1)
    this.save()
  }

  getFilteredEntries () {
    const projectPaths = atom.project.getPaths()
    if (projectPaths.length === 0) return []
    return this.allEntries.filter(entry =>
      projectPaths.some(pp => entry.startsWith(pp + path.sep) || entry === pp)
    )
  }
}
