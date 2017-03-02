@import 'MochaJSDelegate.js'

// TODO: iconImage

var itemRect = NSMakeRect(0, 0, 300, 23)

function showOptionsWindow() {

  // Dropdown list: Artboard order ('left to right then top to bottom', 'top to bottom then left to right')
      // Checkbox: Reverse (false)
  // xxx Checkbox: Include symbol master artboards (false)
  // Checkbox: Export as images into PDF (false)
      // Text field: Image size (2x)
  // Checkbox: Exclude artboards and pages with prefix (true) TODO: Update copy based on if exporting whole doc
      // Text field: Prefix ('-')

  // Button: Info button?? Donate / support


  var alert = createAlert("Export all pages to PDF", "Export all 11 pages from 'Document name' into a single PDF document", "Export", "Cancel")

  var order = addComboBoxToAlert(alert, ["Test 1", "Test 2", "Test 3"])
  var reverseOrder = addCheckboxToAlert(alert, "Reverse order")

  var symbolArtboards = addCheckboxToAlert(alert, "Include symbol master artboards")

  var exportAsImages = addCheckboxToAlert(alert, "Export as PNGs into PDF")
  var imageSize = addTextFieldToAlert(alert, "Size")

  var excludeWithPrefix = addCheckboxToAlert(alert, "Exclude artboards and pages with prefix")
  var prefix = addTextFieldToAlert(alert, "Prefix")


  var dropdown = NSPopUpButton.alloc().initWithFrame(itemRect)
  dropdown.setNeedsDisplay()

  var menu = NSMenu.alloc().init()

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

  // var options = ["Left to right", "Top to bottom", "Layer list", "-", "Reversed - Left to right", "Reversed - Top to bottom", "Reversed - Layer list"]

  var menuItemCallback = function(menuItem) {
    order.setEnabled(menuItem.representedObject() == '1')
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


    // if (options[option] == '-') {
    //   menu.addItem(NSMenuItem.separatorItem())
    // } else {
    //   var menuItem = NSMenuItem.alloc().initWithTitle_action_keyEquivalent(options[option], nil, "")
    //   menuItem.setEnabled(true)
    //   menuItem.setRepresentedObject(options[option])
    //   menuItem.setCOSJSTargetFunction(menuItemCallback)
    //   menu.addItem(menuItem)
    // }
  }

  menu.setAutoenablesItems(false)
  dropdown.setMenu(menu)

  alert.addAccessoryView(dropdown)

  if (alert.runModal() == NSOKButton) {
    // Accepted
  }
}

function createAlert(message, info, primaryButtonText, secondaryButtonText) {
  var alert = COSAlertWindow.new()
  if (iconImage) {
    alert.setIcon(iconImage)
  }
	alert.setMessageText(message)
	alert.setInformativeText(info)
	if (primaryButtonText) {
		alert.addButtonWithTitle(primaryButtonText)
	}
	if (secondaryButtonText) {
		alert.addButtonWithTitle(secondaryButtonText)
	}
	return alert
}

function addCheckboxToAlert(alertWindow, label) {
  var checkbox = NSButton.alloc().initWithFrame(itemRect)
	checkbox.setState(NSOffState)
	checkbox.setButtonType(NSSwitchButton)
  checkbox.setBezelStyle(0)
	checkbox.setTitle(label)
  alertWindow.addAccessoryView(checkbox)
  return checkbox
}

function addTextFieldToAlert(alertWindow, placeholder) {
  var textField = NSTextField.alloc().initWithFrame(itemRect)
	textField.setPlaceholderString(placeholder)
	alertWindow.addAccessoryView(textField)
  return textField
}

function addComboBoxToAlert(alertWindow, values) {
  var comboBox = NSComboBox.alloc().initWithFrame(itemRect)
  comboBox.addItemsWithObjectValues(values)
  alertWindow.addAccessoryView(comboBox)
  return comboBox
}
