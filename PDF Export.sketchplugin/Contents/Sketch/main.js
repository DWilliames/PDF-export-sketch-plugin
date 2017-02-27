// https://developer.apple.com/reference/quartz/pdfdocument
// https://developer.apple.com/reference/quartz/pdfpage

var doc
var selection

function test(context) {
  doc = context.document
  selection = context.selection

  var saveLocation = promptSaveLocation("testing")
  print(saveLocation)

}

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


// Takes an array of artboards — and will return a PDF document
// 'Artboards' must be provided in the order they will be returned
function convertArtboardsToPDF(artboards) {

  // Let's create a new page — then add all the artboards to it
  var temporaryPage = MSPage.new()
  temporaryPage.setName("PDF Export")

  // Add the page to our document, temporarily (we'll remove it later)
  doc.documentData().addPage(temporaryPage)

}








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
