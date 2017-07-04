@import 'ui.js'

// TODO: turn only layers with prefix into images
// TODO: nested artboards (overlapping artboards) – ignore inner ones
// TODO: Add outline option for nested/overlapping artboards

// Global initalised variables from 'context'
var selection, doc, scriptPath, scriptFolder, app
var manifestJSON, iconImage

function onSetUp(context) {
  selection = context.selection
  doc = context.document
  scriptPath = context.scriptPath
  scriptFolder = scriptPath.stringByDeletingLastPathComponent()
  app = NSApplication.sharedApplication()

  manifestJSON = getJSONFromFile(scriptFolder + "/manifest.json")
  iconImage = NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path())

  fetchDefaults()
}


// ****************************
//         Handlers
// ****************************

function exportCurrentPage(context) {
  exportForOption(exportOptions.currentPage)
}

function exportAllPages(context) {
  exportForOption(exportOptions.allPages)
}

function exportSelection(context) {
  exportForOption(exportOptions.selection)
}


// ****************************
//      Exporting Artboards
// ****************************

function exportForOption(exportOption) {

  var artboards = exportableArtboards(exportOption)

  if (artboards.length == 0) {
    alertNoArtboards(noArtboardsAlertMessage(exportOption))
    return
  }

  var outputName = getOutputName(exportOption, artboards)

  showOptionsWindow(exportOption, outputName, function() {
    // Now that the user's preferences have been set, the ordering may need to change
    var orderedArtboards = exportableArtboards(exportOption)

    var filteredArtboards = filterArtboards(orderedArtboards)
    if (filteredArtboards.length == 0) {
      alertNoArtboards("Based on your preferences, there are no Artboards to export. Please change your settings or create some more Artboards then try again.")
      return
    }

    outputName = getOutputName(exportOption, filteredArtboards)
    exportArtboards(filteredArtboards, outputName)
  })

}


// Return all the artboards to be exported
// Export Option = 'all-pages', 'current-page' or 'selection'
function exportableArtboards(exportOption) {

  var artboards = []

  switch (exportOption) {
    case exportOptions.allPages:
      doc.pages().forEach(function(page) {
        var sortedPageArtboards = MSArtboardOrderSorting.sortArtboardsInDefaultOrder(page.artboards())
        sortedPageArtboards.forEach(function(artboard) {
          artboards.push(artboard)
        })
      })
      break
    case exportOptions.currentPage:
      var sortedPageArtboards = MSArtboardOrderSorting.sortArtboardsInDefaultOrder(doc.currentPage().artboards())
      artboards = sortedPageArtboards
      break
    case exportOptions.selection:
      var selectedArtboards = []
      selection.forEach(function(selectedLayer) {
        if (selectedLayer.isMemberOfClass(MSArtboardGroup) || selectedLayer.isMemberOfClass(MSSymbolMaster)) {
          selectedArtboards.push(selectedLayer)
        }
      })
      artboards = MSArtboardOrderSorting.sortArtboardsInDefaultOrder(selectedArtboards)
      break
    default:
  }

  return artboards
}


// Return the appropriate alert message for when there is no artboards
function noArtboardsAlertMessage(exportOption) {
  switch (exportOption) {
    case exportOptions.allPages:
      return "There are no Artboards in your document. Please create some Artboards to export."
    case exportOptions.currentPage:
      return "There are no Artboards on your page. Please create some Artboards to export."
    case exportOptions.selection:
      return "Only Artboards supported. Please select ONLY Artboards and try again."
    default:
  }

  return ""
}


// Get the default output name
function getOutputName(exportOption, artboards) {
  switch (exportOption) {
    case exportOptions.allPages:
      return (sketchVersionNumber() >= 430) ? doc.cloudName() : doc.publisherFileName()
    case exportOptions.currentPage:
      return doc.currentPage().name()
    case exportOptions.selection:
      return artboards.length > 0 ? artboards[0].name() : ""
    default:
  }
  return ""
}


// Filter out irrelevant artboards (e.g. with prefix, or is a symbol)
// Order the artboards correctly
function filterArtboards(artboards) {

  var filteredArtboards = []
  artboards.forEach(function(artboard) {

    // Omit artboards with prefix – when the option has been selected
    if (defaults.excludeWithPrefix && artboard.name().startsWith(defaults.exclusionPrefix)) {
      return
    }

    // Include Symbols, if the option has been selected
    if (defaults.includeSymbolArtboards && artboard.isMemberOfClass(MSSymbolMaster)) {
      filteredArtboards.push(artboard)
      return
    }

    // Only allow actual Artboards
    if (artboard.isMemberOfClass(MSArtboardGroup)) {
      filteredArtboards.push(artboard)
    }
  })

  return filteredArtboards
}


