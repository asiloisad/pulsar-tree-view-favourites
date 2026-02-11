const path = require('path')
const fs = require('fs')
const CSON = require('cson')
const {Emitter, CompositeDisposable, File} = require('atom')

module.exports =
class FavouriteStore {
  constructor () {
    this.emitter = new Emitter()
    this.disposables = new CompositeDisposable()
    this.groups = {}

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
        this.groups = {}
        return
      }
      const content = fs.readFileSync(this.filePath, 'utf8').trim()
      if (!content) {
        this.groups = {}
        return
      }
      const data = CSON.parse(content)
      if (Array.isArray(data)) {
        // Migrate flat array to grouped format
        this.groups = data.length > 0 ? { Favourites: data } : {}
        this.save()
      } else if (data && typeof data === 'object') {
        this.groups = data
      } else {
        this.groups = {}
      }
    } catch (err) {
      console.warn('[tree-view-favourites] Failed to load favourites:', err)
      this.groups = {}
    }
  }

  save () {
    try {
      fs.writeFileSync(this.filePath, CSON.stringify(this.groups, null, 2))
    } catch (err) {
      console.warn('[tree-view-favourites] Failed to save favourites:', err)
    }
  }

  getGroupNames () {
    return Object.keys(this.groups)
  }

  addEntry (groupName, filePath) {
    if (!this.groups[groupName]) {
      this.groups[groupName] = []
    }
    if (this.groups[groupName].includes(filePath)) return
    this.groups[groupName].push(filePath)
    this.save()
  }

  removeEntry (groupName, filePath) {
    const group = this.groups[groupName]
    if (!group) return
    const index = group.indexOf(filePath)
    if (index === -1) return
    group.splice(index, 1)
    if (group.length === 0) {
      delete this.groups[groupName]
    }
    this.save()
  }

  findGroupForPath (filePath) {
    for (const groupName of this.getGroupNames()) {
      if (this.groups[groupName].includes(filePath)) {
        return groupName
      }
    }
    return null
  }

  getFilteredEntries (groupName) {
    const group = this.groups[groupName]
    if (!group) return []
    const projectPaths = atom.project.getPaths()
    if (projectPaths.length === 0) return []
    return group.filter(entry =>
      projectPaths.some(pp => entry.startsWith(pp + path.sep) || entry === pp)
    )
  }
}
