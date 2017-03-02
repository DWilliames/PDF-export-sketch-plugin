@import 'MochaJSDelegate.js'
@import 'defaults.js'

// preferences
// var exportToImages = valueForKey(keys.exportToImages)
// var excludeWithPrefix = valueForKey(keys.excludeWithPrefix)
// var exclusionPrefix = valueForKey(keys.exclusionPrefix)
// var imageExportScale = valueForKey(keys.imageExportScale)
var order = 'left-right-top-bottom'

// TODO: Save order

// NSUserDefaults.standardUserDefaults().setBool_forKey(false, keys.exportToImages)
// NSUserDefaults.standardUserDefaults().setObject_forKey('2x', keys.imageExportScale)
// NSUserDefaults.standardUserDefaults().setBool_forKey(true, keys.excludeWithPrefix)
// NSUserDefaults.standardUserDefaults().setObject_forKey('-', keys.exclusionPrefix)
// NSUserDefaults.standardUserDefaults().synchronize()

var exportToImages =  NSUserDefaults.standardUserDefaults().boolForKey(keys.exportToImages)
var excludeWithPrefix =  NSUserDefaults.standardUserDefaults().boolForKey(keys.excludeWithPrefix)
var exclusionPrefix =  NSUserDefaults.standardUserDefaults().stringForKey(keys.exclusionPrefix)
var imageExportScale =  NSUserDefaults.standardUserDefaults().stringForKey(keys.imageExportScale)
var includeSymbolArtboards = NSUserDefaults.standardUserDefaults().boolForKey(keys.includeSymbolArtboards)

if (exportToImages == null) exportToImages = defaults[keys.exportToImages]
if (excludeWithPrefix == null) excludeWithPrefix = defaults[keys.excludeWithPrefix]
if (exclusionPrefix == null) exclusionPrefix = defaults[keys.exclusionPrefix]
if (imageExportScale == null) imageExportScale = defaults[keys.imageExportScale]
if (includeSymbolArtboards == null) includeSymbolArtboards = defaults[keys.includeSymbolArtboards]

function showOptionsWindow(exportOption, callback) {

  var title = ""
  var message = ""

  switch (exportOption) {
    case "all-pages":
      title = "Export all pages to PDF"
      message = "Export all " + doc.pages().length + " pages from '" + doc.publisherFileName() + "' into a single PDF document"
      break
    case "current-page":
      title = "Export current page to PDF"
      message = "Export Artboards from '" + doc.currentPage().name() + "' into a single PDF document"
      break
    case "selection":
      title = "Export selection to PDF"
      message = "Export selected Artboards into a single PDF document"
      break
    default:

  }

  // Dropdown list: Artboard order ('left to right then top to bottom', 'top to bottom then left to right')
      // Checkbox: Reverse (false)
  // xxx Checkbox: Include symbol master artboards (false)
  // Checkbox: Export as images into PDF (false)
      // Text field: Image size (2x)
  // Checkbox: Exclude artboards and pages with prefix (true) TODO: Update copy based on if exporting whole doc
      // Text field: Prefix ('-')

  // Button: Info button?? Donate / support

  var alert = NSAlert.alloc().init()
  alert.setIcon(iconImage)
	alert.setMessageText(title)
	alert.setInformativeText(message)
	alert.addButtonWithTitle("Export")
	alert.addButtonWithTitle("Cancel")

  var y = 260
  var container = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, y))
  alert.setAccessoryView(container)

  y -= 40
  var artboardLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, y, 300, 20))
  artboardLabel.setBezeled(false)
  artboardLabel.setDrawsBackground(false)
  artboardLabel.setEditable(false)
  artboardLabel.setSelectable(false)
  artboardLabel.setStringValue("Artboard Order")
  artboardLabel.setFont(NSFont.paletteFontOfSize(NSFont.systemFontSize()))
  container.addSubview(artboardLabel)

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
    print("item selected: " + menuItem.representedObject())
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
  order.selectItemAtIndex(1)
  container.addSubview(order)

  y -= 23
  var artboardSubLabel = NSTextField.alloc().initWithFrame(NSMakeRect(0, y, 300, 23))
  artboardSubLabel.setBezeled(false)
  artboardSubLabel.setDrawsBackground(false)
  artboardSubLabel.setEditable(false)
  artboardSubLabel.setSelectable(false)
  artboardSubLabel.setStringValue("Select how Artboards will be ordered for the export.")
  artboardSubLabel.setFont(NSFont.systemFontOfSize(10))
  container.addSubview(artboardSubLabel)

  y -= 40
  var exportAsImage = NSButton.alloc().initWithFrame(NSMakeRect(0, y, 300, 23))
	exportAsImage.setState(exportToImages)
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
  var pngSizeTextField = NSTextField.alloc().initWithFrame(NSMakeRect(105, y, 50, 23))
	pngSizeTextField.setPlaceholderString("2x")
  pngSizeTextField.setStringValue("" + imageExportScale)
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
  excludeWithPrefixButton.setState(excludeWithPrefix)
  excludeWithPrefixButton.setButtonType(NSSwitchButton)
  excludeWithPrefixButton.setBezelStyle(0)
  excludeWithPrefixButton.setTitle("Ignore Artboards and Pages with prefix")
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
  var prefixTextField = NSTextField.alloc().initWithFrame(NSMakeRect(55, y, 100, 23))
  prefixTextField.setPlaceholderString("-")
  prefixTextField.setStringValue(exclusionPrefix)
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
  includeSymbols.setState(includeSymbolArtboards)
  includeSymbols.setButtonType(NSSwitchButton)
  includeSymbols.setBezelStyle(0)
  includeSymbols.setTitle("Include 'Symbol Master' Artboards")
  container.addSubview(includeSymbols)

  if (alert.runModal() == '1000') {
    // Accepted

    print("exportToImages: " + exportAsImage.state())
    print("imageExportScale: " + pngSizeTextField.stringValue())
    print("excludeWithPrefix: " + excludeWithPrefixButton.state())
    print("exclusionPrefix: " + prefixTextField.stringValue())

    NSUserDefaults.standardUserDefaults().setBool_forKey(exportAsImage.state(), keys.exportToImages)
    NSUserDefaults.standardUserDefaults().setObject_forKey(pngSizeTextField.stringValue(), keys.imageExportScale)
    NSUserDefaults.standardUserDefaults().setBool_forKey(excludeWithPrefixButton.state(), keys.excludeWithPrefix)
    NSUserDefaults.standardUserDefaults().setObject_forKey(prefixTextField.stringValue(), keys.exclusionPrefix)
    NSUserDefaults.standardUserDefaults().setBool_forKey(includeSymbols.state(), keys.includeSymbolArtboards)
    NSUserDefaults.standardUserDefaults().synchronize()

    // Save states for next time
    // saveValueForKey(keys.exportToImages, exportAsImage.state() != NSOffState)
    // saveValueForKey(keys.imageExportScale, pngSizeTextField.stringValue())
    // saveValueForKey(keys.excludeWithPrefix, excludeWithPrefix.state() != NSOffState)
    // saveValueForKey(keys.exclusionPrefix, prefixTextField.stringValue())
    print('accepted')
    callback()
  } else {
    print('cancelled')
  }
}
