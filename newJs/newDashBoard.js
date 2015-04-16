var SERVER_IP = "http://54.173.71.235:7654";
var USER_ID = 1;


//USER->CANVAS

//AJAX get all data about this User
$.getJSON(SERVER_IP+'/Visualization/canvas/user/'+USER_ID, function(canvasJsonObj) {
	$('#userName').html(canvasJsonObj[0].user.userNames);

	//INITIAL tables
	$('#canvas-table').DataTable({
		paging: false,
		data: canvasJsonObj,
		columns: [
		       { data: 'vid' },
		       { data: 'name'},
		       { data: 'cdate' }
	    ]
	});
});


$('#story-table').DataTable({
	paging: false,
});
$('#chart-table').DataTable({
	paging: false,
});

$(document).on('click', '#collapseOne tbody tr', function(event) {
	event.preventDefault();
	$('#collapseOne .selected').removeClass('selected');
	$(this).addClass('selected');
	$('#openV').removeAttr('disabled');
	$('#deleteV').removeAttr('disabled');
});

//Create CANVAS
$('#newCanvas .ok').click(function(event) {	
	var canvasName = $('#newCanvas input[type=text]').val();
	if ($.trim(canvasName)!=0) {
		//AJAX create 
		$.getJSON(SERVER_IP+'/Visualization/canvas/new/'+USER_ID+'/'+canvasName, function(data) {
			//ADD created CANVAS to canvas tables
			console.log(data);
			$('#canvas-table').DataTable().row.add({
					"vid": data.vid,
					"name": data.name,
					"cdate": data.cdate
				}).draw();
		});

		$('#newCanvas').modal('hide');
		$('#newCanvas input[type=text]').val('');
	}else{
		$('#newCanvas input[type=text]').focus();
	}		
});

$('#deleteV').click(function(event) {
	var canvasId = $('#collapseOne .selected').children().first().html();
	//AJAX delete 
	bootbox.confirm("Are you sure to delete this canvas?", function(result){
		if (result==true) {
			$.getJSON(SERVER_IP+'/Visualization/canvas/delete/'+canvasId, function(data) {
				//ADD created CANVAS to canvas tables
				console.log(data);
				if (data.flag=="S") {//delete sucessful
					$('#canvas-table').DataTable().row($('#collapseOne .selected')).remove().draw();
				}else{
					alert("Delete canvas "+canvasId+" unsuccessfully!!");
				};
			});
		}
	});
});

var canvasId;
//Open a CANVAS
$('#openV').click(function(event) {
	canvasId = $('#collapseOne .selected').children().first().html();
	var canvasName = $('#collapseOne .selected').children().eq(1).html();
	$('#headingTwo h4').html('<b>Story</b> of [Canvas id: '+canvasId+', Canvas Name: '+canvasName+']');
	//alert(canvasId);
	$('#createS').removeAttr('disabled');
	//$('.panel-collapse').collapse('hide');
	$('#collapseTwo').collapse('show');

	//AJAX to get STORY by canvasID
	$.getJSON(SERVER_IP+'/Visualization/story/showAll/'+canvasId, function(storyJsonObj) {
		$('#story-table').DataTable().destroy();//destory the original table first
		//INITIAL tables
		$('#story-table').DataTable({
			paging: false,
			data: storyJsonObj,
			columns: [
			       { data: 'sid' },
			       { data: 'did'},
			       { data: 'dname' },
			       { data: 'tname' }
		    ]
		});
	});
});


//CANVAS->STORY
$(document).on('click', '#collapseTwo tbody tr', function(event) {
	event.preventDefault();
	$('#collapseTwo .selected').removeClass('selected');
	$(this).addClass('selected');
	$('#openS').removeAttr('disabled');
	$('#deleteS').removeAttr('disabled');
});

var selectedStoryId;
var selectedDid;
var selectedTname;
var selectedDname;

