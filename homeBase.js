var angularApp = new angular.module('angularApp',['ui.unique'], function($httpProvider){

	$httpProvider.defaults.cache = true;

	// Use x-www-form-urlencoded Content-Type
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	$httpProvider.defaults.cache = true;
	/**
	* The workhorse; converts an object to x-www-form-urlencoded serialization.
	* @param {Object} obj
	* @return {String}
	*/ 
	var param = function(obj) {
	var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
	  
	for(name in obj) {
	  value = obj[name];
	    
	  if(value instanceof Array) {
	    for(i=0; i<value.length; ++i) {
	      subValue = value[i];
	      fullSubName = name + '[' + i + ']';
	      innerObj = {};
	      innerObj[fullSubName] = subValue;
	      query += param(innerObj) + '&';
	    }
	  }
	  else if(value instanceof Object) {
	    for(subName in value) {
	      subValue = value[subName];
	      fullSubName = name + '[' + subName + ']';
	      innerObj = {};
	      innerObj[fullSubName] = subValue;
	      query += param(innerObj) + '&';
	    }
	  }
	  else if(value !== undefined && value !== null)
	    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
	}
	  
	return query.length ? query.substr(0, query.length - 1) : query;
	};

	// Override $http service's default transformRequest
	$httpProvider.defaults.transformRequest = [function(data) {
	return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];	

});


angularApp.controller('angularController', function($scope, $http, $rootScope){
	
	$scope.haveSelected = false;
	$scope.hideOn   	= false;
	$scope.tableColumns = {'category' : 'category', 'description' : 'description', 'place' : 'place', 'relation' : 'relation', 
										'title' : 'title', 'bestbefore' : 'bestbefore', 'borrowedfrom' : 'borrowedfrom',
										'subinfo' : 'subinfo', 'author' : 'author', 'quantity' : 'quantity', 'id' : 'id' };

	$http.post('./getData.php', {'category' :'notes'} ).success(function(data){
		
		$scope.chunks 			= data;		
		$scope.keys   			= {};
		$scope.out 				= {};
		var uniqueCategories 	= {};
		$scope.uniqueColumns 	= {};

		for (var item in data) {
			if (!uniqueCategories.hasOwnProperty(data[item]['category'])){
				uniqueCategories[data[item]['category']] = data[item]['category'];
			}
		}					
		/* sort out unique elements of database columns to aid creation of new articles */
		$scope.secondTry = {};

		for (var key in $scope.tableColumns) {			
			$scope.secondTry[key] = [];

			$scope.uniqueColumns[key] = {};
			console.log(key);
			if ( (key !== "id") && (key !== "description")) {
				for (var item in data) {
					if ( (!$scope.uniqueColumns[key].hasOwnProperty(data[item][key])) && (data[item][key] !== "") && (data[item][key] !== null) ) {
						$scope.uniqueColumns[key][data[item][key]] = data[item][key];
						$scope.secondTry[key].push({'label' : data[item][key]});
					}
				}
			}			
		}
		console.log($scope.secondTry);
		for (var item in uniqueCategories) {			
			$scope.out[item] = [];
			for (var dataItem in data) {
				if (data[dataItem]['category'] == item) {				
					$scope.out[item].push(data[dataItem]);
				}
			}
		}				
		console.log($scope.uniqueColumns);
		for (var item in data[0]) {
			if (item !== "$$hashKey")
				$scope.keys[item] = item;
		}			
	});	
	
	$scope.test = [
					{label: "one"},
					{label: "two"},
					{label: "three"}
					];

	$scope.doSomething 	= function(){
		console.log("something");
	}

	/* functions activated by buttons */

	$scope.select = function(chunk, idx){
		/* reset color of selected article button */
		if ($scope.haveSelected) {
			document.getElementById('selectButton'+$scope.selected.id).style.color = 'black';
		}
		/* set selected article button color to blue */
		document.getElementById('selectButton'+chunk.id).style.color = 'blue';
		/* reset the form for updating values, don't rememeber why this is necessary */ 
		document.getElementById("categoryForm").reset();

		$scope.selected 		= chunk;
		$scope.selectedIndex 	= idx;
		
		for (item in $scope.selected) {
			if(item !== "$$hashKey") {			
				document.getElementById(item).value = $scope.selected[item];
			}
		}

		if ($scope.hideOn){
			$scope.unHide();
			$scope.hide($scope.selected);
		}

		document.getElementById("deleteButton").style.display = "none";
		$scope.haveSelected = true;
	};	
	$scope.activateHide = function(){
		if($scope.hideOn){
			$scope.hideOn = false;
			$scope.unHide();
		} else {
			$scope.hideOn = true;
			$scope.hide($scope.selected);
		} 			
	}
	$scope.deleteData 		= function(){

		$http.post('./deleteData.php', {'id' : $scope.selected['id']} ).success(function(data){
			console.log("removing data from table for id " + $scope.selected['id']);
			if (data == 1){
				console.log("successfully removed data");

				if ($scope.haveSelected) {
					document.getElementById('selectButton'+$scope.selected.id).style.color = 'black';
				}
				$scope.haveSelected = false;
				var category 	= $scope.selected["category"]; 
				var idxOut 		= $scope.out[category].indexOf($scope.selected);
				var idxChunks	= $scope.chunks.indexOf($scope.selected);
				
				$scope.out[category].splice(idxOut, 1);
				$scope.chunks.splice(idxChunks, 1);
		
				for (var item in $scope.keys) {
					console.log(item);
					document.getElementById(item).value = '';
				}				
				document.getElementById("deleteButton").style.display = 'none';

			}
		});
	}	

	$scope.update = function(){
		var toWrite 	= {};
		
		for (var item in $scope.selected){
			if (item !== '$$hashKey') {
				if ($scope.selected[item] !== null){
					toWrite[item] = '';
				}					
				else {
					toWrite[item] = '';	
				}					
			}		
		}		
		
		var container 	= document.getElementById('categoryForm');
		var child 		= container.firstChild;

		while(child){
			if ( (child.value !== '') && (child.value !== undefined) ) {
				toWrite[child.id] = child.value;			
			}
			child = child.nextSibling;				
		}
		
		var category       = toWrite["category"];
		var description    = toWrite["description"];
		var place          = toWrite["place"];
		var relation       = toWrite["relation"];
		var title          = toWrite["title"];
		var bestbefore     = toWrite["bestbefore"];
		var borrowedfrom   = toWrite["borrowedfrom"];
		var subinfo        = toWrite["subinfo"];
		var author         = toWrite["author"];
		var quantity       = toWrite["quantity"];
		var id             = toWrite["id"];

		$http.post('./updateData.php', {'category' : toWrite["category"], 'description' : toWrite['description'], 'place' : toWrite['place'], 'relation' : toWrite['relation'], 'title' : toWrite['title'], 'bestbefore' : toWrite['bestbefore'], 'borrowedfrom' : toWrite['borrowedfrom'], 'subinfo' : toWrite['subinfo'], 'author' : toWrite['author'], 'quantity' : toWrite['quantity'], 'id' : toWrite['id'] } ).success(function(data){
			if (data == 1){
				console.log("successfully sent request to database");
				document.getElementById("informationDiv").innerHTML = "<center> successfully sent request to database </center>";
				var category 	= $scope.selected["category"]; 
				var idxOut 		= $scope.out[category].indexOf($scope.selected);
				var idxChunks	= $scope.chunks.indexOf($scope.selected);
				
				for (item in toWrite) {
					if (item !== '$$hashKey') {
						if (toWrite[item] !== 'NULL'){
							$scope.out[category][idxOut][item] 	= toWrite[item];
							$scope.chunks[idxChunks][item] 		= toWrite[item];
						} else {
							$scope.out[category][idxOut][item] 	= '';
							$scope.chunks[idxChunks][item] 		= '';
						}					
					}		
				}				
			} else {
				console.log("error when updating database")
				document.getElementById("informationDiv").innerHTML = "<center> error when updating database </center>";
				console.log(data);		
			}
		});
	}
	$scope.addNewData 		= function() {
		
		var container 	= document.getElementById('addForm');
		var child 		= container.firstChild;
		var toWrite 	= {};

		for (item in $scope.tableColumns) {
			toWrite[item+"Add"] = '';
		} 

		while(child){
			if ( (child.value !== '') && (child.value !== undefined) ) {
				toWrite[child.id] = child.value;			
				console.log(child.value);	
			}
			child = child.nextSibling;				
		}
		
		$http.post('./addnewData.php', {'category' 		: toWrite["categoryAdd"], 
										'description' 	: toWrite["descriptionAdd"], 
										'place' 		: toWrite["placeAdd"], 
										'relation' 		: toWrite["relationAdd"], 
										'title' 		: toWrite["titleAdd"], 
										'bestbefore' 	: toWrite["bestbeforeAdd"], 
										'borrowedfrom' 	: toWrite["borrowedfromAdd"], 
										'subinfo' 		: toWrite["subinfoAdd"], 
										'author' 		: toWrite["authorAdd"], 
										'quantity' 		: toWrite["quantityAdd"], 
										'id' 			: toWrite["idAdd"] 
										}).success(function(data){
											console.log("successfully sent add request to database");											
											console.log(data);
											document.getElementById("informationDiv").innerHTML = "<center> successfully sent add request to database </center>";
										});
	}		
	$scope.toggleUpdateAdd = function() {
		if (document.getElementById("updateFormHolder").style.display == "none") {
			document.getElementById("updateFormHolder").style.display = "inline";
			document.getElementById("addDataFormHolder").style.display = "none";
		} 
		else {
			document.getElementById("updateFormHolder").style.display = "none";
			document.getElementById("addDataFormHolder").style.display = "inline";
		}		
	}

	/* end functions activated by buttons */

	/* help functions */

	$scope.setSelectedTitle = function(value) {
		/* reset color of selected article button */
		if ($scope.haveSelected) {
			document.getElementById('selectButton'+$scope.selected.id).style.color = 'black';
		}
		$scope.haveSelected = false;

        if ($scope.selectedTitle === value) {
            $scope.selectedTitle = undefined;
        } else {
            $scope.selectedTitle = value;
        }
	};
	$scope.byTitle = function(entry){
    	return entry.category === $scope.selectedTitle || $scope.selectedTitle === undefined;
	};    	
	$scope.unHide = function() {
		console.log("unHiding");

		for (item in $scope.keys) {
			console.log(item);
			document.getElementById(item).style.display = "inline";
			document.getElementById(item+"Parent").style.display = "inline";
		}
	}
	$scope.hide   = function(chunk){
		console.log("hidefunction");
		for (item in chunk) {
			// console.log(item);
			console.log(chunk[item]);
			// console.log($scope.keys[item]);
			if( ((chunk[item] == null) || (chunk[item] == '')) && (chunk[item] != '$$hashKey')) {
				document.getElementById(item).style.display = "none";
				document.getElementById(item+"Parent").style.display = "none";
			}
		}
	}
	$scope.showDeleteButton = function(){
		if (document.getElementById("deleteButton").style.display == 'inline')
			document.getElementById("deleteButton").style.display = 'none';
		else 
			document.getElementById("deleteButton").style.display = 'inline';
	}
					











});