var restBaseUrl = "http://localhost:7654/";

function CanvasViewModel(name, note) {
	var self = this;

	self.Name = ko.observable(createCanvasName);
	self.Note = ko.observable(create-canvas-note);
}

function CanvasViewModel() {
	var self = this;

	self.canvases = ko.observableArray();

	self.newCanvas = ko.observable(new CanvasViewModel());

	self.findAll = function() {
		$.ajax({
			url: restBaseUrl + "Visualization",
			type: 'GET',
			dataType: 'json',
			contentType: "application/json",
			crossDomain: true,
			success: function(data) {
				self.canvases.removeAll();

				for (var i = 0; i < data.length; i++) {
					var canvas = new CanvasViewModel(data[i].name, data[i].note);
                   
					self.canvases.push(canvas);
				}
			},
			error: function(data) {
				alert("Something went wrong while getting canvases list. Please try again.");
			}
		});
	};

	self.addCanvas = function() {
		$.ajax({
			url: restBaseUrl + "Visualization",
			type: 'PUT',
			data: ko.toJSON(self.newCanvas()),
			dataType: 'json',
			contentType: "application/json",
			crossDomain: true,
			success: function(data) {
				self.canvases.push(new CanvasViewModel(data.name, data.note));
				self.newCanvas(new CanvasViewModel());
			},
			error: function(data) {
				alert("Something went wrong while adding new canvas. Please try again.");
			}
		});
	};

	self.findAll();
}

ko.applyBindings(new CanvasViewModel(), $("#display_section.round")[0]);
