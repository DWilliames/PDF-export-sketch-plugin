app?="Sketch"
VERSION=$(shell /usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" /Applications/$(app).app/Contents/Info.plist)

all:
	mkdir -p dumps/$(app)/$(VERSION) && cd dumps/$(app)/$(VERSION) && class-dump /Applications/$(app).app/Contents/MacOS/$(app) -H
