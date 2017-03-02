# PDF-export
Sketch plugin for PDF exporting


## Developing
To make sure any changes are directly reflected in Sketch, turn off caching.
`defaults write ~/Library/Preferences/com.bohemiancoding.sketch3.plist AlwaysReloadScript -bool YES`

After changes, copy the plugin into the Sketch plugin directory.
`cp -av ~/Projects/PDF-Export/PDF\ Export.sketchplugin ~/Library/Application\ Support/com.bohemiancoding.sketch3/Plugins`

Alternatively, watch the folder for changes, and automatically copy changes across.
`brew install fswatch`
`chmod +x run.sh`

Then in the 'PDF-export' directory
`cfswatch -o . | xargs -n1 ./run.sh`
