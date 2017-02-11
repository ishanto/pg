angular.module('hosonto',['djds4rce.angular-socialshare'])
.run(function($FB){
  $FB.init('386469651480295');
});

angular.module('hosonto').controller('hosontoCtrl',function($scope,$timeout){

  $timeout(function(){
    $scope.url = 'http://google.com';
    $scope.text = 'testing share';
    $scope.title = 'title1'
  },1000)
  $timeout(function(){
    $scope.url = 'https://www.youtube.com/watch?v=wxkdilIURrU';
    $scope.text = 'testing second share';
    $scope.title = 'title2';
  },1000)

  $scope.callback = function(response){
    console.log(response);
    alert('share callback');
  }
}); 