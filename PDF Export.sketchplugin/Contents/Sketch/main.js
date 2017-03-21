@import 'ui.js'
@import 'utilities.js'

// TODO: turn only layers with prefix into images

// Global initalised variables from 'context'
var selection, doc, scriptPath, scriptFolder, app
var manifestJSON, iconImage

function initialise(context) {
  selection = context.selection
  doc = context.document
  scriptPath = context.scriptPath
  scriptFolder = scriptPath.stringByDeletingLastPathComponent()
  app = NSApplication.sharedApplication()

  manifestJSON = getJSONFromFile(scriptFolder + "/manifest.json")
  iconImage = NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path())

  fetchDefaults()

  return !updateIfNeeded()
}


// ****************************
//         Handlers
// ****************************

function exportCurrentPage(context) {
  if (!initialise(context)) {
    return
  }
  var name = doc.currentPage().name()

  if (doc.currentPage().artboards().length == 0) {
    return alertNoArtboards("There are no Artboards on your page. Please create some Artboards to export.")
  }

  showOptionsWindow("current-page", name, function() {
    var temporaryPage = doc.currentPage().copy()
    exportPages([temporaryPage], name)
  })
}

function exportAllPages(context) {
  if (!initialise(context)) {
    return
  }

  // Make sure that there are artboards available to export
  var totalArtboards = 0
  doc.pages().forEach(function(page) {
    print('name: ' + page.name() + ', artboards = ' + page.artboards().length)
    totalArtboards += page.artboards().length
  })

  if (totalArtboards == 0) {
    return alertNoArtboards("There are no Artboards in your document. Please create some Artboards to export.")
  }

  var name = (sketchVersionNumber() >= 430) ? doc.cloudName() : doc.publisherFileName()
  showOptionsWindow("all-pages", name, function() {
    var pages = []
    doc.pages().forEach(function(page) {
      pages.push(page.copy())
    })
    exportPages(pages, name)
  })
}


