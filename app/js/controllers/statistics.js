myApp.controller("StatisticsCtrl", function (
  $scope,
  $state,
  $ionicModal,
  Navigation,
  $ionicPopup,
  $timeout,
  $rootScope
) {
  // $scope.selectedTab = "Statistics";
  $scope.selectedTab = "Photos";
  $scope.statsTabs = function (selectTab) {
    $scope.selectedTab = selectTab;
  };
  $scope.alertPopup = function () {
    var alertPopup = $ionicPopup.show({
      title: "",
      template: "Coming Soon",
      cssClass: "logoutPopup header-close"
    });
    $timeout(function () {
      alertPopup.close();
    }, 1000);
  };
  $scope.getStats = function () {
    Navigation.commonAPICall(
      "User/statisticsPageHeader", {
        user: $.jStorage.get("userInfo")._id
      },
      function (data) {
        if (data.data.value) {
          $scope.statisticsData = data.data.data;
          console.log("Statistics:::", data.data.data);
        }
      }
    );
    Navigation.commonAPICall(
      "Product/statisticPhoto", {
        owner: $.jStorage.get("userInfo")._id
      },
      function (data) {
        if (data.data.value) {
          $scope.PhotoData = data.data.data;
          $scope.interestedData = data.data.data.interested;
          $scope.sampleRequestData = data.data.data.sampleRequest;
          $scope.viewedData = data.data.data.viewed;
          console.log("PhotoData:::", data.data.data);
        }
      }
    );

  }
  $scope.getStats();

  /**See All pop up for image Post requirement */
  $ionicModal
    .fromTemplateUrl("templates/modal/view-modal.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function (modal) {
      $scope.modal = modal;
    });
  $scope.openViewModal = function (listview) {
    $state.go("inner-statistics", {
      type: listview
    })
  };
  /***Gallery End */
  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };
  $rootScope.$on("$stateChangeSuccess", function (
    event,
    toState,
    toParams,
    fromState,
    fromParams
  ) {
    if (toState.name == 'tab.statistics') {
      $scope.getStats();
    }
  });
}).controller("InnerStatisticsCtrl", function (
  $scope,
  $state,
  $ionicModal,
  Navigation,
  $ionicPopup,
  $timeout,
  $rootScope,
  $stateParams
) {
  $scope.getStats = function () {
    Navigation.commonAPICall(
      "User/statisticsPageHeader", {
        user: $.jStorage.get("userInfo")._id
      },
      function (data) {
        if (data.data.value) {
          $scope.statisticsData = data.data.data;
          console.log("Statistics:::", data.data.data);
        }
      }
    );
    Navigation.commonAPICall(
      "Product/statisticPhoto", {
        owner: $.jStorage.get("userInfo")._id
      },
      function (data) {
        if (data.data.value) {
          $scope.PhotoData = data.data.data;
          $scope.interestedData = data.data.data.interested;
          $scope.sampleRequestData = data.data.data.sampleRequest;
          $scope.viewedData = data.data.data.viewed;
          console.log("PhotoData:::", data.data.data);
          $scope.openProduct($stateParams.type)
        }
      }
    );

  }
  $scope.getStats();
  $scope.goToProductDetail = function (productId) {
    $state.go("product-detail", {
      id: $.jStorage.get('userInfo')._id,
      productId: productId
    });
  };
  $scope.openProduct = function (listview) {
    $scope.viewData = {};
    if (listview == "interested") {
      $scope.titleName = "Highest Interested Product";
      $scope.viewData = $scope.interestedData;
      $scope.viewDataChunk = _.chunk($scope.viewData, 3);
      $scope.type = "interested"
    } else if (listview == "sampleRequest") {
      $scope.titleName = "Highest Sample Request";
      $scope.viewData = $scope.sampleRequestData;
      $scope.viewDataChunk = _.chunk($scope.sampleRequestData, 3);
      $scope.type = "sampleRequest"
    } else if (listview == "viewed") {
      $scope.titleName = "Highest Viewed Product";
      $scope.viewData = $scope.viewedData;
      $scope.viewDataChunk = _.chunk($scope.viewedData, 3);
      $scope.type = "viewed"
    } else {
      console.log("no data found");
    }
    // $scope.modal.show();
  };
  /***Gallery End */
  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };
  $rootScope.$on("$stateChangeSuccess", function (
    event,
    toState,
    toParams,
    fromState,
    fromParams
  ) {
    if (toState.name == 'inner-statistics') {
      $scope.getStats();
    }
  });
});
