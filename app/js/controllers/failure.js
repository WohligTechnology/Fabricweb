myApp.controller("FailureCtrl", function($scope, $state,$timeout) {
    $scope.goBackHandler = function() {
      Navigation.gobackHandler(); //This works
    };

    $timeout(function () {
        var goto;
        if ($.jStorage.get('userInfo').isSeller && $.jStorage.get('userInfo').isTextile) {
          goto = "category";
        } else if ($.jStorage.get('userInfo').isSeller && $.jStorage.get('userInfo').isAccessories) {
          goto = "accessory";
        } else if ($.jStorage.get('userInfo').isBuyer) {
          //ionicToast.show("Buyer Section Inactive", 'middle');
          console.log("Buyer category goto");
          goto = "buyer-category";
        }
        if (!$.jStorage.get('userInfo').isBuyer) {
          $state.go(goto, {
            id: $.jStorage.get('userInfo')._id
          });
        } else {
          $state.go(goto, {
            id: $.jStorage.get('userInfo')._id
          });
        }
      }, 3000);
  });