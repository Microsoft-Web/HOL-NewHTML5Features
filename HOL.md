#New HTML5 Features#

## Overview ##

HTML5 is the emerging standard for building and writing HTML webpages for web sites and applications. HTML5 includes many new JavaScript APIs, providing features that could not previously be developed using JavaScript.

Support for HTML5 began in Internet Explorer 8 with features such as Web Storage. Under Internet Explorer 10, support for HTML5 was vastly expanded, with JavaScript APIs such as Web Sockets, Web Workers, and Application Cache.

This lab demonstrates the use of three major HTML5 JavaScript APIs that are supported in Internet Explorer 10: the **Drag-and-Drop API**, the **File API**, and the **Web Workers API**. 

The HTML5 drag-and-drop functionality enables users to drag elements on the screen and drop them onto other elements. This functionality is achieved through special attributes on draggable HTML elements and through the use of event handlers.

The HTML5 File functionality allows web developers to read and manipulate files by using objects such as **FileReader**, **Blob**, and **BlobBuilder**. Using the File API, web developers can access files on the client’s machine if the user provides permission to do so.

The HTML5 Web Workers functionality enables web developers to run tasks in the background without blocking the JavaScript UI thread.

During this lab, you will create two JavaScript objects (**DragAndDropManager** and **BackgroundFileManager**) that will be used to integrate the Drag-and-Drop API and the File API into the FacePlace application. In addition, you will add Web Workers functionality to run the creation of image filters in the background.

### Objectives ###

In this hands-on lab, you will learn how to:

-	Use the new HTML5 drag-and-drop API to interact with users.
-	Use the new HTML5 File API to read images.
-	Combine the HTML5 drag-and-drop functionality with the HTML5 File API to create much more complex functionality.
- Use the new HTML5 Web Workers API to run a filter algorithm in the background.

 
### Prerequisites ###

-	Internet Explorer 10
-	An HTML editor of your choice
-	Prior knowledge of HTML and JavaScript development 
-	Http context using IIS or IIS Express

## Exercises ##

This hands-on lab includes the following exercises:

