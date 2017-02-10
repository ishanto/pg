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
// angular.module('hosonto',['ngRoute'])
app
.controller('adminClientCtrl', ['$scope','$filter','$http', '$route', '$document', function ($scope, $filter, $http, $route, $document) {
		//
		angular.element(document).ready(function () {
	        $scope.gridOptions.data = $scope.menus;
					console.log("DAAATAAAA="+$scope['menus']);
					console.log("Parent DAAATAAAA="+$scope.$parent['menus']);

	    });


			$scope.blogs__pageLimit = 4;
			$scope.getNumber = function(rows, pageLimit) {
					var pages = Math.ceil(rows / pageLimit);
					if (!pages)
						pages = 1;
						//console.log("Inside getNumber"+new Array(num));
					return new Array(pages);

			};

			$scope.getAggregate = function() {
				var aggregateStr = '[{"$match":{"comments.isPublished":"false"}, "$group":{new_comments: {"$sum":"1"}}}]';
				console.log("BI str "+($scope.$parent.blogs__bi)+" val="+aggregateStr);
				document.getElementById("bi").value = aggregateStr;
			};

			// $scope.blogs__sort="{'_id':1}";
			$scope.searchBlog = function(){
						//'{"title":{"$regex":".*'+$scope.searchStr+'.*", "$options": "i"}}';//
						$scope.changePage(1);
						var searchStr = '{"$or":[{"title":{"$regex":".*'+$scope.searchStr+'.*", "$options": "i"}},{"content":{"$regex":".*'+$scope.searchStr+'.*", "$options": "i"}}]}';
						console.log("search str "+($scope.$parent.blogs__search)+" val="+searchStr);
						document.getElementById("searching").value = searchStr;
						//  = searchStr;
						$scope.$parent.pushData('autoLoadData','');
			};

			// $scope.blogs__sort="{'_id':1}";
			$scope.changePage = function(index){
						// console.log("goto "+($scope.blogs__currentPage));
						 $scope.$parent.blogs__currentPage = index;
						//  $scope.$parent.blogs__currentPage.change();
						//  $scope.blogs__currentPage = index;
						//console.log("goto "+($scope.$parent.blogs__currentPage));
						document.getElementById("paging").value = index;
						//location.reload();
						// $route.reload();
						//$scope.$parent.;
						$scope.$parent.pushData('autoLoadData','');
			};


			$scope.currentMenu = null;
			$scope.currentOffer = null;
			$scope.currentCourse = null;
			$scope.selectMenuStatus = [];
			$scope.sendSuccessful=false;

			$scope.gridOptions = {  };

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

				$scope.setFiles = function(element) {
				      console.log('files:', element.files);
						};

				$scope.addImage = function(event){


	  			// var f = $document[0].getElementById('file').files;
					 var f = event.target.files[0];
					var fileName = f.name.split('/');
					console.log("upload file"+JSON.stringify(fileName));

					$scope.newBlogImage = fileName[fileName.length-1];
					$scope.sendSuccessful=false;

					function uploadProgress(evt) {
			         $scope.$apply(function(){
			             if (evt.lengthComputable) {
			                 $scope.progress = Math.round(evt.loaded * 100 / evt.total);
			             } else {
			                 $scope.progress = 'unable to compute';
			             }
			         })
			     }

			     function uploadComplete(evt) {
			         /* This event is raised when the server send back a response */
			        //  alert(evt.target.responseText);
							 $scope.sendSuccessful=true;
							//  alert($scope.newBlogImage);
							 $scope.$apply();
			     }

			     function uploadFailed(evt) {
			         alert("There was an error attempting to upload the file.");
			     }

			     function uploadCanceled(evt) {
			         $scope.$apply(function(){
			             $scope.progressVisible = false;
			         })
			         alert("The upload has been canceled by the user or the browser dropped the connection.");
			     }

					var r = new FileReader();
	  			r.onloadend = function(e){
	    			var data = e.target.result;
						// var blob = new Blob([data]);//, {type: 'image/jpeg'});
						var xhr = new XMLHttpRequest();
						xhr.upload.addEventListener("progress", uploadProgress, false);
        		xhr.addEventListener("load", uploadComplete, false);
        		xhr.addEventListener("error", uploadFailed, false);
        		xhr.addEventListener("abort", uploadCanceled, false);
        		xhr.open("POST", "/fileupload");
						xhr.setRequestHeader("X-File-Name", $scope.newBlogImage);
						// xhr.setRequestHeader("ContentType", 'multipart/form-data');
						// xhr.setContentType('"X-www-form-urlencoded')
						$scope.progressVisible = true;
						// var fd = new FormData();
						// fd.append('data',data);
						//var body = {"fileName":$scope.newBlogImage, "fileData":data};
						//console.log("XHR="+JSON.stringify(xhr));
        		xhr.send(data);
	  			};
	  			r.readAsDataURL(f);
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

				$scope.gridOptions.enableSorting= true;

			  $scope.gridOptions.columnDefs = [
			    // { name: 'id', enableCellEdit: false, width: '10%' },
			    // { name: 'title', displayName: 'Menu', width: '10%', editDropdownOptionsArray: [{'title':'ABC'}, {'title':'XYZ'}] },
			    { name: 'title', displayName: 'Menu', editableCellTemplate: 'ui-grid/dropdownEditor', width: '10%',
							 cellFilterArgs: $scope,
						//  cellFilter: 'mapMenu:grid.appScope',
						editDropdownOptionsArray: [] ,
						editDropdownIdLabel: 'title',
						editDropdownValueLabel: 'title'},
						{ name: 'description', displayName: 'Description' , width: '40%' },
			    { name: 'price', displayName: 'Price', type: 'Number',  width: '10%' },
					{ name: 'img', displayName: 'Image File', width: '20%', editableCellTemplate: 'ui-grid/fileChooserEditor',
			      editFileChooserCallback: $scope.storeFile }
					];


			$scope.gridOptions.data = [];

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

			$scope.offerSelected = function(offer) {

				// console.log('Inside offer select');
				$scope.gridOptions.data= $scope.menus.slice();
				$scope.gridOptions.columnDefs[0].editDropdownOptionsArray =  $scope.menus.slice();

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

			$scope.removeSelectedMenuFromOffer = function(index){
				$scope.currentOffer.menu.splice(index,1);
			};

			$scope.addNewMenuInOffer = function()
			{
				$scope.currentOffer.menu.push({});
			};

			$scope.updateOfferMenu = function(menu, index){

								// productQty.product = prod;
								// productQty.quantity = 1;
								$scope.currentOffer.menu[index]=menu;

								//console.log(JSON.stringify($scope.currentOffer.menu));
								//$scope.PD = {};
						};


		}])
		.directive('fileInput', function() {
		  return {
		    restrict: 'A',
		    link: function (scope, element, attrs) {
		      var onChangeHandler = scope.$eval(attrs.fileInput);
		      element.bind('change', onChangeHandler);
		    }
		  };
		})
// 		.directive("fileread", [function () {
//     return {
//         scope: {
//             fileread: "="
//         },
//         link: function (scope, element, attributes) {
//             element.bind("change", function (changeEvent) {
//                 var reader = new FileReader();
//                 reader.onload = function (loadEvent) {
//                     scope.$apply(function () {
//                         scope.fileread = loadEvent.target.result;
//                     });
//                 }
//                 reader.readAsDataURL(changeEvent.target.files[0]);
//             });
//         }
//     }
// }])
		.filter('mapMenu', function() {

			// var mapHash = {1:"Spring Veg & Pasta",
			// 2:"Spring Roll",
			// 3:"Onion",
			// 4:"Special dessert"};

							  return function(input, scope) {
									var mapHash = {
									  };

										var  i = 1;
										for (p in scope.menus)
											mapHash[p._id] = p.title;

									console.log("SCOPE+++"+JSON.stringify(input));
									return mapHash[input];

							  };
							})
							;
