@import 'ui.js'

// TODO: Figure out how to do custom sorting
// TODO: Nested symbols
// TODO: Sorting
// TODO: GUI - settings/preferences

/*

SETTINGS:
* artboards (all pages, current page, or selection)
* order (left to right/top to bottom, top to bottom/left to right, layer list, layerlist reversed, selection order)
* Include/ignore symbols
* Export as images vs native PDF
* Export image size - 1x, 2x, 3x
* Exclude artboards with prefix

*/

// Global initalised variables from 'context'
var doc
var selection
var iconImage

function initialise(context) {
  doc = context.document
  selection = context.selection
  iconImage = NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path())
}

// ****************************
//         Handlers
// ****************************

function exportCurrentPage(context) {
  initialise(context)
  showOptionsWindow("current-page", () => {
    print("will export")
    exportArtboards(doc.currentPage().artboards(), doc.currentPage().name())
  })
}

function exportAllPages(context) {
  initialise(context)

  showOptionsWindow("all-pages", () => {
    var artboards = []
    doc.pages().forEach(page => {
      // Ignore pages with the prefix
      if (excludeWithPrefix && page.name().startsWith(exclusionPrefix))
        return

      page.artboards().forEach(artboard => {
        print(artboard.name())
        artboards.push(artboard)
      })
    })

    exportArtboards(artboards, doc.publisherFileName())
  })
}


function exportSelection(context) {
  initialise(context)

  // If any of the selection is not an artboard — then return
  // Filter out the bad layers — only allow MSArtboardGroup or MSSymbolMaster
  var validLayers = true
  selection.forEach(layer => {
    if (!(layer.isMemberOfClass(MSArtboardGroup) || layer.isMemberOfClass(MSSymbolMaster))) {
      validLayers = false
      return
    }
  })

  if (validLayers && selection.count() > 0) {
    showOptionsWindow("selection", () => {
      exportArtboards(selection, selection.firstObject().name())
    })
  } else {
    var alert = NSAlert.alloc().init()
    alert.setIcon(iconImage)
    alert.setMessageText("PDF Export Artboards")
    alert.setInformativeText("Only artboards are allowed to be selected in order to proceed")
    alert.addButtonWithTitle("Got it")
    alert.runModal()
  }

}


// ****************************
//      Organising Artboards
// ****************************

// Export the given artboards — based on the user's preferences
// This includes exporting as images, and the order the artboards are sorted
function exportArtboards(artboards, outputName) {
  // Collate them into a single page
  collateArtboardsIntoPage(artboards, outputName, collatedPage => {
    if (exportToImages) {
      exportPageToImagesToPDF(collatedPage)
    } else {
      exportPageToPDF(collatedPage)
    }
  })
}

