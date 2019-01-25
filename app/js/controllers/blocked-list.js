myApp.controller("BlockedListCtrl", function ($scope, $state, Navigation) {

  $scope.getBlockedUsers = function () {
    Navigation.commonAPIWithoutLoader("BlockList/getBlockedList", {
      user: $.jStorage.get('userInfo')._id,
      page: 1
    }, function (data) {
      if (data.data.value) {
        console.log("datatatata", data.data.data);
        $scope.BlockedList = data.data.data;
      }
    });
  }
  $scope.getBlockedUsers();
  $scope.unBlockUser = function (userId) {
    Navigation.commonAPICall("BlockList/unblockUser", {
      blockedBy: $.jStorage.get('userInfo')._id,
      blockedTo: userId
    }, function (data) {
      $scope.getBlockedUsers();
      console.log("UnBlock", data);
    })
  }
  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };
});
