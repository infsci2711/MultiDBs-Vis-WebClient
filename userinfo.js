var restBaseUrl = "http://localhost:7654/";

function UserViewModel(username, password) {
	var self = this;

	self.username = ko.observable(username);
	self.password = ko.observable(password);
}

function UsersViewModel() {
	var self = this;

	self.users = ko.observableArray();

	self.newUser = ko.observable(new UserViewModel());

	self.findAll = function() {
		$.ajax({
			url: restBaseUrl + "User",
			type: 'GET',
			dataType: 'json',
			contentType: "application/json",
			crossDomain: true,
			success: function(data) {
				self.users.removeAll();

				for (var i = 0; i < data.length; i++) {
					var user = new UserViewModel(data[i].username, data[i].password);
                   
					self.users.push(user);
				}
			},
			error: function(data) {
				alert("Something went wrong while getting persons list. Please try again.");
			}
		});
	};

	self.addUser = function() {
		$.ajax({
			url: restBaseUrl + "User",
			type: 'PUT',
			data: ko.toJSON(self.newUser()),
			dataType: 'json',
			contentType: "application/json",
			crossDomain: true,
			success: function(data) {
				self.users.push(new UserViewModel(data.username, data.password));
				self.newUser(new UserViewModel());
			},
			error: function(data) {
				alert("Something went wrong while adding new person. Please try again.");
			}
		});
	};

	self.check = function(){
		$.ajax({
			url: restBaseUrl + "User",
			type: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			crossDomain: true,
		    
		});
	};


	self.findAll();
}

ko.applyBindings(new UsersViewModel(), $("#usersContainer")[0]);