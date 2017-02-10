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

angular.module('hosonto')
		.controller('pageCtrl', ['$scope', '$location', '$filter', 'Upload', '$timeout', function ($scope, $location, $filter, Upload, $timeout) {

		//	$scope.transactions	= null;
		if (document.getElementById("user_id"))
			$scope.user_id =  document.getElementById("user_id").value = $location.search()['user_id'];
		  // $scope.customers_FIELD__id = document.getElementById("customer_id").value ;

			if (document.getElementById("customer_id")){
			  if($location.search()['user_id']!=null && $location.search()['user_id']!=undefined &&
					$location.search()['user_id']!=""){
					$scope.customers_FIELD__id = document.getElementById("user_id").value ;
					$scope.transactions_FIELD_customer_id = document.getElementById("user_id").value ;
				}else{
					$scope.customers_FIELD__id = document.getElementById("customer_id").value ;
					$scope.transactions_FIELD_customer_id = document.getElementById("customer_id").value ;

				}

			}

			if (document.getElementById("promotions_search"))
				$scope.$promotions_search = '{"dt_end":{"$gte":"' + new Date()+ '"}, "dt_start":{"$lte":"'+new Date()+'"} } ';

			// console.log("SESSSION USER"+JSON.stringify($scope.$parent.session_user)+"::"+JSON.stringify($scope.session_user));
			if (document.getElementById("customers_of_this_store") && $scope.$parent.session_user)
					document.getElementById("customers_of_this_store").value = '{"stores":{$elemMatch:{"store._id":"'+$scope.$parent.session_user._id+'"}}}';

			$scope.qr_version = 5 ;
			$scope.qr_size = 300 ;
			$scope.qr_correction ='quartile' ;

			 $scope.$parent.transactions__currentPage = 1;
			// $scope.newCommentUser = null;
			// $scope.newComment = null;
			//
			// $scope.setCommentScope = function(parentId, user, comment){
			// 		// console.log("REPLYYYY");
			// 		$scope.newCommentParentId=parentId;
			// 		$scope.newCommentUser = user;
			// 		$scope.newComment = comment;
			//
			// };

			$scope.callback = function(){
				alert('Successful');
				return false;// prevents form resubmission
			}

			$scope.hideCustSearch	= function(){
					$scope.$parent.custSearchResults = [];
			}

			$scope.addAdmin = function(cust_search){
				//$scope.customers[0].admins.push(cust_search);
				$scope.$parent.custSearchResults = cust_search;
				$scope.pushData('hosonto_wrapper','executeEvent','BL.addAdmin');
				$scope.hideCustSearch();
			}

			$scope.removeAdmin = function(index){
				//$scope.customers[0].admins.splice(index, 1);
				$scope.$parent.custSearchResults = $scope.$parent.customers[0].admins[index];
				$scope.pushData('hosonto_wrapper','executeEvent','BL.removeAdmin');
				//$scope.pushData('hosonto_wrapper','autoSaveData','');
			}



			$scope.selectCustomer = function(customer){
				document.getElementById('customer_mobile').value = customer.mobile[0];
				$scope.$parent.user_id= customer._id;
				$scope.hideCustSearch();
			}

			$scope.hideStoreSearch	= function(){
				$scope.$parent.storeSearchResults = [];
			}

			$scope.addStore	= function(store){
				$scope.customers[0].stores.push({"store":store, "points":0, "dt_joined":new Date()});
				$scope.hideStoreSearch();

			}

			$scope.removeStore = function(index){
				$scope.customers[0].stores.splice(index, 1);
			}

			$scope.findStorePoints = function(target_store_id, customer){

				console.log("inside findStore"+JSON.stringify(customer)+target_store_id);
				for(var i=0;i<customer.stores.length; i++)
				{
					if (customer.stores[i].store && customer.stores[i].store._id==(target_store_id))
						if (customer.stores[i].points > 0)
							return customer.stores[i].points ;
						else {
							return 0;
						}
				}
				return 0;
			}

			$scope.checkLogin = function(){

				//alert("ins cannot be empty.");
				var checkSuccessful = false, msg = [];
				if ($scope.login__error.length >0){
					alert('Some error occurred, please try again.')
				}else{
					alert('redirecting...');
					$window.location.href = '/menu';
				}

			}

			$scope.checkEntry = function(){

				//alert("ins cannot be empty.");
				var checkSuccessful = true, msg = [];
				if (!$scope.reg_name.length){
					checkSuccessful = false;
					msg.push("User cannot be empty.");
				//	angular.element('#reg_name').focus();

				}
				if (!$scope.reg_mobile.length && !$scope.reg_email.length){
					checkSuccessful = false;
					msg.push("Both mobile or email cannot be empty.");
				}

				return
				//pushData('executeEvent','BL.register','');
			}

			$scope.checkPasswords = function(){
				$scope.password__error = [];
				if (!$scope.upd_password.length){
					foundError = true;
					$scope.password__error.push("Password cannot be empty.");
				}
					if ($scope.upd_password===$scope.upd_password2){
						$scope.pushData(null,'executeEvent','BL.updatePassword','');
					//return true;
				}else {
						$scope.password__error.push('Passwords don\'t match, Please try again.');
						return false;

					}
			}

			this.busyLoadingData = true;

									this.unsetBusy = $scope.unsetBusy = function (){
										$scope.busyLoadingData = false;
									};


						this.loadNextTxs = function(){
							document.getElementById("append_page").value = 1;
							if ( $scope.busyLoadingData ||
									($scope.$parent.transactions__currentPage >= Math.ceil($scope.$parent.transactions__rows/$scope.$parent.transactions__pageLimit)))
									return;

								$scope.busyLoadingData = true;
								 console.log("goto "+($scope.$parent.transactions__currentPage)+"::"+$scope.$parent.transactions__rows+"::"+$scope.$parent.transactions__pageLimit);
								document.getElementById("paging").value = Number(document.getElementById("paging").value) +1;

								$scope.pushData('hosonto_wrapper','autoLoadData','','',$scope.unsetBusy);

						};


						$scope.fetchPage = function(){
								//	console.log("goto "+($scope.blogs__currentPage));
									//  $scope.$parent.blogs__currentPage = $scope.blogs__currentPage;
									//  $scope.blogs__currentPage = index;
									//  console.log("goto "+($scope.$parent.blogs__currentPage));
									// $scope.pushData('autoLoadData','');
						};

			// document.getElementById("customer_id").value = $scope.session_user;
			//$scope.customers_FIELD__id = $scope.session_user;



			// upload later on form submit or something similar
		     $scope.submit = function(files) {
					 console.log("Clicked submit"+$scope.files +"::"+files);
		       if ( files) {
						 $scope.upload(files);
		       }
		     };

			$scope.$watch('files', function () {
			        $scope.upload($scope.files);
			    });
			    $scope.$watch('file', function () {
			        if ($scope.file != null) {
			            $scope.files = [$scope.file];
			        }
			    });
			    $scope.log = '';

			    $scope.upload = function (files) {
							console.log("inside uplaod"+JSON.stringify(files));
			        if (files && files.length) {
									$scope.progressPercentage = {};
									$scope.progressVisible = {};
									var uploadCompleted = 0;
									for (var i = 0; i < files.length; i++) {

									  var file = files[i];
										$scope.progressVisible[file.name] = true;
			              if (!file.$error) {
			                var upload = Upload.upload({
			                    url: '/fileupload',
													// uploadPath : '/assets/videos/ab/'+$scope.session_user,
			                    data: {
			                      username: $scope.session_user,
			                      file: file,
														info: file.title
			                    }
			                });

											var duration = 0;
											Upload.mediaDuration(file)
												.then(function(durationInSeconds){
													console.log('duration'+durationInSeconds);
													duration = durationInSeconds;
												});

											upload.then(function (resp) {
													//successfully uploaded
													console.log ( 'completed file: ' +
													resp.config.data.file.name +
													', Response: ' + JSON.stringify(resp.data) +
													'\n' );
													// if (!files[resp.config.data.file.index])
													// 	files[resp.config.data.file.index] = {};
													// if (!files[resp.config.data.file.index]['file_links'])
													// 	files[resp.config.data.file.index]['file_links'] = [];
													parsedFile = resp.data.match(/[^\\/]+$/)[0];
													//files[resp.config.data.file.index]['file_links'].push( resp.data);
													console.log(JSON.stringify(files));
													$scope.customers[0].avatar = parsedFile;
													// $scope.vlogs.push({'title':files[resp.config.data.file.index].title,
													// 									'description':files[resp.config.data.file.index].description,
													// 									'category':files[resp.config.data.file.index].category,
													// 									'tags':files[resp.config.data.file.index].tags,
													// 									'file_links':[parsedFile],
													// 									'username':$scope.session_user,
													// 									'thumbnail':parsedFile.slice(0, parsedFile.lastIndexOf("."))+".png",
													// 									'duration':duration, //files[resp.config.data.file.index].$ngFduration,
													// 									'is_published':false
													// 									});
													uploadCompleted++;
													if (uploadCompleted == files.length){
														//$scope.vlogs = [];
														// $scope.vlogs = $scope.vlogs.concat(files);
														// console.log("sending :: "+JSON.stringify($scope.vlogs))
														//$scope.pushData('upload_content','executeEvent', 'BL.continue','',alert('Thanks for your submission. It will soon be published after review of the content.'));
													}
													$timeout(function() {
														$scope.progressVisible[resp.config.data.file.name] = false;
			                        console.log ( 'file: ' +
			                        resp.config.data.file.name +
			                        ', Response: ' + JSON.stringify(resp.config.data) +
															JSON.stringify(resp.config.data.file)
															+ JSON.stringify(resp.data) +
			                        '\n' );
			                    });
			                }, function(err,res){console.log("upload err::"+JSON.stringify(angular.toJson(err))+"::"+res);}, function (evt) {
			                    $scope.progressPercentage[evt.config.data.file.name] = parseInt(100.0 *
			                    		evt.loaded / evt.total);

															if ($scope.progressPercentage[evt.config.data.file.name] == 100)
															console.log ( 'completed 100% file: ' //+JSON.stringify(evt.config.data) +
															+ JSON.stringify(evt.data) +
															+ evt.config.data.info +
															', Response: ' + JSON.stringify(evt.config.data.file) +
															'\n' );
			                    // $scope.log = 'progress: ' + progressPercentage +
			                    // 	'% ' + evt.config.data.file.name + '\n' +
			                    //   $scope.log;
			                });

											upload.catch(function(err,res){console.log("catch upload err::"+(err));});
											upload.finally(function (err,res){console.log("uploadsucc::"+err+res);});

			              }
			            }
			        }
			    };

		}])
		.config(function($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
});