$('#openS').click(function(event) {
	var storyId = $('#collapseTwo .selected').children().first().html();
	var did = $('#collapseTwo .selected').children().eq(1).html();
	var tname = $('#collapseTwo .selected').children().eq(3).html();
	var dname = $('#collapseTwo .selected').children().eq(2).html();
	selectedStoryId = storyId;
	selectedDid = did;
	selectedTname = tname;
	selectedDname = dname;
	//alert("Open sid "+storyId);
	$('#headingThree h4').html('<b>Chart</b> of [Story '+storyId+', did: '+did+', tname: '+tname+']');
	//$('.panel-collapse').collapse('hide');
	$('#collapseThree').collapse('show');

	//AJAX to get CHART of this STORY

	$.getJSON(SERVER_IP+'/Visualization/chart/showAll/'+storyId, function(chartJsonObj) {
		$('#chart-table').DataTable().destroy();//destory the original table first
		//INITIAL tables
		$('#chart-table').DataTable({
			paging: false,
			data: chartJsonObj,
			columns: [
			       { data: 'cid' },
			       { data: 'type'},
			       { data: 'did' },
			       { data: 'dname' },
			       { data: 'tname' },
			       { data: 'columns' }
		    ]
		});
	});	

	//clear new chart modal
	$('#selectType').val('nothing');
	$('#col1').html('');
	$('#col2').html('');

	$('#createC').removeAttr('disabled');
}); 


//DELETE STORY
$('#deleteS').click(function(event) {
	var storyId = $('#collapseTwo .selected').children().first().html();
	bootbox.confirm("Are you sure to delete this Story?", function(result){
		if (result==true) {
			$.getJSON(SERVER_IP+'/Visualization/story/delete/'+storyId, function(data) {
				//ADD created CANVAS to canvas tables
				console.log(data);
				if (data.flag=="S") {//delete sucessful
					$('#story-table').DataTable().row($('#collapseTwo .selected')).remove().draw();
				}else{
					alert("Delete story "+storyId+" unsuccessfully!!");
				};
			});
		}
	});
});




//STORY->CHART
$(document).on('click', '#collapseThree tbody tr', function(event) {
	event.preventDefault();
	$('#collapseThree .selected').removeClass('selected');
	$(this).addClass('selected');
	$('#openC').removeAttr('disabled');
	$('#deleteC').removeAttr('disabled');
});

//Create CHART
$('#createC').click(function(event) {
	//alert(selectedDid+" "+selectedTname);
	//$('#selectType').val('nothing');
	//AJAX to METASTORE to get ALL COLUMNS
	var urlToMeta = "http://54.152.26.131:7654/datasources/"+selectedDid+"/"+selectedTname+"/columns";
	$.getJSON(urlToMeta, function(columnsJsonObj) {
		console.log(columnsJsonObj);
		$('#selectType').change(function(event) {
			var type = $('#selectType').val();
			$('#col1').html('');
			$('#col2').html('');
			if (type=='nothing') {
				
			}else if (type!='map') {
				$('#FG3').hide();
				for (var i = 0; i < columnsJsonObj.length; i++) {
					$('#col1').append('<option value="'+columnsJsonObj[i].columnName+'">'+columnsJsonObj[i].columnName+'</option>');
					$('#col2').append('<option value="'+columnsJsonObj[i].columnName+'">'+columnsJsonObj[i].columnName+'</option>');
				}
			}else{//map chart
				$('#FG3').show();
				for (var i = 0; i < columnsJsonObj.length; i++) {
					$('#col1').append('<option value="'+columnsJsonObj[i].columnName+'">'+columnsJsonObj[i].columnName+'</option>');
					$('#col2').append('<option value="'+columnsJsonObj[i].columnName+'">'+columnsJsonObj[i].columnName+'</option>');
					$('#col3').append('<option value="'+columnsJsonObj[i].columnName+'">'+columnsJsonObj[i].columnName+'</option>');
				}
			}
		});
	});
});

//Create Chart
$('#newChart .ok').click(function(event) {
	var type = $('#selectType').val();
	var col1 = $('#col1').val();
	var col2 = $('#col2').val();
	var col3 = $('#col3').val();
	//alert(selectedStoryId);
	if (type!='nothing'&&col1!=col2&&col2!=col3&&col3!=col1) {
		//AJAX to SAVE this CHART	
		$.getJSON(SERVER_IP+'/Visualization/chart/new/'+selectedStoryId+'/'+type+'/'+selectedDid+'/'+selectedDname+'/'+selectedTname+'/'+col1+','+col2, function(data) {
			//alert(SERVER_IP+'/Visualization/chart/new/'+selectedStoryId+'/'+type+'/'+selectedDid+'/'+selectedDname+'/'+selectedTname+'/'+col1+','+col2);
			$('#chart-table').DataTable().row.add({
					"cid": data.cid,
					"type": data.type,
					"did": data.did,
					"dname": data.dname,
					"tname": data.tname,
					"columns": data.columns
				}).draw();
		});

		var columns = col1+','+col2;
		//AJAX to PRESTO to get DATA of COLUMNS
		var urlToPresto = "http://54.174.80.167:7654/Query/"
		var query = 'select '+columns+' from '+selectedDid+'.'+selectedTname;
		//alert(query);
		$.ajax({
	        url: urlToPresto,
	        type: 'PUT',
	        dataType: 'json',
	        data: '{"query": "'+query+'"}',
	        contentType: "application/json",
	        crossDomain: true,
	        success: function(dataObj) {
	            console.log(dataObj);
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
	        },
	        error: function(data) {
	           alert("Cannot get data from Presto!");
	        }
	    });


			
		$('#newChart').modal('hide');
	}else{
		alert("Check you input!");
		$('#newChart .modal-body').focus();
	}
});

