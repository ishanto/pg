/**
 * @license
 * Everything in this repo is MIT License unless otherwise specified.
 *
 * Copyright (c) Addy Osmani, Sindre Sorhus, Pascal Hartig, Stephen  Sawchuk, Google, Inc., Hosonto MS
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * The controller for client side handling of the app. The controller:
 * - tracks number of event in the todo list
 * - exposes the model to the template and provides event handlers
 */

 //
 // var module = angular.module('hosonto', [])
 // 		.directive('onFinishRender', function ($timeout) {
 // 		return {
 // 				restrict: 'A',
 // 				link: function (scope, element, attr) {
 // 						if (scope.$last === true) {
 // 								$timeout(function () {
 // 										scope.$emit(attr.onFinishRender);
 // 								});
 // 						}
 // 				}
 // 		}
 // });

 //var app = angular.module('hosonto' );
angular.module('hosonto')
.controller('adminClientCtrl', ['$scope','$filter','$http',  function ($scope, $filter, $http) {
		//
		angular.element(document).ready(function () {
	        //$scope.gridOptions.data = $scope.menus;
					console.log("DAAATAAAA="+$scope.gridOptions.data);
					console.log("Parent DAAATAAAA="+$scope.$parent['menus']);

	    });

		$scope.hashMenu = {};
		$scope.buildHashMenu = function (menus){
			for (var i in menus){
				// console.log("i=="+i);
				if (!$scope.hashMenu[menus[i]._id])
					$scope.hashMenu[menus[i]._id] = menus[i];
			}
		};


		$scope.menuMapping = function ( id){

			return $scope.hashMenu[id] ;

		};

		$scope.gridOptions = {
			//data: [{title:'A'},{title:'B'},{title:'C'}],
			onRegisterApi: function (gridApi) {
					$scope.gridApi = gridApi;

					gridApi.edit.on.afterCellEdit($scope,
						function(rowEntity, colDef, newValue, oldValue){
						  //  console.log( 'edited row id:' + JSON.stringify(rowEntity) + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue );
							//console.log("INSIDE AFTER__CELL__EDIT"+rowEntity._id+colDef.name);
							rowEntity._id = $scope.hashMenu[newValue]._id;
							rowEntity.price = $scope.hashMenu[newValue].price;
							//  console.log( 'edited row id:' + JSON.stringify($scope.menus) + ' title:' + rowEntity.title);
							//$scope.gridOptions.columnDefs[0].editDropdownOptionsArray = $scope.menus;

							//$scope.$apply();
							//alert(msg);
						});
			}
		};

		$scope.gridSpecials = {
			//data: [{title:'A'},{title:'B'},{title:'C'}],
			onRegisterApi: function (gridApi) {
					$scope.gridApiSpecial = gridApi;
			}
		};

		$scope.gridApiMenusInOffer	= {};

		$scope.gridMenusInOffer = {
			//data: [{title:'A'},{title:'B'},{title:'C'}],
			onRegisterApi: function (gridApi) {
					$scope.gridApiMenusInOffer = gridApi;
          gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
						if (newValue && newValue!== oldValue){
							rowEntity._id = $scope.hashMenu[newValue]._id;
							rowEntity.price = $scope.hashMenu[newValue].price;
							rowEntity.description = $scope.hashMenu[newValue].description;
							rowEntity.type = $scope.hashMenu[newValue].type;
							rowEntity.img = $scope.hashMenu[newValue].img;
						}
						// console.log('DAAATAAA==='+JSON.stringify($scope.gridMenusInOffer.data));
            console.log( 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue );
            $scope.$apply();
						//alert(msg);
          });
			}
		};


		$scope.addNewMenu = function()
		{
			console.log("current menu="+JSON.stringify($scope.currentMenu));
			$scope.menus.push($scope.currentMenu);
			$scope.pushData('autoSaveData','','',$scope.refreshData);

		};

		$scope.addNewMenuInOffer = function(nos)
		{
			if (!$scope.currentOffer)
				$scope.currentOffer = {};
			if (!$scope.currentOffer.menu)
				$scope.currentOffer.menu=[];
			for (var i =0 ; i< nos; i++)
					$scope.currentOffer.menu.push(JSON.parse(JSON.stringify($scope.menus[0])));
			$scope.gridMenusInOffer.data = $scope.currentOffer.menu;//
			//$scope.apply();
		};

		$scope.initAllData = function(){
			$scope.pushData('autoLoadData','','', $scope.initGridData);
			//console.log("DAAATAAAA="+$scope.menus);
			//console.log("Parent DAAATAAAA="+$scope.$parent.menus);

		};


			$scope.initGridData = function(){

				var newData = $scope.menus;

				$scope.buildHashMenu($scope.menus);
				console.log("Hashmap == "+JSON.stringify($scope.hashMenu));

				// for (var i in newData)
				// 	newData[i]['img'] = {name:'Photo', field:'photoP' ,cellTemplate:"<img src='https://angularjs.org/img/AngularJS-large.png' />"}
        // ],
				//
				// 	'<img src="img/'+newData[i]['img']+'  width="20"/> ';

				$scope.gridOptions = {  };

				$scope.gridOptions.enableSorting= true;

			  $scope.gridOptions.columnDefs = [
			    { name: '_id', enableCellEdit: false, width: '10%' },
			    // { name: 'title', displayName: 'Menu', width: '10%', editDropdownOptionsArray: [{'title':'ABC'}, {'title':'XYZ'}] },
			    { name: 'title', displayName: 'Menu',  width: '10%',editableCellTemplate: 'ui-grid/dropdownEditor',
						//	cellFilterArgs: $scope,
						//  cellFilter: 'mapMenu:grid.appScope',
						//editDropdownOptionsArray: [] ,
						editDropdownIdLabel: '_id',
						editDropdownValueLabel: 'title'},
						// { name: 'title', displayName: 'title' , width: '40%' //,
  						// cellFilterArgs: $scope,
							// cellFilter: 'mapMenu:grid.appScope'
					// },
			    { name: 'price', displayName: 'Price', type: 'Number',  width: '10%'
					},
					{ name: 'img', displayName: 'Image File', width: '20%', editableCellTemplate: 'ui-grid/fileChooserEditor',
			      editFileChooserCallback: $scope.storeFile,
						cellTemplate:"<img width=\"50px\" ng-src=\"img\\{{grid.getCellValue(row, col)}}\" lazy-src>"
					 }
					];



				$scope.gridOptions.data = JSON.parse(JSON.stringify($scope.menus));//newData;

				$scope.gridOptions.columnDefs[1].editDropdownOptionsArray = JSON.parse(JSON.stringify($scope.menus));
				//$scope.gridOptions.data[3].editDropdownOptionsArray = $scope.menus;
				//$scope.$parent.gridOptions.data = $scope.menus;
				console.log("DAAATAAAA="+$scope.menus);


				$scope.gridSpecials.enableSorting= true;

				$scope.gridSpecials.columnDefs = [
					// { name: 'id', enableCellEdit: false, width: '10%' },
					// { name: 'title', displayName: 'Menu', width: '10%', editDropdownOptionsArray: [{'title':'ABC'}, {'title':'XYZ'}] },
					{ name: 'menu.title', displayName: 'Menu', editableCellTemplate: 'ui-grid/dropdownEditor', width: '10%',
					//		 cellFilterArgs: $scope,
						//  cellFilter: 'mapMenu:grid.appScope',
						editDropdownOptionsArray: [] ,
						editDropdownIdLabel: 'title',
						editDropdownValueLabel: 'title'},
						{ name: 'status', displayName: 'Status' , width: '40%' },
					{ name: 'discount', displayName: 'Discount', type: 'Number',  width: '10%' },
					{ name: 'menu.img', displayName: 'Image File', width: '20%',
						cellTemplate:"<img width=\"50px\" ng-src=\"img\\{{grid.getCellValue(row, col)}}\" lazy-src>"
					 }
					];

				$scope.gridSpecials.data = $scope.specials;//newData;
				$scope.gridSpecials.columnDefs[0].editDropdownOptionsArray = $scope.menus;

				$scope.gridMenusInOffer = {};
				$scope.gridMenusInOffer.columnDefs = [
					{ name: '_id', displayName: '_id',  width: '10%' },
					{ name: 'menu.title', displayName: 'Menu', editableCellTemplate: 'ui-grid/dropdownEditor', width: '30%',
							cellFilterArgs: $scope,
						  cellFilter: 'mapMenu:grid.appScope',
						editDropdownOptionsArray: [] ,
						editDropdownIdLabel: 'menu._id',
						editDropdownValueLabel: 'menu.title'
					},
					{ name: 'description',  displayName: 'Description' , width: '40%'
						},
					{ name: 'type', displayName: 'Type',  width: '15%' },
					{ name: 'img', displayName: 'Image File', width: '10%',
						cellTemplate:"<img width=\"50px\" ng-src=\"img\\{{grid.getCellValue(row, col)}}\" lazy-src>"
					},
					{ name: 'price', displayName: 'Price',  width: '15%' }

					];

				// $scope.gridMenusInOffer.data = [new Array(6), new Array(6)];//newData;
				//$scope.gridMenusInOffer.data[0] = JSON.parse(JSON.stringify({'menu':$scope.menus[0]}));//newData;
				$scope.addNewMenuInOffer(2);
				//addNewMenuInOffer();

				$scope.gridMenusInOffer.data = $scope.currentOffer.menu;//
				$scope.gridMenusInOffer.columnDefs[1].editDropdownOptionsArray = JSON.parse(JSON.stringify($scope.menus));


				//console.log("Parent DAAATAAAA="+JSON.stringify(newData));
				//$scope.$parent.gridApi.core.refresh();
				//$scope.gridApi.core.refresh();
				//window.location.reload();
			};



			$scope.currentMenu = null;
			$scope.currentOffer = {};
			$scope.currentCourse = null;
			$scope.selectMenuStatus = [];


			  $scope.storeFile = function( gridRow, gridCol, files ) {
			    // ignore all but the first file, it can only select one anyway
			    // set the filename into this column
			    gridRow.entity.filename = files[0].name;

			    // read the file and set it into a hidden column, which we may do stuff with later
			    var setFile = function(fileContent){
			      gridRow.entity.file = fileContent.currentTarget.result;
			      // put it on scope so we can display it - you'd probably do something else with it
			      $scope.lastFile = fileContent.currentTarget.result;
			      $scope.$apply();
			    };
			    var reader = new FileReader();
			    reader.onload = setFile;
			    reader.readAsText( files[0] );
			  };
				//
				// $scope.gridOptions.columnDefs = [
				//     { name: 'id', enableCellEdit: false, width: '10%' },
				//     { name: 'name', displayName: 'Name (editable)', width: '20%' },
				//     { name: 'age', displayName: 'Age' , type: 'number', width: '10%' },
				//     { name: 'gender', displayName: 'Gender', editableCellTemplate: 'ui-grid/dropdownEditor', width: '20%',
				//        editDropdownValueLabel: 'gender', editDropdownOptionsArray: [
				//       { id: 1, gender: 'male' },
				//       { id: 2, gender: 'female' }
				//     ] },
				//     { name: 'registered', displayName: 'Registered' , type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '20%' },
				//     { name: 'address', displayName: 'Address', type: 'object', width: '30%' },
				//     { name: 'address.city', displayName: 'Address (even rows editable)', width: '20%',
				//          cellEditableCondition: function($scope){
				//          return $scope.rowRenderIndex%2
				//          }
				//     },
				//     { name: 'isActive', displayName: 'Active', type: 'boolean', width: '10%' },
				//     { name: 'pet', displayName: 'Pet', width: '20%', editableCellTemplate: 'ui-grid/dropdownEditor',
				//       editDropdownRowEntityOptionsArrayPath: 'foo.bar[0].options', editDropdownIdLabel: 'value'
				//     },
				//     { name: 'filename', displayName: 'File', width: '20%', editableCellTemplate: 'ui-grid/fileChooserEditor',
				//       editFileChooserCallback: $scope.storeFile }
				//   ];

			//  $scope.msg = {};
			//
			//  $scope.gridOptions.onRegisterApi = function(gridApi){
			//           //set gridApi on scope
			//           $scope.gridApi = gridApi;
			//           gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
			//             $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
			//             $scope.$apply();
			//           });
      // };
			//
			// $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
		  //   .success(function(data) {
		  //     for(i = 0; i < data.length; i++){
		  //       data[i].registered = new Date(data[i].registered);
		  //       if (i % 2) {
		  //         data[i].pet = 'fish'
		  //         data[i].foo = {bar: [{baz: 2, options: [{value: 'fish'}, {value: 'hamster'}]}]}
		  //       }
		  //       else {
		  //         data[i].pet = 'dog'
		  //         data[i].foo = {bar: [{baz: 2, options: [{value: 'dog'}, {value: 'cat'}]}]}
		  //       }
		  //     }
		  //     $scope.gridOptions.data = data;
			// 		console.log('DDDAAATTTAAA-='+data)
		  //   });





			$scope.menuSelected = function(menu) {
				$scope.currentMenu=menu;
				document.getElementById('btnMenuCancel').click();
				document.getElementById('tab_menu_details').click();

			};


			$scope.courseSelected = function(course) {
				$scope.currentCourse=course;
				document.getElementById('btnCourseCancel').click();
				document.getElementById('tab_course_details').click();

			};


			$scope.offerSelected = function(offer) {

				// console.log('Inside offer select');
				$scope.gridOptions.data= JSON.parse(JSON.stringify($scope.menus));
				$scope.gridOptions.columnDefs[0].editDropdownOptionsArray =  JSON.parse(JSON.stringify($scope.menus));

				$scope.currentOffer=offer;
				document.getElementById('btnOfferCancel').click();
				document.getElementById('tab_offer_details').click();

			};

			$scope.courseSelected = function(course) {

				// console.log('Inside course select');
				$scope.currentCourse=course;
				document.getElementById('btnCourseCancel').click();
				document.getElementById('tab_course_details').click();

			};

			$scope.refreshData = function ()
			{
				$scope.pushData('autoLoadData','','');
			}

			$scope.removeSelected = function(table, index){
				table[index].isDeleted = true;
				$scope.pushData('autoSaveData','','',$scope.refreshData);

			};

			$scope.removeSelectedMenuFromOffer = function( index){
				$scope.currentOffer.menu.slice(index, 1);
				// $scope.pushData('autoSaveData','','',$scope.refreshData);

			};


			$scope.updateOfferMenu = function(menu, index){

								// productQty.product = prod;
								// productQty.quantity = 1;
								$scope.currentOffer.menu[index]=menu;

								//console.log(JSON.stringify($scope.currentOffer.menu));
								//$scope.PD = {};
						};


		}])
		.filter('mapMenu', function() {

			// var mapHash = {1:"Spring Veg & Pasta",
			// 2:"Spring Roll",
			// 3:"Onion",
			// 4:"Special dessert"};

							  return function(input, scope) {
									 if (!input) return '';
									return scope.hashMenu[input];

							  };
							})
							;
