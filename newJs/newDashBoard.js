//get all data about this User
//This part should use ajax
//
//
//USER->CANVAS
var userJsonObj = {
	userId: "23",
	user_names: "Haoda",
	story: [
		{sid: "1", conninfo: "test1"},
		{sid: "2", conninfo: "test2"}
	],
	canvas: [
		{
			vid: "1", 
			name: "canvas1",
			cdate: "2015-02-13 17:34:56"
		},
		{
			vid: "2", 
			name: "canvas2",
			cdate: "2015-03-18 17:34:56"
		},
		{
			vid: "3", 
			name: "canvas3",
			cdate: "2014-12-21 17:34:56"
		}
	]
};
$('#userName').html(userJsonObj.user_names);

//INITIAL tables
$('#canvas-table').DataTable({
	paging: false,
	data: userJsonObj.canvas,
	columns: [
	       { data: 'vid' },
	       { data: 'name'},
	       { data: 'cdate' }
    ]
});
$('#story-table').DataTable({
	paging: false,
});
$('#chart-table').DataTable({
	paging: false,
});

$(document).on('click', '#collapseOne tbody tr', function(event) {
	event.preventDefault();
	$('.selected').removeClass('selected');
	$(this).addClass('selected');
	$('#openV').removeAttr('disabled');
	$('#deleteV').removeAttr('disabled');
});

//Creating a new CANVAS
$('#newCanvas .ok').click(function(event) {	
	//$('#newCanvas').modal('hide');
	var user_id = userJsonObj.userId;
	var canvasName = $('#newCanvas input[type=text]').val();
	if ($.trim(canvasName)!=0) {
		alert(user_id+" "+canvasName);
		$('#newCanvas').modal('hide');
		$('#newCanvas input[type=text]').val('');
	}else{
		$('#newCanvas input[type=text]').focus();
	}		
});

//Open a CANVAS
$('#openV').click(function(event) {
	var canvasId = $('#collapseOne .selected').children().first().html();
	//alert(canvasId);
	$('#createS').removeAttr('disabled');
	$('.panel-collapse').collapse('hide');
	$('#collapseTwo').collapse('show');

	//use ajax to get stories by canvasId
	var canvasObj = {
		vid: 1,
		canvasName: "canvas1",
		story:[
			{
				sid: 1,
				did: 203,
				dname: "class1",
				tname: "student"
			},
			{
				sid: 2,
				did: 204,
				dname: "class2",
				tname: "teacher"
			}
		]
	};
	$('#headingTwo h4').html('<b>Story</b> of [Canvas id: '+canvasObj.vid+', Canvas Name: '+canvasObj.canvasName+']');

	$('#story-table').DataTable().destroy();//destory the original table first
	$('#story-table').DataTable({
		paging: false,
		data: canvasObj.story,
		columns: [
			{data: "sid"},
			{data: "did"},
			{data: "dname"},
			{data: "tname"}
		]
	});
});

$('#deleteV').click(function(event) {
	var canvasId = $('#collapseOne .selected').children().first().html();
	alert("Deleting CANVAS "+canvasId);
	

});


//CANVAS->STORY
$(document).on('click', '#collapseTwo tbody tr', function(event) {
	event.preventDefault();
	$('.selected').removeClass('selected');
	$(this).addClass('selected');
	$('#openS').removeAttr('disabled');
	$('#deleteS').removeAttr('disabled');
});

$('#openS').click(function(event) {
	var storyId = $('#collapseTwo .selected').children().first().html();
	var did = $('#collapseTwo .selected').children().eq(1).html();
	var tname = $('#collapseTwo .selected').children().eq(3).html();

	//alert("Open sid "+storyId);
	$('#headingThree h4').html('<b>Chart</b> of [Story '+storyId+', did: '+did+', tname: '+tname+']');
	$('.panel-collapse').collapse('hide');
	$('#collapseThree').collapse('show');

	//AJAX to get CHART of this STORY
	var chartObj = [
		{
			cid: 1,
			cname: "PieChart1",
			type: "Pie",
			did: 204,
			dname: "class2",
			tname: "teacher",
			col: "name, age"
		},
		{
			cid: 2,
			cname: "LineChart1",
			type: "Line",
			did: 204,
			dname: "class2",
			tname: "teacher",
			col: "name, age"
		},
	];

	$('#chart-table').DataTable().destroy();//destory the original table first
	$('#chart-table').DataTable({
		paging: false,
		data: chartObj,
		columns: [
			{data: "cid"},
			{data: "cname"},
			{data: "type"},
			{data: "did"},
			{data: "dname"},
			{data: "tname"},
			{data: "col"}
		]
	});
	$('#createC').removeAttr('disabled');
}); 

$('#deleteS').click(function(event) {
	var storyId = $('#collapseTwo .selected').children().first().html();
	alert("Delete sid "+storyId);
});

//STORY->CHART
$(document).on('click', '#collapseThree tbody tr', function(event) {
	event.preventDefault();
	$('.selected').removeClass('selected');
	$(this).addClass('selected');
	$('#openC').removeAttr('disabled');
	$('#deleteC').removeAttr('disabled');
});


//KEYWORD SEARCH
$('.keyword .searchBtn').click(function(event) {
	$('#newStory .ok').attr('disabled', 'disabled');

	var searchText = $('.keyword input').val();
	if ($.trim(searchText).length!=0) {
		//AJAX get data from KeyWord Group
		var KWResultObj = [
			{
				did: 205,
				dname: "UP",
				tname: "professors"
			},
			{
				did: 205,
				dname: "CMU",
				tname: "professors"
			}
		];
			
		$('#search-Resault').html('');
		$('#search-Resault').html('<table id="keyword-table" class="stripe row-border hover order-column"><thead><tr><th>DB ID</th><th>DB Name</th><th>Table Name</th></tr></thead></table>');
		$('#keyword-table').DataTable({
			paging: false,
			bFilter: false,
			bInfo: false,
			data: KWResultObj,
			columns: [
				{data: "did"},
				{data: "dname"},
				{data: "tname"}
			]
		});

		$(document).on('click', '#keyword-table tr', function(event) {
			event.preventDefault();
			$('#newStory .selected').removeClass('selected');
			$(this).addClass('selected');
			$('#newStory .ok').removeAttr('disabled');

			$('#newStory .ok').click(function(event) {
				var selectedDid = $('#newStory .selected').children().eq(0).html();
				var selectedDname = $('#newStory .selected').children().eq(1).html();
				var selectedTname = $('#newStory .selected').children().eq(2).html();
				alert("Add story: "+selectedDid+", "+selectedDname+", "+selectedTname);

				//AJAX create new STORY!!!
				$('#newStory').modal('hide');
			});
		});

	}else{
		$('.keyword input').focus();
	}
	
});



