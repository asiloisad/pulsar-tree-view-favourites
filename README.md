# tree-view-favourites

Add files and folders to a favourites section in [tree-view-plus](https://web.pulsar-edit.dev/packages/tree-view-plus). Favourites persist globally across projects.

![panel](https://github.com/asiloisad/pulsar-tree-view-favourites/blob/master/assets/view.png?raw=true)

## Installation

To install `tree-view-favourites` search for [tree-view-favourites](https://web.pulsar-edit.dev/packages/tree-view-favourites) in the Install pane of the Pulsar settings or run `ppm install tree-view-favourites`. Alternatively, you can run `ppm install asiloisad/pulsar-tree-view-favourites` to install a package directly from the GitHub repository.

Requires [tree-view-plus](https://web.pulsar-edit.dev/packages/tree-view-plus) for the `tree-view-roots` and `tree-view` services.

## Features

- **Global favourites**: Favourite paths are stored in `~/.pulsar/favourites.cson` and persist across sessions.
- **Project filtering**: Only favourites within the current project's directories are shown.
- **Context menu**: Right-click any file or folder to add it to favourites. Right-click a favourite to remove it.
- **Toggle visibility**: Show or hide the favourites section with the `tree-view-favourites:toggle` command.
- **Edit favourites file**: Open the raw favourites file with the `tree-view-favourites:edit` command.
- **External changes**: The favourites file is watched for changes, so edits from other windows or editors are picked up automatically.

## Commands

Commands available in `atom-workspace`:

- `tree-view-favourites:toggle`: toggle favourites section visibility,
- `tree-view-favourites:edit`: open the favourites file for editing.

Commands available in `.tree-view`:

- `tree-view-favourites:add`: add selected entries to favourites,
- `tree-view-favourites:remove`: remove selected entries from favourites.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub — any feedback's welcome!
