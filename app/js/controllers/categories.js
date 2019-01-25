myApp.controller('CategoriesCtrl', function ($scope, $stateParams, $state, $rootScope, Navigation, $ionicModal, $ionicActionSheet, $rootScope) {

  if (_.isEmpty($stateParams.id) || $stateParams.id == undefined) {
    $stateParams.id = $.jStorage.get("UserId");
  }
  $scope.getCollection = function () {
    if ($stateParams.id) {
      Navigation.commonAPICall("User/Collection", {
        user: $stateParams.id
      }, function (collectionData) {

        if (collectionData.data.value) {
          console.log("Collection Api returned value::", collectionData.data.data);
          $scope.collection = collectionData.data.data;
        }
      });
    }
  }
  $scope.getCollection();

  /**For getting similar product detail on this page */
  $scope.goToBuyerProductDetail = function (productId) {
    console.log("goToBuyerProductDetail");
    $state.go("buyer-product-detail", {
      id: $stateParams.id,
      productId: productId
    });
  };
  $rootScope.$on("getCollection", function (event, data) {
    $scope.getCollection();
  })

  $scope.favData = {
    type: "",
    user: $stateParams.id
  }

  $scope.getAllFavourites = function (type) {
    if (type == 'favourite') {
      $scope.favData.type = type;
      $state.go("favourites", {
        id: $stateParams.id,
        type: $scope.favData.type
      });
    }
    if (type == 'interested') {
      $scope.favData.type = type;
      $state.go("interested", {
        id: $stateParams.id,
        type: $scope.favData.type
      });
    }
    if (type == 'sampleRequest') {
      $scope.favData.type = type;
      $state.go("sample-request", {
        id: $stateParams.id,
        type: $scope.favData.type
      });
    }
  }

  $rootScope.$on("$stateChangeSuccess", function (
    event,
    toState,
    toParams,
    fromState,
    fromParams
  ) {
    if (toState.name == 'tab.collection') {
      $scope.getCollection();
    }
  });
})