// Export the artboards with a speicifed default filename, 'outputName'
function exportArtboards(artboards, outputName) {

  var saveLocation = promptSaveLocation(outputName)
  if (!saveLocation) return

  var pdf = PDFDocument.alloc().init()
  var filesToDelete = []

  artboards.forEach(function(artboard) {

    if (defaults.exportToImages) {
      // Create a temporary image of the artboard
      var random = NSUUID.UUID().UUIDString()
      var imagePath = NSTemporaryDirectory() + artboard.objectID() + ' ' + random + '.png'

      // Create a new temporary export option
      artboard.exportOptions().addExportFormat()
      var newExportFormat = artboard.exportOptions().exportFormats().lastObject()
      newExportFormat.scale = exportScale(artboard.frame())
      newExportFormat.name = ''
      newExportFormat.format = 'png'

      var rect = artboard.absoluteRect().rect()
      var slice = MSExportRequest.exportRequestFromExportFormat_layer_inRect_useIDForName(newExportFormat, artboard, rect, false)
      doc.saveArtboardOrSlice_toFile(slice, imagePath)
      filesToDelete.push(imagePath)

      artboard.exportOptions().removeExportFormat(newExportFormat)

      // Add the image as a page to our PDF
      var image = NSImage.alloc().initByReferencingFile(imagePath)
      var artboardPDF = PDFPage.alloc().initWithImage(image)

      pdf.insertPage_atIndex(artboardPDF, pdf.pageCount())
    } else {
      var artboardPDF = MSPDFBookExporter.pdfFromArtboard(artboard)
      pdf.insertPage_atIndex(artboardPDF, pdf.pageCount())
    }
  })

  // Save the whole PDF document — to the location the user specified
  pdf.writeToURL(saveLocation)

  filesToDelete.forEach(function(file) {
    NSFileManager.defaultManager().removeItemAtPath_error(file, nil)
  })
}


// Return the export scale, based on the user's preferences
// Taking into account the frame of an artboard
function exportScale(frame) {
  var exportScale = defaults.imageExportScale.replace(/\s/g, '') // remove spaces
  if (exportScale.slice(-1) == 'h') { // Height
    exportScale = parseInt(exportScale.slice(0, -1)) / frame.height()
  } else if (exportScale.slice(-1) == 'w') { // Width
    exportScale = parseInt(exportScale.slice(0, -1)) / frame.width()
  } else {
    exportScale = parseInt(exportScale)
  }

  return exportScale
}


// ****************************
//     Helper Methods
// ****************************

// Present a dialog to prompt the user to select the location to save the file
// 'filename' is the placeholder file name for the prompt
function promptSaveLocation(fileName) {

  var saveDialog = NSSavePanel.savePanel()
  saveDialog.setNameFieldStringValue(fileName)
  saveDialog.setAllowedFileTypes(["pdf"])

  // If the users selects 'OK', return the location they specified
  if (saveDialog.runModal() == NSOKButton)
    return saveDialog.URL()
  // Otherwise return nothing
  return nil
}


// Show an alert when there are no Artboards
function alertNoArtboards(message) {
  var alert = NSAlert.alloc().init()
  alert.setIcon(iconImage)
  alert.setMessageText("PDF Export — No Artboards")
  alert.setInformativeText(message)
  alert.addButtonWithTitle("Got it")
  return alert.runModal()
}


// Return the version number for sketch — turned into a single integer
// e.g. '3.8.5' => 385, '40.2' => 402
function sketchVersionNumber() {
  var version = NSBundle.mainBundle().objectForInfoDictionaryKey("CFBundleShortVersionString")
  var versionNumber = version.stringByReplacingOccurrencesOfString_withString(".", "") + ""
  while(versionNumber.length != 3) {
    versionNumber += "0"
  }
  return parseInt(versionNumber)
}

// Return a JSON object from a file path
function getJSONFromFile(filePath) {
  var data = NSData.dataWithContentsOfFile(filePath)
  return NSJSONSerialization.JSONObjectWithData_options_error(data, 0, nil)
}