function exportSelection(context) {
  if (!initialise(context)) {
    return
  }

  // If any of the selection is not an artboard — then return
  // Filter out the bad layers — only allow MSArtboardGroup or MSSymbolMaster
  var validLayers = selection.every(function(layer){
    return layer.isMemberOfClass(MSArtboardGroup) || layer.isMemberOfClass(MSSymbolMaster)
  })

  if (validLayers && selection.count() > 0) {
    var name = selection.firstObject().name()

    showOptionsWindow("selection", name, function() {
      var temporaryPage = MSPage.new()
      temporaryPage.setName(name)
      selection.forEach(function(layer) {
        temporaryPage.addLayer(layer)
      })
      exportPages([temporaryPage], name)
    })
  } else {
    alertNoArtboards("Only Artboards supported. Please select ONLY Artboards and try again.")
  }
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


// ****************************
//      Exporting Artboards
// ****************************

function exportPages(pages, outputName) {

  var layersToRemove = [] // For invalid layers/artboards
  var totalArtboards = 0 // Keep count of total valid artboards

  if (defaults.excludeWithPrefix) {
    pages = pages.filter(function(page){
      return !page.name().startsWith(defaults.exclusionPrefix)
    })
  }

  pages.forEach(function(page){
    // Ignore pages with the prefix
    if (defaults.excludeWithPrefix && page.name().startsWith(defaults.exclusionPrefix))
      return

    doc.documentData().addPage(page)

    page.layers().forEach(function(layer){

      if (!(layer.isMemberOfClass(MSSymbolMaster) || layer.isMemberOfClass(MSArtboardGroup))) {
        layersToRemove.push(layer)
        return
      }

      if (defaults.excludeWithPrefix && layer.name().startsWith(defaults.exclusionPrefix)) {
        layersToRemove.push(layer)
        return
      }

      if (defaults.includeSymbolArtboards && layer.isMemberOfClass(MSSymbolMaster)){
        layer = MSSymbolMaster.convertSymbolToArtboard(layer)
      }

      if (layer.isMemberOfClass(MSArtboardGroup)){
        totalArtboards++
      }

      layer.children().forEach(function(sublayer) {
        if (sublayer.isMemberOfClass(MSSymbolInstance)) {
          var symbolMaster = sublayer.symbolMaster()

          // Detatch the symbol from it's master
          var group = sublayer.detachByReplacingWithGroup()

          // If the symbol had a background colour — re-add it as a rectangle shape
          if (symbolMaster.hasBackgroundColor() && symbolMaster.includeBackgroundColorInExport() && symbolMaster.includeBackgroundColorInInstance()) {
            var shape = MSShapeGroup.shapeWithRect(group.bounds())
            var fill = shape.style().addStylePartOfType(0)
            fill.color = symbolMaster.backgroundColor()
            group.insertLayers_atIndex([shape], 0)
          }
        }
      })
    })
  })

  // If there's no artboards to export — exit
  if (totalArtboards == 0) {
    alertNoArtboards("Based on your preferences, there are no Artboards to export. Please change your settings or create some more Artboards then try again.")
    pages.forEach(function(page) {
      doc.documentData().removePage(page)
    })
    return
  }

  layersToRemove.forEach(function(layer) {
    layer.removeFromParent()
  })

  if (defaults.exportToImages) {
    // Ask the user where they want to save it
    var saveLocation = promptSaveLocation(outputName)
    if (saveLocation) {

      var filesToDelete = [] // For temporary images
      var pdf = PDFDocument.alloc().init()

      pages.forEach(function(page){
        var orderedArtboards = MSArtboardOrderSorting.sortArtboardsInDefaultOrder(page.artboards())
        orderedArtboards.forEach(function(artboard){
          if (!artboard.isMemberOfClass(MSArtboardGroup))
            return

          if (artboard.hasBackgroundColor() && artboard.includeBackgroundColorInExport()) {
            var shape = MSShapeGroup.shapeWithRect(artboard.bounds())
            var fill = shape.style().addStylePartOfType(0)
            fill.color = artboard.backgroundColor()
            artboard.insertLayers_atIndex([shape], 0)
          }

          // Create a temporary image of the artboard
          var random = NSUUID.UUID().UUIDString()
          var tempPath = NSTemporaryDirectory() + artboard.objectID() + ' ' + random + '.png'
          // doc.saveArtboardOrSlice_toFile(tempSlice, tempPath)
          filesToDelete.push(tempPath)

          var exportScale = defaults.imageExportScale.replace(/\s/g, '') // remove spaces
          if (exportScale.slice(-1) == 'h') { // Height
            exportScale = parseInt(exportScale.slice(0, -1)) / artboard.frame().height()
          } else if (exportScale.slice(-1) == 'w') { // Width
            exportScale = parseInt(exportScale.slice(0, -1)) / artboard.frame().width()
          } else {
            exportScale = parseInt(exportScale)
          }

          artboard.exportOptions().addExportFormat()
          var exportSize = artboard.exportOptions().exportFormats().lastObject()
          exportSize.scale = exportScale
          exportSize.name = ''
          exportSize.format = 'png'

          var rect = artboard.absoluteRect().rect()
          var slice = MSExportRequest.exportRequestFromExportFormat_layer_inRect_useIDForName(exportSize, artboard, rect, false)
          doc.saveArtboardOrSlice_toFile(slice, tempPath)

          // Add the image as a page to our PDF
          var image = NSImage.alloc().initByReferencingFile(tempPath)
          var pdfPage = PDFPage.alloc().initWithImage(image)
          pdf.insertPage_atIndex(pdfPage, pdf.pageCount())

        })
      })

      // Save the whole PDF document — to the location the user specified
      pdf.writeToURL(saveLocation)

      // Delete each of the temporary images we created for the artboards
      filesToDelete.forEach(function(file){
        NSFileManager.defaultManager().removeItemAtPath_error(file, nil)
      })
    }

  } else {
    MSPDFBookExporter.exportPages_defaultFilename(pages, outputName)
  }

  pages.forEach(function(page) {
    doc.documentData().removePage(page)
  })
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
