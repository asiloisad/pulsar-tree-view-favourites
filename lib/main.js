const {CompositeDisposable, Disposable} = require('atom')
const FavouriteStore = require('./favourite-store')

module.exports = {
  activate () {
    this.store = new FavouriteStore()
    this.disposables = new CompositeDisposable()
    this.treeView = null
    this.rootHandle = null

    this.disposables.add(
      atom.commands.add('.tree-view', {
        'tree-view-favourites:add':    () => this.addSelected(),
        'tree-view-favourites:remove': () => this.removeSelected(),
      }),
      atom.commands.add('atom-workspace', {
        'tree-view-favourites:edit': () => atom.workspace.open(this.store.filePath),
        'tree-view-favourites:toggle': () => { if (this.rootHandle) this.rootHandle.toggle() },
      })
    )

    this.disposables.add(
      atom.project.onDidChangePaths(() => {
        if (this.rootHandle) this.rootHandle.update()
      })
    )

    this.disposables.add(
      this.store.onDidChange(() => {
        if (this.rootHandle) this.rootHandle.update()
      })
    )
  },

  deactivate () {
    if (this.rootHandle) {
      this.rootHandle.dispose()
      this.rootHandle = null
    }
    this.disposables.dispose()
    this.store.destroy()
  },

  consumeRoots (api) {
    this.rootHandle = api.addRoot({
      name: 'Favourites',
      iconClass: 'icon-star',
      className: 'favourites-section',
      entryClassName: 'favourite-entry',
      getEntries: () => this.store.getFilteredEntries(),
    })
    return new Disposable(() => {
      if (this.rootHandle) {
        this.rootHandle.dispose()
        this.rootHandle = null
      }
    })
  },

  consumeTreeView (treeView) {
    this.treeView = treeView
    return new Disposable(() => { this.treeView = null })
  },

  addSelected () {
    if (!this.treeView) return
    const paths = this.treeView.selectedPaths()
    for (const p of paths) {
      this.store.addEntry(p)
    }
    if (this.rootHandle) this.rootHandle.update()
  },

  removeSelected () {
    if (!this.treeView) return
    const paths = this.treeView.selectedPaths()
    for (const p of paths) {
      this.store.removeEntry(p)
    }
    if (this.rootHandle) this.rootHandle.update()
  },
}