$('#openC').click(function(event) {
	var did = $('#collapseThree .selected').children().eq(2).html();
	var tname = $('#collapseThree .selected').children().eq(4).html();
	var columns = $('#collapseThree .selected').children().eq(5).html();
	var chartName = "Chart "+ $('#collapseThree .selected').children().eq(0).html();
	var type = $('#collapseThree .selected').children().eq(1).html();
	
	//AJAX send columns, did.tname to PRESTO to get DATA
	var urlToPresto = "http://54.174.80.167:7654/Query/"
	var query = 'select '+columns+' from '+did+'.'+tname;
	//alert(query);

	$.ajax({
        url: urlToPresto,
        type: 'PUT',
        dataType: 'json',
        data: '{"query": "'+query+'"}',
        contentType: "application/json",
        crossDomain: true,
        success: function(dataObj) {
            console.log(dataObj);
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
        },
        error: function(data) {
           alert("Cannot get data from Presto!");
        }
    });
});

//delete CHART
$('#deleteC').click(function(event) {
	var chartId = $('#collapseThree .selected').children().first().html();
	bootbox.confirm("Are you sure to delete this Chart?", function(result){
		if (result==true) {
			$.getJSON(SERVER_IP+'/Visualization/chart/delete/'+chartId, function(data) {
				//ADD created CANVAS to canvas tables
				console.log(data);
				if (data.flag=="S") {//delete sucessful
					$('#chart-table').DataTable().row($('#collapseThree .selected')).remove().draw();
				}else{
					alert("Delete chart "+chartId+" unsuccessfully!!");
				};
			});
		}
	});
});


//KEYWORD SEARCH
$('.keyword .searchBtn').click(function(event) {
	$('#newStory .ok').attr('disabled', 'disabled');
	var searchText = $('.keyword input').val();

	if ($.trim(searchText).length!=0) {
		//AJAX get data from KeyWord Group
		var KWResultObj = [
			{
				did: 24,
				dname: "vistest",
				tname: "country"
			},
			{
				did: 24,
				dname: "vistest",
				tname: "people"
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
		});

	}else{
		$('.keyword input').focus();
	}
	
});

//Create STORY
$('#newStory .ok').click(function(event) {
	var selectedDid = $('#newStory .selected').children().eq(0).html();
	var selectedDname = $('#newStory .selected').children().eq(1).html();
	var selectedTname = $('#newStory .selected').children().eq(2).html();
	alert("Add story: "+selectedDid+", "+selectedDname+", "+selectedTname+"!"+canvasId);
	//AJAX create new STORY!!!
	$.getJSON(SERVER_IP+'/Visualization/story/new/'+selectedDid+'/'+selectedDname+'/'+selectedTname+'/'+canvasId, function(data) {
			//ADD Story to canvas
			console.log(data);
			$('#story-table').DataTable().row.add({
					"sid": data.sid,
					"did": data.did,
					"dname": data.dname,
					"tname": data.tname,
				}).draw();
		});
	$('#newStory').modal('hide');
});

//GOOGLE CHART FUNCTIONS
var chartCounter = 0;

function showPieChart(tableData, chartName){
	var array = [];
	array.push(tableData.schema.columnNames);
	for (var i = 0; i < tableData.data.length; i++) {
		var innerArray = [];
		innerArray.push(tableData.data[i].row[0]);
		innerArray.push(Number(tableData.data[i].row[1]));
		array.push(innerArray);
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
		var innerArray = [];
		innerArray.push(tableData.data[i].row[0]);
		innerArray.push(Number(tableData.data[i].row[1]));
		array.push(innerArray);
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
		var innerArray = [];
		innerArray.push(tableData.data[i].row[0]);
		innerArray.push(Number(tableData.data[i].row[1]));
		array.push(innerArray);
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
		var innerArray = [];
		innerArray.push(tableData.data[i].row[0]);
		innerArray.push(Number(tableData.data[i].row[1]));
		array.push(innerArray);
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


