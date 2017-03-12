@import 'MochaJSDelegate.js'
@import 'defaults.js'


function showOptionsWindow(exportOption, name, callback) {

  var title = ""
  var message = ""

  switch (exportOption) {
    case "all-pages":
      title = "Export all pages to PDF"
      message = "Export all " + doc.pages().length + " pages from '" + name + "' into a single PDF document"
      break
    case "current-page":
      title = "Export current page to PDF"
      message = "Export Artboards from '" + name + "' into a single PDF document"
      break
    case "selection":
      title = "Export selection to PDF"
      message = "Export selected Artboards into a single PDF document"
      break
    default:
  }

  fetchDefaults()

  var alert = NSAlert.alloc().init()
  alert.setIcon(iconImage)
	alert.setMessageText(title)
	alert.setInformativeText(message)
	alert.addButtonWithTitle("Export")
	alert.addButtonWithTitle("Cancel")

  var y = 250
  var container = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, y))
  alert.setAccessoryView(container)

  y -= 40
  var artboardLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, y, 150, 20))
  artboardLabel.setBezeled(false)
  artboardLabel.setDrawsBackground(false)
  artboardLabel.setEditable(false)
  artboardLabel.setSelectable(false)
  artboardLabel.setStringValue("Artboard Order")
  artboardLabel.setFont(NSFont.paletteFontOfSize(NSFont.systemFontSize()))
  container.addSubview(artboardLabel)

  var orderButton = NSButton.alloc().initWithFrame(NSMakeRect(-30, y, 300, 20))
  orderButton.setBezelStyle(NSHelpButtonBezelStyle)
  orderButton.setTitle('')
  orderButton.setCOSJSTargetFunction(() => {
    // Dismiss the alert
    alert.buttons().objectAtIndex(1).performClick(alert)
    AppController.sharedInstance().openPreferencesWindowWithPreferencePaneIdentifier("general")

    var prefWindow = NSApplication.sharedApplication().keyWindow()
    var prefView = prefWindow.contentView().subviews().firstObject()
    prefView.subviews().find(view => {
      if (view.isMemberOfClass(NSPopUpButton)) {
        view.performSelector_withObject_afterDelay('performClick:', prefView, 0.2)
        return true
      }
    })

  })
  container.addSubview(orderButton)

  y -= 23
  var order = NSPopUpButton.alloc().initWithFrame(NSMakeRect(0, y, 180, 23))
  order.setNeedsDisplay()

  var options = [
    {
      title: "From the Layer List:",
      values: ["Top to bottom", "Bottom to top"]
    },
    {
      title: "From the Canvas",
      values: ["Left to right", "Right to left", "Top to bottom"]
    }
  ]

  var menu = NSMenu.alloc().init()
  var menuItemCallback = function(menuItem) {
    // print("item selected: " + menuItem.representedObject())
  }

  for (var i = 0; i < options.length; i++) {
    var option = options[i]
    var title = NSMenuItem.alloc().initWithTitle_action_keyEquivalent(option["title"], nil, "")
    title.setEnabled(false)
    menu.addItem(title)

    option["values"].forEach(value => {
      var menuItem = NSMenuItem.alloc().initWithTitle_action_keyEquivalent(value, nil, "")
      menuItem.setEnabled(true)
      menuItem.setRepresentedObject(value)
      menuItem.setCOSJSTargetFunction(menuItemCallback)
      menu.addItem(menuItem)
    })

    if (i < options.length - 1) {
      menu.addItem(NSMenuItem.separatorItem())
    }
  }

  menu.setAutoenablesItems(false)
  order.setMenu(menu)
  order.selectItemAtIndex(defaults.exportOrder)
  // container.addSubview(order)

  y -= 23
  var artboardSubLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, y, 300, 46))
  artboardSubLabel.setBezeled(false)
  artboardSubLabel.setDrawsBackground(false)
  artboardSubLabel.setEditable(false)
  artboardSubLabel.setSelectable(false)
  artboardSubLabel.setStringValue("The artboard order is determined by preferences set in \nPreferences > General > Artboard Export") //"Select how Artboards will be ordered for the export."
  artboardSubLabel.setFont(NSFont.systemFontOfSize(10))
  container.addSubview(artboardSubLabel)

  y -= 30
  var exportAsImage = NSButton.alloc().initWithFrame(NSMakeRect(0, y, 300, 23))
	exportAsImage.setState(defaults.exportToImages)
	exportAsImage.setButtonType(NSSwitchButton)
  exportAsImage.setBezelStyle(0)
	exportAsImage.setTitle("Export as PNGs into PDF")
  container.addSubview(exportAsImage)

  y -= 28
  var pngSizeLabel = NSTextField.alloc().initWithFrame(NSMakeRect(19, y, 280, 23))
  pngSizeLabel.setBezeled(false)
  pngSizeLabel.setDrawsBackground(false)
  pngSizeLabel.setEditable(false)
  pngSizeLabel.setSelectable(false)
  pngSizeLabel.setStringValue("PNG export size")
  pngSizeLabel.setFont(NSFont.systemFontOfSize(10))
  container.addSubview(pngSizeLabel)

  y += 6
  var pngSizeTextField = NSTextField.alloc().initWithFrame(NSMakeRect(105, y, 70, 23))
	pngSizeTextField.setPlaceholderString("2x")
  pngSizeTextField.setStringValue("" + defaults.imageExportScale)
  container.addSubview(pngSizeTextField)

  var exportAsImageCallback = function(sender) {
    if (sender.state() == NSOffState) {
      pngSizeLabel.setTextColor(NSColor.disabledControlTextColor())
      pngSizeTextField.setTextColor(NSColor.disabledControlTextColor())
      pngSizeTextField.setEditable(false)
      alert.window().makeFirstResponder(nil)
    } else {
      pngSizeLabel.setTextColor(NSColor.controlTextColor())
      pngSizeTextField.setTextColor(NSColor.controlTextColor())
      pngSizeTextField.setEditable(true)
    }
  }

  exportAsImage.setCOSJSTargetFunction(exportAsImageCallback)
  exportAsImageCallback(exportAsImage)

  y -= 40
  var excludeWithPrefixButton = NSButton.alloc().initWithFrame(NSMakeRect(0, y, 300, 23))
  excludeWithPrefixButton.setState(defaults.excludeWithPrefix)
  excludeWithPrefixButton.setButtonType(NSSwitchButton)
  excludeWithPrefixButton.setBezelStyle(0)
  var excludeWithPrefixTitle = (exportOption == 'all-pages') ? "Ignore Artboards and Pages with prefix" : "Ignore Artboards with prefix"
  excludeWithPrefixButton.setTitle(excludeWithPrefixTitle)
  container.addSubview(excludeWithPrefixButton)

  y -= 28
  var prefixLabel = NSTextField.alloc().initWithFrame(NSMakeRect(19, y, 280, 23))
  prefixLabel.setBezeled(false)
  prefixLabel.setDrawsBackground(false)
  prefixLabel.setEditable(false)
  prefixLabel.setSelectable(false)
  prefixLabel.setStringValue("Prefix")
  prefixLabel.setFont(NSFont.systemFontOfSize(10))
  container.addSubview(prefixLabel)

  y += 6
  var prefixTextField = NSTextField.alloc().initWithFrame(NSMakeRect(55, y, 120, 23))
  prefixTextField.setPlaceholderString("-")
  prefixTextField.setStringValue(defaults.exclusionPrefix)
  container.addSubview(prefixTextField)

  var excludePrefixCallback = function(sender) {
    if (sender.state() == NSOffState) {
      prefixLabel.setTextColor(NSColor.disabledControlTextColor())
      prefixTextField.setTextColor(NSColor.disabledControlTextColor())
      prefixTextField.setEditable(false)
      alert.window().makeFirstResponder(nil)
    } else {
      prefixLabel.setTextColor(NSColor.controlTextColor())
      prefixTextField.setTextColor(NSColor.controlTextColor())
      prefixTextField.setEditable(true)
    }
  }

  excludeWithPrefixButton.setCOSJSTargetFunction(excludePrefixCallback)
  excludePrefixCallback(excludeWithPrefixButton)


  y -= 40
  var includeSymbols = NSButton.alloc().initWithFrame(NSMakeRect(0, y, 300, 23))
  includeSymbols.setState(defaults.includeSymbolArtboards)
  includeSymbols.setButtonType(NSSwitchButton)
  includeSymbols.setBezelStyle(0)
  includeSymbols.setTitle("Include 'Symbol Master' Artboards")
  container.addSubview(includeSymbols)

  if (alert.runModal() == '1000') {
    defaults = {
      exportToImages: exportAsImage.state(),
      excludeWithPrefix: excludeWithPrefixButton.state(),
      exclusionPrefix: prefixTextField.stringValue(),
      imageExportScale: pngSizeTextField.stringValue(),
      includeSymbolArtboards: includeSymbols.state(),
      exportOrder: order.indexOfSelectedItem()
    }
    saveDefaults()
    callback()
  }
}
