//get all data about this User
//This part should use ajax
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
				did: 1,
				dname: "group1",
				tname: "metaStore"
			},
			{
				sid: 2,
				did: 204,
				dname: "class2",
				tname: "table"
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

var selectedStoryId;
var selectedDid;
var selectedTname;

$('#openS').click(function(event) {
	var storyId = $('#collapseTwo .selected').children().first().html();
	var did = $('#collapseTwo .selected').children().eq(1).html();
	var tname = $('#collapseTwo .selected').children().eq(3).html();

	selectedStoryId = storyId;
	selectedDid = did;
	selectedTname = tname;
	//alert("Open sid "+storyId);
	$('#headingThree h4').html('<b>Chart</b> of [Story '+storyId+', did: '+did+', tname: '+tname+']');
	$('.panel-collapse').collapse('hide');
	$('#collapseThree').collapse('show');

	//AJAX to get CHART of this STORY
	var chartObj = [
		{
			cid: 1,
			cname: "PieChart1",
			type: "pie",
			did: 1,
			dname: "class2",
			tname: "teacher",
			col: "name, age"
		},
		{
			cid: 2,
			cname: "BarChart1",
			type: "bar",
			did: 1,
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

$('#createC').click(function(event) {
	//alert(selectedDid+" "+selectedTname);
	
	//AJAX to METASTORE to get ALL COLUMNS
	var urlToMeta = "http://54.152.26.131:7654/datasources/"+selectedDid+"/"+selectedTname+"/columns";

	var columnsObj = [
		{"columnName":"ID"},
		{"columnName":"DBtype"},
		{"columnName":"IPAddress"},
		{"columnName":"port"},
		{"columnName":"username"},
		{"columnName":"password"},
		{"columnName":"DBname"},
		{"columnName":"title"},
		{"columnName":"description"}
	];

	$('#selectType').change(function(event) {
		var type = $('#selectType').val();
		$('#col1').html('');
		$('#col2').html('');
		if (type=='nothing') {
			
		}else if (type!='map') {
			$('#FG3').hide();
			for (var i = 0; i < columnsObj.length; i++) {
				$('#col1').append('<option value="'+columnsObj[i].columnName+'">'+columnsObj[i].columnName+'</option>');
				$('#col2').append('<option value="'+columnsObj[i].columnName+'">'+columnsObj[i].columnName+'</option>');
			}
		}else{//map chart
			$('#FG3').show();
			for (var i = 0; i < columnsObj.length; i++) {
				$('#col1').append('<option value="'+columnsObj[i].columnName+'">'+columnsObj[i].columnName+'</option>');
				$('#col2').append('<option value="'+columnsObj[i].columnName+'">'+columnsObj[i].columnName+'</option>');
				$('#col3').append('<option value="'+columnsObj[i].columnName+'">'+columnsObj[i].columnName+'</option>');
			}
		}
	});
});

$('#newChart .ok').click(function(event) {
		var chartName = $('#newChart .name').val();
		var type = $('#selectType').val();
		var col1 = $('#col1').val();
		var col2 = $('#col2').val();
		var col3 = $('#col3').val();

		if ($.trim(chartName)!=0&&type!='nothing'&&col1!=col2&&col2!=col3&&col3!=col1) {
			//AJAX to PRESTO to get DATA of COLUMNS
			var dataObj = { 
				schema: {
					columnNames: ["pizza", "slice"]
				},
				data: [
					{row: ["Beef",4]},
					{row: ["Mushroom",5]},
					{row: ["Fish",10]},
					{row: ["Fruit",3]}
				]
			};

			$('#collapseFour').collapse('show');
			if (type=='pie') {
				//alert("!");
				showPieChart(dataObj,chartName);
			}else if (type=='bar') {
				showBarChart(dataObj,chartName);
			}else if (type=='column') {
				showColumnChart(dataObj,chartName);
			}else if (type=='area') {
				showAreaChart(dataObj,chartName);
			}
			

			$('#newChart').modal('hide');
		}else{
			$('#newChart .name').focus();
		}
});

$('#openC').click(function(event) {
	var did = $('#collapseThree .selected').children().eq(3).html();
	var tname = $('#collapseThree .selected').children().eq(5).html();
	var columns = $('#collapseThree .selected').children().eq(6).html();
	var chartName = $('#collapseThree .selected').children().eq(1).html();
	var type = $('#collapseThree .selected').children().eq(2).html();

	//AJAX send columns, did.tname to PRESTO to get DATA
	var dataObj = { 
		schema: {
			columnNames: ["pizza", "slice"]
		},
		data: [
			{row: ["Beef",4]},
			{row: ["Mushroom",5]},
			{row: ["Fish",10]},
			{row: ["Fruit",3]}
		]
	};	

	$('#collapseFour').collapse('show');
	if (type=='pie') {
		showPieChart(dataObj,chartName);
	}else if (type=='bar') {
		showBarChart(dataObj,chartName);
	}else if (type=='column') {
		showColumnChart(dataObj,chartName);
	}else if (type=='area') {
		showAreaChart(dataObj,chartName);
	}
	
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




//GOOGLE CHART FUNCTIONS
var chartCounter = 0;

function showPieChart(tableData, chartName){
	var array = [];
	array.push(tableData.schema.columnNames);
	for (var i = 0; i < tableData.data.length; i++) {
		array.push(tableData.data[i].row);
	}
	//console.log(array);
	var data = google.visualization.arrayToDataTable(array);
	var option = {
		is3D: true,
		title: chartName
	};

	$('#chart_div').append('<div id="chart'+chartCounter+'" class="chartContainer source ui-state-default"></div>');
	$('#chart'+chartCounter).draggable({
		appendTo: '#chart_div',	
		grid: [ 50, 20 ]
	});

	var chart = new google.visualization.PieChart(document.getElementById('chart'+chartCounter));
    chart.draw(data, option);
    $('#chart'+chartCounter).focus();
    chartCounter++;


}



function showBarChart(tableData, chartName){
	var array = [];
	array.push(tableData.schema.columnNames);
	for (var i = 0; i < tableData.data.length; i++) {
		array.push(tableData.data[i].row);
	}
	//console.log(array);
	var data = google.visualization.arrayToDataTable(array);
	var option = {
		title: chartName,

	};

	$('#chart_div').append('<div id="chart'+chartCounter+'" class="chartContainer"></div>');
	$('#chart'+chartCounter).draggable({
		appendTo: '#chart_div',	
		grid: [ 50, 20 ]	
	});

	var chart = new google.visualization.BarChart(document.getElementById('chart'+chartCounter));
    chart.draw(data, option);
    chartCounter++;
}

function showColumnChart(tableData, chartName){
	var array = [];
	array.push(tableData.schema.columnNames);
	for (var i = 0; i < tableData.data.length; i++) {
		array.push(tableData.data[i].row);
	}
	//console.log(array);
	var data = google.visualization.arrayToDataTable(array);
	var option = {
		title: chartName,
	};

	$('#chart_div').append('<div id="chart'+chartCounter+'" class="chartContainer"></div>');
	$('#chart'+chartCounter).draggable({
		appendTo: '#chart_div',
		grid: [ 50, 20 ]		
	});

	var chart = new google.visualization.ColumnChart(document.getElementById('chart'+chartCounter));
    chart.draw(data, option);
    chartCounter++;
}

function showAreaChart(tableData, chartName){
	var array = [];
	array.push(tableData.schema.columnNames);
	for (var i = 0; i < tableData.data.length; i++) {
		array.push(tableData.data[i].row);
	}
	//console.log(array);
	var data = google.visualization.arrayToDataTable(array);
	var option = {
		title: chartName,
	};

	$('#chart_div').append('<div id="chart'+chartCounter+'" class="chartContainer"></div>');
	$('#chart'+chartCounter).draggable({
		appendTo: '#chart_div',	
		grid: [ 50, 20 ]
	});

	var chart = new google.visualization.AreaChart(document.getElementById('chart'+chartCounter));
    chart.draw(data, option);
    chartCounter++;


}

$('#clearChart').click(function(event) {
	$('#chart_div').html('');
});