// Takes an array of artboards — and will return a single page with them all on it
// The artboards will be sorted according to the specified settings
// 'callback' will return the page, containing a collation of the artboards
function collateArtboardsIntoPage(artboards, outputName, callback) {
  print("collate")
  // Let's create a new page
  var temporaryPage = MSPage.new()
  // TODO: Add some more smarts around what the name is
  var name = NSUUID.UUID().UUIDString()
  name = cleanString(outputName)
  temporaryPage.setName(name)

  // Add the page to our document, temporarily (we'll remove it later)
  doc.documentData().addPage(temporaryPage)

  print("will exclude")
  // Filter artboards if necessary
  if (excludeWithPrefix) {
    print("should exclude")
    artboards = filter(artboards, artboard => {

      print("exlusion: " + exclusionPrefix)
      print(exclusionPrefix.class())
      return !artboard.name().startsWith(exclusionPrefix)
    })
  }

  // Sort the artboards — either by visual location, layer list order, or selection order
  // print(order)
  // switch (order) {
  //   case 'left-right-top-bottom':
  //     print('sort: lrtb')
  //     artboards = artboards.sort((a, b) => {
  //       return a.frame().top() < b.frame().top()
  //     }).sort((a, b) => {
  //       return a.frame().left() < b.frame().left()
  //     })
  //     // artboards = artboards.sort(sortLeftRightTopBottom)
  //     break
  //   case 'top-bottom-left-right':
  //     print('sort: tblr')
  //     artboards = artboards.sort(sortTopBottomLeftRight)
  //     break
  //   default: break
  // }

  var pageLayoutData = {}
  /* format
  {
    [pageId]: { maxX: 0, minX: 0, maxY: 0, minY: 0 }
  }
  */

  // Let's ge the maximum and minimum x and y values for all the artboards in each page
  artboards.forEach(artboard => {
    var pageID = artboard.parentPage().objectID()
    print(artboard.name())
    print("x: " + artboard.frame().left() + ", y: " + artboard.frame().top())
    print(artboard.absoluteRect())
    // If the key doesn't exist
    if (!(pageID in pageLayoutData)) {
      pageLayoutData[pageID] = { maxX: null, maxY: null, minX: null, minY: null }
    }
    // Set the max and min values
    var maxX = artboard.frame().left() + artboard.frame().width()
    if (maxX > pageLayoutData[pageID].maxX || pageLayoutData[pageID].maxX == null) {
      pageLayoutData[pageID].maxX = maxX
    }
    var minX = artboard.frame().left()
    if (minX < pageLayoutData[pageID].minX || pageLayoutData[pageID].minX == null) {
      pageLayoutData[pageID].minX = minX
    }

    var maxY = artboard.frame().top() + artboard.frame().height()
    if (maxY > pageLayoutData[pageID].maxY || pageLayoutData[pageID].maxY == null) {
      pageLayoutData[pageID].maxY = maxY
    }
    var minY = artboard.frame().top()
    if (minY < pageLayoutData[pageID].minY || pageLayoutData[pageID].minY == null) {
      pageLayoutData[pageID].minY = minY
    }
  })

  print(pageLayoutData)

  // Add all the artboards to the page

  var previousPage = ''
  var currentPage = ''
  var xOffset = 0
  var yOffset = 0

  artboards.forEach(artboard => {
    let copy = artboard.copy()

    var pageID = artboard.parentPage().objectID()

    if (currentPage != pageID) {
      previousPage = currentPage
      currentPage = pageID

      if (previousPage != '') {
        print("previous")
        var previousPageLayout = pageLayoutData[previousPage]
        xOffset += (previousPageLayout.maxX + 1)
        yOffset += (previousPageLayout.maxY + 1)

        print("X: " + xOffset)
        print("Y: " + xOffset)
      }
    }

    // If the layer is a MSSymbolMaster — convert it to an artboard
    if (copy.isMemberOfClass(MSSymbolMaster)) {
      copy = MSSymbolMaster.convertSymbolToArtboard(copy)
    }

    if (copy.isMemberOfClass(MSSymbolInstance)) {
      findAndDetachFromSymbol(copy)
    }

    function findAndDetachFromSymbol(layer) {
      if (layer.isMemberOfClass(MSSymbolInstance)) {
        layer = layer.detachByReplacingWithGroup()
        layer.children().forEach(innerLayer => {
          findAndDetachFromSymbol(innerLayer)
        })
      }
    }

    if (copy.isMemberOfClass(MSArtboardGroup)) {
      var x = copy.frame().left() + xOffset - pageLayoutData[currentPage].minX
      var y = copy.frame().top() + yOffset - pageLayoutData[currentPage].minY
      print("Offset — x: " + x + ", y: " + y)
      copy.frame().setX(x)
      copy.frame().setY(y)
    }

    temporaryPage.addLayer(copy)
  })


  //
  // var x = 0
  // var currentPage = nil
  //
  // temporaryPage.children().forEach(pageLayer => {
  //   // Detatch any instances of symbols (including any sub-symbols)
  //   if (pageLayer.isMemberOfClass(MSSymbolInstance)) {
  //     findAndDetachFromSymbol(pageLayer)
  //   }
  //   // Lay them out nicely (without overlap)
  //   if (pageLayer.isMemberOfClass(MSArtboardGroup)) {
  //     pageLayer.frame().setX(x)
  //     pageLayer.frame().setY(0)
  //     x += (pageLayer.frame().width() + 1)
  //   }
  // })
  //
  // function findAndDetachFromSymbol(layer) {
  //   if (layer.isMemberOfClass(MSSymbolInstance)) {
  //     layer = layer.detachByReplacingWithGroup()
  //     layer.children().forEach(innerLayer => {
  //       findAndDetachFromSymbol(innerLayer)
  //     })
  //   }
  // }

  // Return the page pack to the callback
  callback(temporaryPage)

  // Remove the temporary page now that we are done with it
  // doc.documentData().removePage(temporaryPage)
}


// ****************************
//      Sorting
// ****************************

function sortLeftRightTopBottom(a, b){
	var x = a.frame().left() - b.frame().left()
  return x == 0 ? a.frame().top() - b.frame().top() : x
}

function sortTopBottomLeftRight(a, b){
	var x = a.frame().top() - b.frame().top()
  return x == 0 ? a.frame().left() - b.frame().left() : x
}


// ****************************
//      PDF Exporting
// ****************************

