var SERVER_IP = "http://54.173.71.235:7654";
var USER_ID = 1;

//USER->CANVAS
//AJAX get all CANVAS about this USER
$.getJSON(SERVER_IP+'/Visualization/canvas/user/'+USER_ID, function(canvasJsonObj) {
	$('#userName').html(canvasJsonObj[0].user.userNames);

	//INITIAL CANVAS table
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

//Firstly hide story table because user have not choose canvas
$('#story-well').hide();
$('#story-table').DataTable({
	paging: false,
});
//Firstly hide chart table because user have not choose story
$('#chart-well').hide();
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
		//AJAX create CANVAS
		$.getJSON(SERVER_IP+'/Visualization/canvas/new/'+USER_ID+'/'+canvasName, function(data) {
			//ADD created CANVAS to canvas tables
			//console.log(data);

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

//Delete CANVAS
$('#deleteV').click(function(event) {
	var canvasId = $('#collapseOne .selected').children().first().html();
	//AJAX delete 
	bootbox.confirm("Are you sure to delete this canvas?", function(result){
		if (result==true) {
			$.getJSON(SERVER_IP+'/Visualization/canvas/delete/'+canvasId, function(data) {
				//Remove deleted CANVAS to canvas tables
				//console.log(data);
				if (data.flag=="S") {//delete sucessful
					$('#canvas-table').DataTable().row($('#collapseOne .selected')).remove().draw();
				}else{
					alert("Delete canvas "+canvasId+" unsuccessfully!! You should delete Story in this canvas frist!");
				};
			});
		}
	});
});

var canvasId;//GLOBAL selected canvasID for future use

//Open a CANVAS
$('#openV').click(function(event) {
	canvasId = $('#collapseOne .selected').children().first().html();
	var canvasName = $('#collapseOne .selected').children().eq(1).html();
	$('#headingTwo h4').html('<b>Story</b> of [Canvas id: '+canvasId+', Canvas Name: '+canvasName+']');
	//alert(canvasId);
	$('#createS').removeAttr('disabled');
	//$('.panel-collapse').collapse('hide');
	$('#story-well').show();
	$('#story-alert').hide();
	
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

	$('#collapseThree').collapse('hide');
	$('#collapseFour').collapse('hide');
	//scroll to bottom
  	$("html, body").animate({ scrollTop: $(document).height() }, 1000);
	

});


//CANVAS->STORY
$(document).on('click', '#collapseTwo tbody tr', function(event) {
	event.preventDefault();
	$('#collapseTwo .selected').removeClass('selected');
	$(this).addClass('selected');
	$('#openS').removeAttr('disabled');
	$('#deleteS').removeAttr('disabled');
});

//Global variables for future use
var selectedStoryId;
var selectedDid;
var selectedTname;
var selectedDname;

//Open STORY
$('#openS').click(function(event) {
	var storyId = $('#collapseTwo .selected').children().first().html();
	var did = $('#collapseTwo .selected').children().eq(1).html();
	var dname = $('#collapseTwo .selected').children().eq(2).html();
	var tname = $('#collapseTwo .selected').children().eq(3).html();
	//Set Global variables
	selectedStoryId = storyId;
	selectedDid = did;
	selectedTname = tname;
	selectedDname = dname;
	//alert("Open sid "+storyId);
	$('#headingThree h4').html('<b>Chart</b> of [Story '+storyId+', did: '+did+', tname: '+tname+']');
	//$('.panel-collapse').collapse('hide');
	$('#collapseThree').collapse('show');
	$('#chart-well').show();
	$('#chart-alert').hide();

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

	$('#collapseFour').collapse('hide');
	//scroll to bottom
	$("html, body").animate({ scrollTop: $(document).height() }, 1000);

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
					alert("Delete story "+storyId+" unsuccessfully!! You should delete charts in this story first!");
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

//Create CHART - OPEN
$('#createC').click(function(event) {
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

//Create Chart - OK
$('#newChart .ok').click(function(event) {
	var type = $('#selectType').val();
	var col1 = $('#col1').val();
	var col2 = $('#col2').val();
	var col3 = $('#col3').val();
	var isAggregateQuery = $('#aggForm').is(":visible"); 
	//alert(selectedStoryId);
	console.log(col1+','+col2+','+col3+': '+type);
	if (type!='nothing') {
		//AJAX to SAVE this CHART	
		var chartName = '';
		var urlToSave = '';
		var aggType = '';
		if (!isAggregateQuery) {
			urlToSave = SERVER_IP+'/Visualization/chart/new/'+selectedStoryId+'/'+type+'/'+selectedDid+'/'+selectedDname+'/'+selectedTname+'/'+col1+','+col2;
		}else{
			aggType = $('#aggType').val();
			urlToSave = SERVER_IP+'/Visualization/chart/new/'+selectedStoryId+'/'+type+'/'+selectedDid+'/'+selectedDname+'/'+selectedTname+'/'+col1+','+aggType+'('+col2+')';
		}

		$.getJSON(urlToSave, function(data) {
			//alert(SERVER_IP+'/Visualization/chart/new/'+selectedStoryId+'/'+type+'/'+selectedDid+'/'+selectedDname+'/'+selectedTname+'/'+col1+','+col2);
			$('#chart-table').DataTable().row.add({
					"cid": data.cid,
					"type": data.type,
					"did": data.did,
					"dname": data.dname,
					"tname": data.tname,
					"columns": data.columns
				}).draw();
			chartName = "Chart "+data.cid;
		});
		var columns = '';
		if (!isAggregateQuery) {
			columns = col1+','+col2;
		}else{
			columns = col1+','+aggType+'('+col2+')';
		}
		
		//AJAX to PRESTO to get DATA of COLUMNS
		var urlToPresto = "http://54.174.80.167:7654/Query/"
		//see if it is an Aggregate Query
		
		var query = '';
		if (!isAggregateQuery) {
			query = 'select '+columns+' from '+selectedDid+'.'+selectedTname;
		}else{
			query = 'select '+columns+' from '+selectedDid+'.'+selectedTname+' group by '+ col1;
		}

		console.log(query);
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
				}else if (type=='table') {
					showTableChart(dataObj,chartName);
				}
	        },
	        error: function(data) {
	           alert("Cannot get data from Presto!");
	        }
	    });
		
		$("html, body").animate({ scrollTop: $(document).height() }, 1000);
		$('#newChart').modal('hide');
	}else{
		alert("Check you input!");
		$('#newChart .modal-body').focus();
	}
});

//change type of chart
$('.topNav').click(function(event) {
	$('.topNav').parent().removeClass('active');
	$(this).parent().addClass('active');
	if ($(this).html()=='Aggregation') {
		$('#aggForm').show("fast");
	}else{
		$('#aggForm').hide("fast");
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
	var query = '';
	var col = columns.split(",");
	console.log(columns);
	console.log(columns.indexOf('avg('));
	var isAggregateQuery = false;

	if (columns.indexOf('max(')>0) {
		isAggregateQuery=true;
	}
	if (columns.indexOf('avg(')>0) {
		isAggregateQuery=true;
	}
	if (columns.indexOf('min(')>0) {
		isAggregateQuery=true;
	}
	if (columns.indexOf('sum(')>0) {
		isAggregateQuery=true;
	}
	if (columns.indexOf('count(')>0) {
		isAggregateQuery=true;
	}


	if (isAggregateQuery) {
		query = 'select '+columns+' from '+did+'.'+tname+' group by '+col[0];
	}else{
		query = 'select '+columns+' from '+did+'.'+tname;
	}

	console.log(query);
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
			}else if (type=='table') {
				showTableChart(dataObj,chartName);
			}
        },
        error: function(data) {
           alert("Cannot get data from Presto!");
        }
    });

    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
});

//delete CHART
$('#deleteC').click(function(event) {
	var chartId = $('#collapseThree .selected').children().first().html();
	bootbox.confirm("Are you sure to delete this Chart?", function(result){
		if (result==true) {
			$.getJSON(SERVER_IP+'/Visualization/chart/delete/'+chartId, function(data) {
				//ADD created CANVAS to canvas tables
				//console.log(data);
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
	var KWFinalObj = [];
	if ($.trim(searchText).length!=0) {
		//AJAX get data from KeyWord Group
		var urlToKeyword = "http://54.174.121.196:7654/Join/"+searchText;
		$.get(urlToKeyword, function(data) {
			
			var KWResultObj = data.searchResult;
			for (var i = 0; i < KWResultObj.length; i++) {
				//console.log(KWResultObj[i]);
				if (KWResultObj[i].ID.length!=0&&KWResultObj[i].table.length==0) {
					// console.log('first');
					// var urlToMeta = "http://54.152.26.131:7654/datasources/"+KWResultObj[i].ID;
					// $.get(urlToMeta, function(data) {
					// 	console.log("second");
					// 	var did = data.id;
					// 	var dname = data.dbName;
					// 	var tables = data.tables;
					// 	for (var i = 0; i < tables.length; i++) {
					// 		var temp = {
					// 			"ID":did,
					// 			"database":dname,
					// 			"table":tables[i].tableName
					// 		};
					// 		console.log(temp);
					// 		KWFinalObj.push(temp);
					// 		console.log(KWFinalObj);
					// 	}
					// });
					alert("Please use DB id "+KWResultObj[i].ID+" to search again!");
					$('.keyword input').val(KWResultObj[i].ID);
				}else{
					console.log(KWResultObj[i]);
					KWFinalObj.push(KWResultObj[i]);
				}
			}	
			
			$('#search-Resault').html('');
			$('#search-Resault').html('<table id="keyword-table" class="stripe row-border hover order-column"><thead><tr><th>DB ID</th><th>DB Name</th><th>Table Name</th></tr></thead></table>');
			$('#keyword-table').DataTable({
				paging: false,
				bFilter: false,
				bInfo: false,
				data: KWFinalObj,
				columns: [
					{data: "ID"},
					{data: "database"},
					{data: "table"}
				]
			});	
		});

	}else{
		$('.keyword input').focus();
	}
	
});

$(document).on('click', '#keyword-table tr', function(event) {
			event.preventDefault();
			$('#newStory .selected').removeClass('selected');
			$(this).addClass('selected');
			$('#newStory .ok').removeAttr('disabled');
		});

//Create STORY
$('#newStory .ok').click(function(event) {
	var selectedDid = $('#newStory .selected').children().eq(0).html();
	var selectedDname = $('#newStory .selected').children().eq(1).html();
	var selectedTname = $('#newStory .selected').children().eq(2).html();
	//alert("Add story: "+selectedDid+", "+selectedDname+", "+selectedTname+"!"+canvasId);
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

function showTableChart(tableData, chartName){
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
		showRowNumber: true
	};

	$('#chart_div').append('<div id="chart'+chartCounter+'" class="chartContainer"></div>');
	$('#chart'+chartCounter).draggable({
		appendTo: '#chart_div',	
		grid: [ 50, 20 ]
	});

	var chart = new google.visualization.Table(document.getElementById('chart'+chartCounter));
    chart.draw(data, option);
    chartCounter++;
}

$('#clearChart').click(function(event) {
	$('#chart_div').html('');
});

