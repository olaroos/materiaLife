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


angularApp.controller('angularController', function($scope, $http){
	
	$http.post('./getData.php', {'category' :'notes'} ).success(function(data){
		$scope.chunks = data;
		
		var uniqueCategories = {};

		for (var item in data) {
			if (!uniqueCategories.hasOwnProperty(data[item]['category'])){
				uniqueCategories[data[item]['category']] = data[item]['category'];
			}
		}

		$scope.out = {};

		for (var item in uniqueCategories) {
			console.log(item);
			$scope.out[item] = [];
			for (var dataItem in data) {
				if (data[dataItem]['category'] == item) {				
					$scope.out[item].push(data[dataItem]);
				}
			}
		}			

		console.log($scope.out);
		
	});	

	$scope.setSelectedTitle = function (value) {
        if ($scope.selectedTitle === value) {
            $scope.selectedTitle = undefined;
        } else {
            $scope.selectedTitle = value;
        }
	};
	$scope.byTitle = function(entry){
    	return entry.category === $scope.selectedTitle || $scope.selectedTitle === undefined;
	};    
	$scope.select = function(chunk){
		$scope.selected = chunk;
	};

	$scope.update = function(){
		
		// console.log("");
		// console.log($scope.selected);
		// console.log("");
	
		var toWrite 	= {};
		
		for (var item in $scope.selected){
			if (item !== '$$hashKey') {
				if ($scope.selected[item] !== null)
					toWrite[item] = '';
				else 
					toWrite[item] = 'null';	
			}		
		}		
		
		var container 	= document.getElementById('middleRightRight');
		var child 		= container.firstChild;
		
		while(child){
			if ( (child.value !== '') && (child.value !== undefined) ) {
				toWrite[child.id] = child.value;				
			}
			child = child.nextSibling;				
		}

		console.log(toWrite);
		// var toWriteJSON  = JSON.stringify(toWrite);
		
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

		$http.post('./pushData.php', {'category' : toWrite["category"], 'description' : toWrite['description'], 'place' : toWrite['place'], 'relation' : toWrite['relation'], 'title' : toWrite['title'], 'bestbefore' : toWrite['bestbefore'], 'borrowedfrom' : toWrite['borrowedfrom'], 'subinfo' : toWrite['subinfo'], 'author' : toWrite['author'], 'quantity' : toWrite['quantity'], 'id' : toWrite['id'] } ).success(function(data){
			console.log(data);		
		});


		// $http.post('./pushData.php', {'category' :'notes'} ).success(function(data){
		// console.log(container);
		// console.log(container.getChildren());
	}











});