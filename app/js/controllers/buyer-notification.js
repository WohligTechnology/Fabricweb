myApp.controller("BuyerNotificationCtrl", function (
  $scope,
  $ionicModal,
  $stateParams,
  $ionicHistory,
  Navigation,
  $state
) {

  $scope.notificationList = [];
  $scope.currentPage = 1;
  // $scope.loadData = function () {
  //   Navigation.commonAPICall("Notification/viewNotification", {
  //     user: $.jStorage.get('userInfo')
  //   }, function (data) {
  //     if (data.data.value) {
  //       console.log("Read NOtifications:::", data);
  //     }
  //   });
  // }
  // $scope.loadData();
  // if ($stateParams.innerTab != "") {
  //   $scope.selectedTab = $stateParams.innerTab;
  // } else {
  //   $scope.selectedTab = "General";
  // }
  $scope.getNotification = function (notificationType) {
    if (!$scope.notificationLoading) {
      $scope.notificationLoading = true;
      $scope.notificationType = notificationType;
      $scope.notificationData = {
        user: $.jStorage.get('userInfo'),
        page: $scope.currentPage++,
        notificationType: notificationType
      }
      Navigation.commonAPIWithoutLoader("Notification/notificationList", $scope.notificationData, function (data) {
        $scope.notificationLoading = false;
        if (data.data.value) {
          if (_.isEmpty(data.data.data)) {
            $scope.notificationLoaded = true;
          } else {
            $scope.notificationList = _.concat($scope.notificationList, data.data.data);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      })
    }
  }
  var mySocket = io.sails.connect(adminSocket);
  mySocket.on("Notification_" + $.jStorage.get("userInfo")._id, function onConnect(data) {
    console.log("Notification_", data);
    if (data.notificationType == 'Request' && ($scope.selectedTab == 'Sample' || $scope.selectedTab == 'General')) {
      $scope.notificationList.unshift(data);
    } else if ($scope.selectedTab == 'General') {
      $scope.notificationList.unshift(data);
    }
  });
  $scope.notiTabs = function (selectedTabs) {
    $scope.currentPage = 1;
    $scope.notificationList = [];
    $scope.selectedTab = selectedTabs;
    $stateParams.innerTab = selectedTabs;
    switch (selectedTabs) {
      case 'General':
        $state.go($state.current, {
          innerTab: selectedTabs
        }, {
          notify: false
        })
        $scope.getNotification(['Request', 'Follow', 'Like', "Fav", "Interested", "PostRequirement", "Block"]);
        break;
      case 'Sample':
        $state.go($state.current, {
          innerTab: selectedTabs
        }, {
          notify: false
        })
        $scope.getNotification(['Request']);
        break;
      case 'Following':
        $state.go($state.current, {
          innerTab: selectedTabs
        }, {
          notify: false
        })
        $scope.getNotification(['Follow']);
        break;
      default:
        break;
    }
  };
  $scope.notiTabs($stateParams.innerTab ?
    $stateParams.innerTab :
    "General");

  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };
  $ionicModal
    .fromTemplateUrl("templates/modal/seller-profile-modal.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function (modal) {
      $scope.sellerProfileModal = modal;
    });
  $scope.opensellerProfileModal = function () {
    $scope.sellerProfileModal.show();
  };

  $scope.closeSellerProfileModal = function () {
    $scope.sellerProfileModal.hide();
  };
  $ionicModal
    .fromTemplateUrl("templates/modal/toggle-notification.html", {
      scope: $scope,
      animation: "slide-left-right"
    })
    .then(function (modal) {
      $scope.togglenotificationModal = modal;
    });
  $scope.opentogglenotificationModal = function () {
    $scope.togglenotificationModal.show();
  };
  $scope.closetogglenotificationModal = function () {
    $scope.togglenotificationModal.hide();
  };


  // $scope.notificationData = {
  //   user: $.jStorage.get('userInfo'),
  //   page: 1,
  //   notificationType: ['Request', 'Follow', 'Like', "Fav", "Interested"]
  // }
  // Navigation.commonAPIWithoutLoader("Notification/notificationList", $scope.notificationData, function (data) {
  //   if (data.data.value) {
  //     $scope.Notifications = data.data.data;
  //   }
  // })


  // $scope.getNotification(['Request', 'Follow', 'Like', "Fav", "Interested"]);

  $scope.loadMore = function () {
    $scope.getNotification($scope.notificationType);
  }
});
