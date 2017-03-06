# PDF-export
Sketch plugin for PDF exporting


## Developing
To make sure any changes are directly reflected in Sketch, turn off caching.
`defaults write ~/Library/Preferences/com.bohemiancoding.sketch3.plist AlwaysReloadScript -bool YES`

After changes, copy the plugin into the Sketch plugin directory.
`cp -av ~/Projects/PDF-Export/PDF\ Export.sketchplugin ~/Library/Application\ Support/com.bohemiancoding.sketch3/Plugins`

Alternatively, watch the folder for changes, and automatically copy changes across.
`brew install fswatch`
Then in the 'PDF-export' directory
`fswatch -o . | xargs -n1 ./run.sh`


### Class dumping the headers
Download [class-dump](http://stevenygard.com/projects/class-dump/)
Move it to `/usr/local/bin`

Extract the headers using **class-dump**
`class-dump /Applications/Sketch\ Beta.app/Contents/MacOS/Sketch\ Beta -o ~/Desktop`

Or use the `Makefile`
`make` > to extract Sketch header files
`make app='Sketch\ Beta'` ? to extra Sketch Beta header files
