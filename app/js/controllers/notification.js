myApp.controller("NotificationCtrl", function(
  $scope,
  $ionicModal,
  $stateParams,
  $state,
  $ionicSlideBoxDelegate,
  Navigation,
  ionicToast,
  $ionicPopup,
  $rootScope
) {
  $scope.notificationList = [];
  $scope.currentPage = 1;
  // $scope.loadData = function () {
  //   Navigation.commonAPICall(
  //     "Notification/viewNotification", {
  //       user: $.jStorage.get("userInfo")
  //     },
  //     function (data) {
  //       if (data.data.value) {
  //         console.log("Read NOtifications:::", data);
  //       }
  //     }
  //   );
  // };
  // $scope.loadData();
  $scope.notiTabs = function(selectedTabs) {
    $scope.currentPage = 1;
    $scope.notificationList = [];
    $scope.selectedTab = selectedTabs;
    switch (selectedTabs) {
      case "General":
        $state.go(
          $state.current,
          {
            innerTab: selectedTabs
          },
          {
            notify: false
          }
        );
        $scope.getNotification([
          "Request",
          "Follow",
          "Like",
          "Fav",
          "Interested",
          "PostRequirement"
        ]);
        break;
      case "Sample":
        $state.go(
          $state.current,
          {
            innerTab: selectedTabs
          },
          {
            notify: false
          }
        );
        $scope.getNotification(["Request"]);
        break;
      case "Following":
        $state.go(
          $state.current,
          {
            innerTab: selectedTabs
          },
          {
            notify: false
          }
        );
        $scope.getNotification(["Follow"]);
        break;
      case "Interested":
        $state.go(
          $state.current,
          {
            innerTab: selectedTabs
          },
          {
            notify: false
          }
        );
        $scope.getNotification(["Interested"]);
        break;
      default:
        break;
    }
  };
  var mySocket = io.sails.connect(adminSocket);
  mySocket.on(
    "Notification_" + $.jStorage.get("userInfo")._id,
    function onConnect(data) {
      console.log("Notification_", data);
      if (
        data.notificationType == "Request" &&
        ($scope.selectedTab == "Sample" || $scope.selectedTab == "General")
      ) {
        $scope.notificationList.unshift(data);
      } else if (
        data.notificationType == "Follow" &&
        ($scope.selectedTab == "Following" || $scope.selectedTab == "General")
      ) {
        $scope.notificationList.unshift(data);
      } else if (
        data.notificationType == "Interested" &&
        ($scope.selectedTab == "Interested" || $scope.selectedTab == "General")
      ) {
        $scope.notificationList.unshift(data);
      } else if ($scope.selectedTab == "General") {
        $scope.notificationList.unshift(data);
      }
    }
  );
  $scope.getNotification = function(notificationType) {
    if (!$scope.notificationLoading) {
      $scope.notificationLoading = true;
      $scope.notificationType = notificationType;
      $scope.notificationData = {
        user: $.jStorage.get("userInfo"),
        page: $scope.currentPage++,
        notificationType: notificationType
      };
      if ($scope.notificationData.page == 1) {
        $scope.notificationList = [];
      }
      Navigation.commonAPIWithoutLoader(
        "Notification/notificationList",
        $scope.notificationData,
        function(data) {
          $scope.notificationLoading = false;
          if (data.data.value) {
            if (_.isEmpty(data.data.data)) {
              $scope.notificationLoaded = true;
            } else {
              $scope.notificationList = _.concat(
                $scope.notificationList,
                data.data.data
              );
            }
            $scope.$broadcast("scroll.infiniteScrollComplete");
          }
        }
      );
    }
  };
  $scope.notiTabs($stateParams.innerTab ? $stateParams.innerTab : "General");
  $scope.goBackHandler = function() {
    Navigation.gobackHandler(); //This works
  };
  $ionicModal
    .fromTemplateUrl("templates/modal/buyer-profile-modal.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function(modal) {
      $scope.buyerProfileModal = modal;
    });
  $scope.openBuyerProfileModal = function(notification) {
    $scope.singleNotification = notification;
    $scope.fullAddress = "";
    if ($scope.singleNotification.from.gstAddress)
      $scope.fullAddress += $scope.singleNotification.from.gstAddress;
    if ($scope.singleNotification.from.city)
      $scope.fullAddress += ", " + $scope.singleNotification.from.city;
    if ($scope.singleNotification.from.state)
      $scope.fullAddress += ", " + $scope.singleNotification.from.state;
    if ($scope.singleNotification.from.country)
      $scope.fullAddress += ", " + $scope.singleNotification.from.country;
    $scope.buyerProfileModal.show();
  };

  $scope.closeBuyerProfileModal = function() {
    $scope.buyerProfileModal.hide();
  };

  $scope.acceptNotification = function(sampleReqStatus, notification) {
    if (sampleReqStatus == "Accept") {
      sampleReq = "Accept";
    } else {
      sampleReq = "Decline";
    }
    $ionicPopup.show({
      title: "",
      subTitle:
        "Are you sure you want to " + sampleReq + " the Sample Request?",
      scope: $scope,
      cssClass: "logoutPopup",
      buttons: [
        {
          text: "<b>Yes</b>",
          type: "button-positive",
          onTap: function(e) {
            $scope.acceptNotificationPromise = Navigation.commonAPICall(
              "notification/acceptNotification",
              {
                sampleReqStatus: sampleReqStatus,
                notification: notification
              },
              function(data) {
                if (data.data.value) {
                  if (sampleReqStatus == "Accept") {
                    ionicToast.show("Accepted successfully", "middle");
                  } else {
                    ionicToast.show("Rejected successfully", "middle");
                  }
                  $scope.closeBuyerProfileModal();
                  $scope.currentPage = 1;
                  $scope.getNotification($scope.notificationType);
                } else {
                  ionicToast.show(
                    "Error occured while " +
                      sampleReqStatus +
                      "ing the sample request",
                    "middle"
                  );
                }
              }
            );
          }
        },
        {
          text: "No"
        }
      ]
    });
  };

  $ionicModal
    .fromTemplateUrl("templates/modal/filter-modal.html", {
      scope: $scope,
      animation: "fade-in"
    })
    .then(function(modal) {
      $scope.filterModal = modal;
    });
  $scope.openFilterModal = function() {
    $scope.filterModal.show();
  };

  $scope.closeFilterModal = function() {
    $scope.filterModal.hide();
  };

  $ionicModal
    .fromTemplateUrl("templates/modal/buyer-post-requirement.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function(modal) {
      $scope.buyerPostrequirementModal = modal;
    });
  $scope.openBuyerPostRequirementModal = function() {
    $scope.buyerPostrequirementModal.show();
  };
  $scope.closeBuyerPostRequirementModal = function() {
    $scope.buyerPostrequirementModal.hide();
  };
  $ionicModal
    .fromTemplateUrl("templates/modal/toggle-notification.html", {
      scope: $scope,
      animation: "slide-left-right"
    })
    .then(function(modal) {
      $scope.togglenotificationModal = modal;
    });
  $scope.opentogglenotificationModal = function() {
    $scope.togglenotificationModal.show();
  };
  $scope.closetogglenotificationModal = function() {
    $scope.togglenotificationModal.hide();
  };

  // $scope.getNotification([
  //   "Request",
  //   "Follow",
  //   "Like",
  //   "Fav",
  //   "Interested",
  //   "PostRequirement"
  // ]);
  $scope.loadMore = function() {
    $scope.getNotification($scope.notificationType);
  };

  /**For Post Reequirement Start */
  $ionicModal
    .fromTemplateUrl("templates/modal/post-req-detail-modal.html", {
      scope: $scope,
      animation: "slide-left-right"
    })
    .then(function(modal) {
      console.log("modal", modal);
      $scope.postReqDetail = modal;
    });
  $scope.openPostReqDetail = function(notification) {
    $scope.singleNotification = notification;
    $scope.fullAddress = "";
    if ($scope.singleNotification.from.gstAddress)
      $scope.fullAddress += $scope.singleNotification.from.gstAddress;
    if ($scope.singleNotification.from.city)
      $scope.fullAddress += ", " + $scope.singleNotification.from.city;
    if ($scope.singleNotification.from.state)
      $scope.fullAddress += ", " + $scope.singleNotification.from.state;
    if ($scope.singleNotification.from.country)
      $scope.fullAddress += ", " + $scope.singleNotification.from.country;

    $scope.imageChunk = _.chunk($scope.singleNotification.product.images, 3);
    $scope.postReqDetail.show();
  };
  $scope.closePostReqDetail = function() {
    $scope.postReqDetail.hide();
  };
  //**Post Requirement End */

  /**Gallery pop up for image Post requirement */
  $ionicModal
    .fromTemplateUrl("templates/modal/gallery.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function(modal) {
      $scope.modal = modal;
    });
  $scope.openModal = function(outerIndex, innerIndex, image) {
    $scope.singleImage = image;
    var value = 3 * outerIndex + innerIndex;
    $ionicSlideBoxDelegate.slide(value);
    $scope.modal.show();
    $scope.product = {};
    $scope.product.images = $scope.singleNotification.product.images;
    console.log($scope.singleNotification.product.images);
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  /***Gallery End */
  // $rootScope.$on("$stateChangeSuccess", function (
  //   event,
  //   toState,
  //   toParams,
  //   fromState,
  //   fromParams
  // ) {
  //   if (toState.name == 'tab.notification') {
  //     $scope.notiTabs($stateParams.innerTab ?
  //       $stateParams.innerTab :
  //       "General");
  //   }
  // });
});