1. [Exercise 1: Implementing Drag-and-Drop API functionality](#Exercise1)

1. [Exercise 2: Implementing File API functionality](#Exercise2)

1. [Exercise 3: Working with Web Workers API](#Exercise3)

Estimated time to complete this lab: **30-45 minutes**.

<a name="Exercise1" />
### Implementing Drag-and-Drop API functionality ###

The starting point for this exercise is the solution located in the lab installation folder under the **Source\Begin** folder. The solution contains a project with all the drag-and-drop functionality. As you progress through the exercise, you will gradually create the **DragAndDropManager** JavaScript object and integrate drag-and-drop functionality into the **FacePlace** application.

#### Task 1 - Creating DragAndDropManager ####

In this task, we will create a JavaScript object by the name of **DragAndDropManager** that will handle the drag-and-drop functionality. **DragAndDropManager** will expose functions that allow for the addition and removal of drag-and-drop events.

1.	Open the solution under the **Source\Begin** folder and examine the **FacePlace** project.

1.	Open the **Face.DragAndDropManager.js** file, which is located in the **Scripts** folder.

1. Declare the immediate function that will create the scope for **DragAndDropManager**.

	````JavaScript
	(function ()
	{
		"use strict";
		...
	}());
	````

	> **Note:** It is a good practice to use JavaScript immediate functions when declaring JavaScript objects. Immediate functions do not pollute the global JavaScript scope.

1. Create the **dragAndDropManager** object inside the immediate function and set it to the **face** namespace after its creation. 

	````JavaScript
	var dragAndDropManager = {
		...
	};
		
	face.dragAndDropManager = dragAndDropManager;
	````

1.	Add inside the **dragAndDropManager** object three variables. These will be initialized inside the **init** function, which we will add in the next step. The variables will hold the drop callback function, the drop target object, and a call back that will be called when image loading has ended.
 
	````JavaScript
	dropCallback: null,
	dropTarget: null,
	callBackOnLoadImage: null,
	...
	````
1.	Add the **init** function after the three variables’ declaration. This function receives the drop target id, the drop callback, and the callback to be used in order to load an image. The **init** function is responsible for initializing the properties of **dragAndDropManager** and adding the drag-and-drop events.

	````JavaScript
	...
	init: function (dropTargetId, callBackOnLoadImage, dropCallback) {
		this.dropCallback = dropCallback;
		if (callBackOnLoadImage !== undefined) {
			//init members
			this.dropTarget = document.getElementById(dropTargetId);
			this.callBackOnLoadImage = callBackOnLoadImage;
		
			this.addDragAndDropEvents();
		}
	},
	...
	````
	
1.	Add the **addDragAndDropEvents** function. This function first checks whether the drop target object is available and, if so, the function is responsible for wiring the **dragover** and **drop** events to the drop target object.

	````JavaScript
	...
	addDragAndDropEvents: function (isRemoveEvents) {
		if (this.dropTarget !== null) {
			if (isRemoveEvents === undefined || isRemoveEvents !== true) {
				// Setup the dnd listeners.
				this.dropTarget.addEventListener('dragover', this.doOnDragover, false);
					this.dropTarget.addEventListener('drop', this.doOnDrop, false);
			}
			else {
				this.removeDragAndDropEvents();
		
				this.dropTarget.addEventListener('dragover', function (evt) {
					evt.stopPropagation();
					evt.preventDefault();
		
					// Explicitly show this is a copy.
					evt.dataTransfer.dropEffect = 'none';
				}, false);
			}
		}
	},
	...
	````

1.	Add the **removeDragAndDropEvents** function. The **removeDragAndDropEvents** function removes the **dragover** and **drop** events that are wired to the drop target object.

	````JavaScript
	...
	removeDragAndDropEvents: function () {
			if (this.dropTarget !== null) {
				// Remove the listeners.
				this.dropTarget.removeEventListener('dragover', this.doOnDragover, false);
				this.dropTarget.removeEventListener('drop', this.doOnDrop, false);
			}
		},
	...
	````
	
1.	Add the event handlers the **dragover** and **drop** events. 

	````JavaScript
	...
	doOnDragover: function (evt) {
		evt.stopPropagation();
		evt.preventDefault();
		
		// Explicitly show this is a copy.
		evt.dataTransfer.dropEffect = 'copy';
	},
		
	doOnDrop: function (evt) {
		evt.stopPropagation();
		evt.preventDefault();
		
		if (dragAndDropManager.dropCallback != undefined) {
				dragAndDropManager.dropCallback(evt.dataTransfer.files);
		}
	}
	````

	This step concludes the current task and the current exercise.

<a name="Exercise2" />
### Exercise 2: Implementing File API functionality ###

The starting point for this exercise is the solution located in the lab installation folder under the **Source\Begin** folder. The solution contains a project with all the File API functionality. As you progress through the exercise, you will gradually create the **BackgroundFileManager** object and integrate it into the **FacePlace** application. You will also integrate the drag-and-drop functionality with **BackgroundFileManager**.

 >**Note:** File API and Web Workers API require HTTP context. You should use a web server in order to run the next exercises. In the Appendix, you will find installation guidelines for IIS Express installation. You can also use IIS server or any other web server you wish to use as long as it will run the application in HTTP context.

#### Task 1 - Adding File API Check ####

In this task, we will create a function to detect whether the browser that runs the webpage supports the File API. Feature detection is very crucial for implementing HTML5 features since not all browsers support all of the features.

1.	Open the **Face.js** file, which is located in the **Scripts** folder.

1. In the **window.face** object declaration, add the **isSupportedBrowser** property, which will check for File API support in the current browser. 

	<!-- mark:2-3,7-9 -->
	````JavaScript
	(function() {
		//Check for IndexedDB support
		var isIndexedDbSupported = !!(window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB);

		if (window.face === undefined) {
			window.face = {
				isIndexedDbSupported: isIndexedDbSupported,
						
				isSupportedBrowser: window.File && window.FileReader && window.FileList && window.Blob && isIndexedDbSupported,

				getUrlParam: function(param) {
					var vars = { };
		
					window.location.href.replace( /[?&]+([^=&]+)=([^&]*)/gi , function(m, key, value) {
						vars[key.toLowerCase()] = value;
					});
		
					return vars[param.toLowerCase()];
				}
			};
		}
	})();
	````
	
1.	Open the **NewGame.js** file, which is located in the **Scripts** folder.

1.	In the jQuery document ready function, add a check for File API support and have the browser raise an alert if the API is not supported.

	<!-- mark:3-4,28-30 -->
	````JavaScript
	...
	$(function() {
		// Check for the various File API support.
		if (window.face !== undefined && window.face.isSupportedBrowser)  {

			initLogo();
		
			//TODO:Activate to bring back 3d button movement
			initIconsTransitions();
		
			initImageHandler();
		
			initTopMenu();
		
			setHelpIconEvents();
		
			attachBottomButtonsEvents();
		
			attachIconEvents();
		
			initDropZone();
		
			initEventBrowseFiles();
		
			tempInitPicture(imageHandler);
		
			openGameFromStorage();
		} else {
			alert('The File APIs are not fully supported in this browser.');
		}
	});
	````
	
1.	Open the **OpenGame.js** file, which is located in the **Scripts** folder.

1.	In the jQuery document ready function, add the check for File API support and have the browser raise an alert if the API is not supported. 

<!-- mark:2,12-14 -->
````JavaScript
$(function() {
	if (face.isSupportedBrowser) {
		initializeButtons();
		initializeDropZone();
		setHelpIconEvents();
	
		face.database.onopened(function() {
			face.pager.currentPage = 0;
	
			loadImages();
		});
	} else {
		alert("The File APIs are not fully supported in this browser.");
	}
});
````
#### Task 2 - Creating the BackgroundFileManager Object ####

In this task, we will create the **BackgroundFileManager** object, which is used to set the background of the **FacePlace** application with an image that was dragged by the user or loaded using a **file** input type.

1.	Open the **NewGame.BackgroundFileManager.js** file, which is located in the **Scripts** folder.

1.	Declare the immediate function that will create the scope for **BackgroundFileManager**.

	````JavaScript
	(function ()
	{
		"use strict";
		...
	}());
	````
	
1.	Create the **backgroundFileManager** object inside the immediate function and set it to the **NewGame** namespace after its creation.

	````JavaScript
	var backgroundFileManager = {
		...
	};
		
	window.NewGame.BackgroundFileManager = backgroundFileManager;
	````
	
1.	Add the **openFileButton** variable inside the **backgroundFileManager** object. The variable will hold the open file button instance so it can later be wired to an event handler.

	````JavaScript
	openFileButton: null,
	...
	````
	
1.	Add the **init** function after the **openFileButton** variable. The **init** function is responsible for setting **openFileButton** and wiring it to an event handler.

	````JavaScript
	...
	init: function(openFileButton) {
			this.openFileButton = document.getElementById(openFileButton);
			this.addOpenFileFileEvent();
	},
	...
	````
	
1.	Add the **addOpenFileFileEvent** function. This function is responsible for wiring an event handler to the **change** event that occurs when a file is chosen in the dialog that generated by   **openFileButton**.

	````JavaScript
	...
	addOpenFileFileEvent: function() {
		if (this.openFileButton !== null) {
				  this.openFileButton.addEventListener('change', this.handleFileSelect, false);
		}
	},
	...
	````
	
1.	Add the **handleFileSelect** function. This function retrieves the file that was selected and sends it to the **addBackgroundToImageHandler** function.

	````JavaScript
	...
	handleFileSelect: function(evt) {
		var files = evt.target.files;
		backgroundFileManager.addBackgroundToImageHandler(files);
	},
	...
	````
	
1.	Add the **addBackgroundToImageHandler** function. This function uses the **FileReader** object to read the file as a Data URL. An event handler for the load event of **FileReader** is used to call the callback function for the loading of an image in **dragAndDropManager**.

	````JavaScript
	...
	addBackgroundToImageHandler: function(files) {
		if (files.length === 1 && files[0].type !== undefined && files[0].type.match('image.*')) {
			var f = files[0],
				reader = new FileReader();
		
			reader.onload = function(e) {
				face.dragAndDropManager.addDragAndDropEvents(true);

				face.dragAndDropManager.callBackOnLoadImage.call(window, e.target.result);
			};
		
			// Read in the image file as a data URL.
			reader.readAsDataURL(f);
		
		} else {
			alert('No file supported');
		}
	}
	````
	
	>**Note:** FileReader allows for reading files as text, as array buffers, or as data URLs. The FileReader is asynchronous and therefore exposes event handlers that can monitor the reading progress up until it is finished.
 
	This step concludes the current task.

#### Task 3 - Initializing DragAndDropManager with File Reading Functionality ####

In this task, we will initialize the **dragAndDropManager** object that was created in Exercise 1. With the help of the **backgroundFileManager** that was created earlier in Exercise 2, we will handle the image loading for images that will be dropped on the drop zone of the **NewGame** and **OpenGame** webpages.

1.	Open the **NewGame.js** file, which is located in the **Scripts** folder.

1.	Add the **initDropZone** function inside the immediate function. This function will initialize **backgroundFileManager** and **dragAndDropManager**. The **dragAndDropManager** object is initialized with a callback for loading an image into the image handler and a callback for the drop event that adds a background to the image handler. 

	<!-- mark:5-20 -->
	````JavaScript
	...
	function attachIconEvents() {
	}
		
	function initDropZone() {
		NewGame.BackgroundFileManager.init("btnBackgroundFile");
		face.dragAndDropManager.init("imageContent",
			function(imageData) {
				$('#chooseImageSection').hide();
				$('#kineticContainer').show();
		
				imageHandler.addBackground(imageData);
		
				$('#trashIconDisabled').addClass('trashIconBlackInvisible');
				$('.glassIconPlusOff').addClass('glassIconPlusOffInvisible');
			},
			function(files) {
				NewGame.BackgroundFileManager.addBackgroundToImageHandler(files);
			});
	}
		
	function initEventBrowseFiles() {
		...
	}
	...
	````
	
1.	Open the **OpenGame.js** file, which is located in the **Scripts** folder. 

1.	Add the **initializeDropZone** function inside the immediate function. This function initializes **dragAndDropManager** with a callback function for loading the image into the image handler and a callback function for the drop event that reads the dragged image as a data URL.

	<!-- mark:5-25 -->
	````JavaScript
	...
	function setHelpIconEvents() {
	}
		
	function initializeDropZone() {
		face.dragAndDropManager.init("newGame",
			function(imageData) {
			},
			function(files) {
				if (files.length === 1 && files[0].type !== undefined && files[0].type.match('image.*')) {
					var f = files[0],
						reader = new FileReader();
		
					reader.onload = function(e) {
						loadNewImage(e.target.result);
					};
		
					// Read in the image file as a data URL.
					reader.readAsDataURL(f);
		
				} else {
					alert('No file supported');
				}
			});
		}
	...
	````

	This step concludes the current task and the current exercise.

<a name="Exercise3" />
### Exercise 3: Implementing File API functionality ###

The starting point for this exercise is the solution located in the lab installation folder under the **Source\Begin** folder. This solution contains a project with all the Web Workers functionality. As you progress through the exercise, you will gradually create the **ImageHandler.Filters.js** worker file and use it in the **ImageHandler** JavaScript object.

#### Task 1 - Creating The Worker File - ImageHandler.Filters.js ####

In this task, we will create the worker file that is going to run in the background. The worker file includes many filter algorithms that will change the image that is sent to the worker during runtime. The worker’s task is to apply the relevant filter to the image and to return the processed image with the filter to the UI thread.

1.	Open the **ImageHandler.Filters.js** file, which is located in the **Scripts** folder. 

1.	Add a Web Worker message event handler. The handler will receive messages from the UI thread and process the relevant filter on the supplied image using the supplied effect.

	````JavaScript
	self.addEventListener('message', function (e)
	{
		var data;
		
		switch (e.data.effect)
		{
			case 'grayscale':
				data = applyFilter(e.data.imageData, grayscale);
				break;
			case 'invert':
				data = applyFilter(e.data.imageData, invert);
				break;
			case 'luminance':
				data = applyFilter(e.data.imageData, luminance);
				break;
			case 'brighter':
				data = brightnessContrast(e.data.imageData, 0.25, 1.5);
				break;
			case 'darker':
				data = brightnessContrast(e.data.imageData, -0.25, 1.5);
				break;
			case 'saturation':
				data = applyFilter(e.data.imageData, saturation);
				break;
			case 'desaturation':
				data = applyFilter(e.data.imageData, desaturation);
				break;
			default:
				data = null;
				break;
		}
		
		if (data === undefined || data === null)
		{
			self.postMessage(null);
			return;
		}
		
		self.postMessage(data);
		return;
		
	}, false);
	...
	````
	
	>**Note:** You can see that the wiring of the event and the posting of the message is accomplished using the **self** keyword. The **self** keyword is used to acquire the Worker instance and set its functionality.

1.	Add the **applyFilter** function. This function is used to apply a filter  to image data that it receives as its first parameter, using the filter function that it receives as its second parameter. 

	````JavaScript
	...
	function applyFilter(imageData, filterFunc)
	{
		if (filterFunc !== undefined)
		{
			for (var n = 0; n < imageData.width * imageData.height; n++)
			{
				var index = n * 4;
		
				filterFunc(imageData.data, index);
			}
		
			return imageData;
		} else
		{
			self.postMessage(filterFunc !== undefined);
			return null;
		}
	}
	...
	````	

	>**Note:** The **imageData** variable is an array that represents the image’s pixels. In order to apply a filter to image data, you must run the filter over each of the image’s rgba pixels, which are supplied in **imageData**.

1.	Add three different filter functions to be used by the applyFilter function: **grayscale**, **invert**, and **luminance**.

	````JavaScript
	...
	function grayscale(d, i)
	{
		var r = d[i];
		var g = d[i + 1];
		var b = d[i + 2];
		
		var v = r * 0.3 + g * 0.59 + b * 0.11;                
		d[i] = d[i + 1] = d[i + 2] = v;
	}
		
	function invert(d, i)
	{
		d[i] = 255 - d[i];
		d[i + 1] = 255 - d[i + 1];
		d[i + 2] = 255 - d[i + 2];
	}
		
	function luminance(d, i)
	{
		var r = d[i];
		var g = d[i + 1];
		var b = d[i + 2];
		
		var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
		d[i] = v;
		d[i + 1] = v;
		d[i + 2] = v;
	}
	...
	````
	
1.	Add the **brightnessContrast** function. This function applies brighter or darker filters to the provided image using the brightness and contrast parameters.

	````JavaScript
	...
	function brightnessContrast(imageData, brightness, contrast)
	{
		var lut = brightnessContrastLUT(brightness, contrast);
		var lutJson = { r: lut, g: lut, b: lut, a: identityLUT() };
		
		return applyFilter(imageData, function (d, i)
		{
			d[i] = lutJson.r[d[i]];
			d[i + 1] = lutJson.g[d[i + 1]];
			d[i + 2] = lutJson.b[d[i + 2]];
			d[i + 3] = lutJson.a[d[i + 3]];
		});
	}
	...
	````
	
1.	Add the **brightnessContrast** helper functions **brightnessContrastLUT** and **identityLUT**. These functions create LUTs (Lookup Tables) to enable the application of brightness and contrast filters.

	````JavaScript
	...
	function brightnessContrastLUT(brightness, contrast)
	{
		var lut = getUint8Array(256);
		var contrastAdjust = -128 * contrast + 128;
		var brightnessAdjust = 255 * brightness;
		var adjust = contrastAdjust + brightnessAdjust;
		for (var i = 0; i < lut.length; i++)
		{
			var c = i * contrast + adjust;
			lut[i] = c < 0 ? 0 : (c > 255 ? 255 : c);
		}
		return lut;
	}
		
	function identityLUT()
	{
		var lut = getUint8Array(256);
		for (var i = 0; i < lut.length; i++)
		{
			lut[i] = i;
		}
		return lut;
	}
	...
	````
	
1.	Add the **getUint8Array** helper function. This function creates a uint8 array with the given array length, for use in the LUT functions above. 

	````JavaScript
	...
	function getUint8Array(len)
	{
		return new Uint8Array(len);
	}
	...
	````
	
1.	Add the **saturation** function. This function will apply a saturation filter to the provided image.

	````JavaScript
	...
	function saturation(d, i) {
		
		var max = Math.max(d[i], d[i + 1], d[i + 2]);
		
		if (d[i] !== max) {
			d[i] += (max - d[i]) * -0.7;
		}
		
		if (d[i + 1] !== max) {
			d[i + 1] += (max - d[i + 1]) * -0.7;
		}
		
		if (d[i + 2] !== max) {
			d[i + 2] += (max - d[i + 2]) * -0.7;
		}
	}
	...
	````
	
1.	Add the **desaturation** function. This function will remove saturation from the provided image.

	````JavaScript
	...
	function desaturation(d, i) {
		var max;
		max = Math.max(d[i], d[i + 1], d[i + 2]);
		
		if (d[i] !== max) {
			d[i] -= (max - d[i]) * -0.7;
		}
		
		if (d[i + 1] !== max) {
			d[i + 1] -= (max - d[i + 1]) * -0.7;
		}
		
		if (d[i + 2] !== max) {
			d[i + 2] -= (max - d[i + 2]) * -0.7;
		}
	};
	...
	````
	
1.	Add the **getFloat32Array** helper function. Like **getUint8Array**, the function will create a new array - this time float32 - of the given length.

	````JavaScript
	...
	function getFloat32Array(len)
	{
		return new Float32Array(len);
	}
	...
	````

#### Task 2 - Integrating the Worker to Run Filters in the Background ####

In the previous task, we created the Web Worker functionality, which is designed to run in a background thread. In this task, you will integrate this functionality into the **ImageHandler** JavaScript object. You will start by creating the **ImageHandler**’s **applyFilter** API function and then add the functionality of creating a Web Worker to process the filter.

1.	Open the **ImageHandler.js** file, which is located in the **Scripts** folder. 

1.	Create the **applyFilter** API function in the **ImageHandler** object. The **this** keyword is used to add the function to the object. The function checks if the supplied filter is one of the application’s predefined filters, and applies the filter if so. If the supplied filter is not a predefined filter, the function will do nothing. Place the function after the declaration of the **getImage** function, as follows:

	<!-- mark:6-16 -->
	````JavaScript
	...
	this.getImage = function (imageName, callback) {
		...
	};
		
	/// <summary>
	///        Apply filter to the background
	/// </summary>
	this.applyFilter = function (filterName) {
		if (this.preDefinedFilters[filterName] !== undefined) {
			this.isChanged = true;
		
			applyFilter.call(this, 'nofilter');
			applyFilter.call(this, filterName);
		}
	};
	...
	````
	
1.	Create the **applyFilter** function. This function will extract the image from the canvas and set the filter effect on the image. In this step, you will only create the function, without implementing the Web Worker functionality. Place the **applyFilter** function after the **getParam** function, as follows:

	<!-- mark:6-20 -->
	````JavaScript
	...
	function getParam(obj, param, defaultValue) {
		...
	}
		
	function applyFilter(effect) {
		var stage = ihkinetic.getStage();
		var ctx = ihkinetic.getLayer('background').getContext();
		var imageData = ctx.getImageData(0, 0, stage.width, stage.height);
		
		if (imageDataNoFilter === null) {
			imageDataNoFilter = imageData;
		}
		
		if (effect !== this.preDefinedFilters.nofilter) {
			...
		} else {
			ctx.putImageData(imageDataNoFilter, 0, 0);
		}
	}
	...
	````
	
1.	In the **applyFilter** function, add the web worker creation functionality inside the **if** statement that was left empty in the previous code block. Then add the message event listener, which will update the image in the canvas after the worker finishes applying the filter. A message will be posted with the image data and filter effect to apply.

	<!-- mark:3-13 -->
	````JavaScript
	...
	if (effect !== this.preDefinedFilters.nofilter) {
		var worker = new Worker('Scripts/ImageHandler.Filters.js?time=' + new Date().toLocaleTimeString());
		worker.addEventListener('message', function (e) {
			if (e.data === null || e.data === undefined) {
				alert('No Filter was applied');
				return;
			}
		
			ctx.putImageData(e.data, 0, 0);
		}, false);
		
		worker.postMessage({ imageData: imageData, effect: effect });
	}
	...
	````

	This step concludes the current task and the entire lab.

## Summary ##

This lab showed you how to use three new HTML5 features: the Drag-and-Drop API, the File API, and the Web Workers API. You also saw how to combine the first two APIs in order to create a much more advanced functionality.

## Appendix: Installing IIS Express ##

### Installing IIS Express on Your Machine ###

In this appendix, we are going to install IIS Express and configure a web application written in Visual Studio to use the installed IIS Express. IIS Express is a lightweight, self-contained version of IIS. It is optimized for developers use and includes a subset of IIS features. IIS Express enables the developers to develop and test their web sites or applications without the need to install IIS on their local machines.
	
We install IIS Express because some of the JavaScript APIs used in this Hands-On Lab require HTTP context in order to run (the File API and the Web Workers API). There are other HTML5 JavaScript API that also require HTTP context such as IndexedDB, Web Sockets, Server-Sent Events and more, which are discussed in other Hands-On Labs or are not discussed in this Training Kit.

#### Installing IIS Express ####

The easiest way to install IIS Express is to use the **Web Platform Installer,** which is a light-weight installation platform.

1.	Open your web browser.

1.	Browse to the following link: <http://www.microsoft.com/web/downloads/platform.aspx>.

1.	Press the “Download It Now” button to download the Web Platform Installer.

1.	After the file finished downloading, run the **wpilauncher_3_10.exe** that you have downloaded.
You should see the following screen while it is loading:

	![WPI Loading](images/wpi-loading.png?raw=true)
 
1.	In the Web Platform Installer start page, locate the search textbox, write iis express and press the Enter key:

	![WPI Start Page](images/wpi-start-page.png?raw=true)
 
1.	Locate IIS Express and press the Add button to add it to the Items to be installed list.

1.	Press the Install button at the bottom of the screen to install IIS Express.

When IIS Express is installed in your local machine, you will need to configure your web site or application to run in its context. In order to do that, you will need to open your web application (in our case the FacePlace application) in Visual Studio. You do that using the following steps:

1.	Right click on the project.

1.	In the menu, select Properties.

1.	In the Properties window, press on the Web tab.

1.	Under the Servers label, locate the radio button with the label “Use Local IIS Web Server” and press it.

	Press the Create Virtual Directory button to create a virtual directory to the web application:
  
	![Web Application Settings](images/web-application-settings.png?raw=true)

	_Web Application Settings_

1.	Now, when pressing F5 to run the web application, it will run in IIS Express.
