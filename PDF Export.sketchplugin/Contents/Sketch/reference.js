var app = [NSApplication sharedApplication];

function currentPageToPDF(context) {
	var doc = context.document;
	var page = doc.currentPage();
	var pageName = page.name();
	var pageArray = MSArray.dataArrayWithArray([page]);

	MSPDFBookExporter.exportPages_defaultFilename(pageArray, pageName +".pdf");
}

function allPagesToPDF(context) {
	var doc = context.document;
	doc.exportPDFBook(doc);
}

function selectedArtboardsToPDF(context){
	var doc = context.document;
	var page = doc.currentPage();
	var pageName = page.name();

	// Check document for selected artboards
	var selectionLayers = context.selection;

	var selectedArtboards = [];
	if (doc.hasArtboards() && selectionLayers){
		for (var i=0; i < selectionLayers.count(); i++){
			if (selectionLayers[i].className() == "MSArtboardGroup"){
				selectedArtboards.push(selectionLayers[i]);
			}
		}
	}

	if (selectedArtboards.length < 1){
		[app displayDialog:"Please select an artboard" withTitle:"We couldn't find any selected artboards"];
		return;
	}

	// Allow the user to specify filename and location to save
	var saveDialog = NSSavePanel.savePanel();
	[saveDialog setNameFieldStringValue:pageName];
	saveDialog.setAllowedFileTypes(["pdf"]);

	if(saveDialog.runModal() == NSOKButton) {
		var fileURL = saveDialog.URL();

		// sort artboards according to visual order
		var artboards = selectedArtboards.sort(sortVisualPosition);
		var selectedArtboardsCount = artboards.length;

		var pdf = PDFDocument.alloc().init();

		for (var i=0; i < selectedArtboardsCount; i++){
			var artboard = artboards[i];

	    	// To ensure that the filename will be safe
	    	var name = cleanString(artboard.name());

	    	// To avoid issues with artboards with the same name
	    	var artboardId = artboard.objectID();

	       	// It is quicker and a smaller filesize to export artboards as PDF rather than PNG.
	       	// However the quality of the PNG export is better.
	        var path = NSTemporaryDirectory() + artboardId + '/' + name + '.png';
	        doc.saveArtboardOrSlice_toFile(artboard,path);

	        var image = [[NSImage alloc] initByReferencingFile:path];
	        var page = [[PDFPage alloc] initWithImage:image];

	        [pdf insertPage:page atIndex:[pdf pageCount]];
		}

		[pdf writeToURL: fileURL];
	}
}

function cleanString(string){
	var notAllowedChars = [NSCharacterSet characterSetWithCharactersInString:@"\\<>=,!#$&'()*+/:;=?@[]%"];
	var cleanString = [[string componentsSeparatedByCharactersInSet:notAllowedChars] componentsJoinedByString:@""];
	return cleanString;
}

/*
* Sorts artboards from left to right and top to bottom if in same column
*/
function sortVisualPosition(a,b){
	var x = a.frame().left() - b.frame().left();
  	return x == 0? a.frame().top() - b.frame().top() : x;
}
