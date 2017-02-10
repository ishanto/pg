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
 * - tracks number of pages in the blogs
 * - exposes the model to the template and provides event handlers
 */

// angular.module('hosonto',['ngRoute'])
app
		.controller('clientCtrl', ['$scope', '$route', '$filter', function ($scope, $route, $filter) {

			//$scope.blogs__pages = 3;
			$scope.blogs__rows = 10;
			$scope.blogs__pageLimit = 4;
			$scope.getNumber = function(rows, pageLimit) {
					var pages = Math.ceil(rows / pageLimit);
					if (!pages)
						pages = 1;
						//console.log("Inside getNumber"+new Array(num));
					return new Array(pages);

			};
			$scope.blogs__sort="{'_id':1}";

			/*$scope.changePage = function(index){
						 console.log("goto "+(index));
						 $scope.$parent.blogs__currentPage = index;
						//  $scope.$parent.blogs__currentPage.change();
						//  $scope.blogs__currentPage = index;
						//console.log("goto "+($scope.$parent.blogs__currentPage));
						document.getElementById("paging").value = index;
						//location.reload();
						// $route.reload();
						//$scope.$parent.;

						$scope.$parent.pushData('autoLoadData','');
			};*/

			$scope.busyLoadingData = false;

						$scope.unsetBusy = function (){
							$scope.busyLoadingData = false;
						};


			$scope.loadNextScroll = function(){
				if ( $scope.busyLoadingData ||
						($scope.blogs__currentPage == Math.ceil($scope.$parent.blogs__rows/$scope.$parent.blogs__pageLimit)))
						return;

					$scope.busyLoadingData = true;
					 console.log("goto "+($scope.blogs__currentPage)+"::"+$scope.$parent.blogs__rows+"::"+$scope.$parent.blogs__pageLimit);
					document.getElementById("paging").value = Number(document.getElementById("paging").value) +1;

					$scope.pushData('autoLoadData','','',$scope.unsetBusy);

			};


			$scope.fetchPage = function(){
					//	console.log("goto "+($scope.blogs__currentPage));
						//  $scope.$parent.blogs__currentPage = $scope.blogs__currentPage;
						//  $scope.blogs__currentPage = index;
						//  console.log("goto "+($scope.$parent.blogs__currentPage));
						// $scope.pushData('autoLoadData','');
			};




		}]);