// Export page by the built-in exporter
// This also automatically asks the user where they want to save it
function exportPageToPDF(page) {
  print("export page to PDF")
  // Export the temporary page to the PDF
  // var artboard = page.artboards().firstObject()
  // MSPDFBookExporter.pdfFromArtboard(artboard)
  MSPDFBookExporter.exportPages_defaultFilename([page], page.name())
}

// Allow exporting PDFs as images
function exportPageToImagesToPDF(page) {

  // Ask the user where they want to save it
  var fileURL = promptSaveLocation(page.name())
  if (!fileURL) return // If they cancel — return

  // Create a new PDF document
  var pdf = PDFDocument.alloc().init()
  // Let's keep a reference to all the temporary images we create to build up our PDF
  // So that we can delete them later
  var filePaths = []

  // For each artboard, turn it into an image and add that to our PDF
  page.children().forEach(artboard => {
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
    filePaths.push(tempPath)

    // [[layer exportOptions] addExportFormat]
    artboard.exportOptions().addExportFormat()
    var exportSize = artboard.exportOptions().exportFormats().lastObject() //[[[layer exportOptions] exportFormats] lastObject]
    exportSize.scale = 2//imageExportScale
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

  // Save the whole PDF document — to the location the user specified
  pdf.writeToURL(fileURL)

  // Delete each of the temporary images we created for the artboards
  filePaths.forEach(filePath => {
    NSFileManager.defaultManager().removeItemAtPath_error(filePath, nil)
  })
}


// ****************************
//      Helper functions
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

// Given an array, an a 'condition' function, that returns a boolean
// The condition should return true if it should keep the element in the array
// Will return the array filtered
function filter(array, condition) {
  var filteredArray = []
  array.forEach(e => {
    if (condition(e))
      filteredArray.push(e)
  })
  return filteredArray
}

function cleanString(string){
  return string
  // TODO: Figure out if this is necessary
  var notAllowedChars = NSCharacterSet.characterSetWithCharactersInString("\\<>=,!#$&'()*+/:;=?@[]%")
  return string.componentsSeparatedByCharactersInSet(notAllowedChars).componentsJoinedByString('')
}

//
// function findAndDetachFromSymbol(layer) {
//   print("Checking layer: " + layer.name())
//   if (layer.isMemberOfClass(MSSymbolInstance.class())) {
//     layer = layer.detachByReplacingWithGroup()
//   } else if (layer.isMemberOfClass(MSLayerGroup.class())){
//     print("check children")
//     print(layer.children())
//     // layer.children().forEach(child => findAndDetachFromSymbol(child))
//   }
// }







/*


function currentPageToPDF(context) {
    pageToPDF(context.document.currentPage())
}

function selectedArtboardsToPDF(context) {
    var doc = context.document
    var selection = context.selection

    if (selection.count() <= 0) {
        print(selection)
        document.showMessage("Please select any artboards to proceed")
        return
    }

    var tempPage = MSPage.new()
    doc.documentData().addPage(tempPage)
    tempPage.setName("PDF Export")

    var selectionLoop = selection.objectEnumerator()
    var selectedArtboards = NSMutableArray.array()
    while (layer = selectionLoop.nextObject()) {
        if (layer.isMemberOfClass(MSArtboardGroup)) {
            selectedArtboards.addObject(layer.copy())
        } else if (layer.isMemberOfClass(MSSymbolMaster)) {
            var layerCopy = MSSymbolMaster.convertSymbolToArtboard(layer.copy())
            selectedArtboards.addObject(layerCopy)
        } else {
            doc.showMessage("Only artboards allowed to proceed PDF export")
            return
        }
    }
    tempPage.addLayers(selectedArtboards)

    var pageChildrenLoop = tempPage.children().objectEnumerator()
    while (pageLayer = pageChildrenLoop.nextObject()) {
        if (pageLayer.isMemberOfClass(MSSymbolInstance)) {
            findAndDetachFromSymbol(pageLayer)
        }
    }
    function findAndDetachFromSymbol(layer) {
        if (layer.isMemberOfClass(MSSymbolInstance)) {
            layer = layer.detachByReplacingWithGroup()
            var layerChildrenLoop = layer.children().objectEnumerator()
            while (innerLayer = layerChildrenLoop.nextObject()) {
                findAndDetachFromSymbol(innerLayer)
            }
        }
    }

    pageToPDF(tempPage)
    doc.documentData().removePage(tempPage)
}

function allPagesToPDF(context) {
	var doc = context.document
	doc.exportPDFBook(doc)
}

function pageToPDF(page) {
    var pageArray = [page]
    MSPDFBookExporter.exportPages_defaultFilename(pageArray, page.name() + ".pdf")
}
*/
