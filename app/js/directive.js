myApp
  .directive("notification", function() {
    return {
      templateUrl: "templates/directive/notification-directive.html",
      link: function($scope, element, attrs) {}
    };
  })
  .directive("scrollTop", function($ionicScrollDelegate) {
    return {
      templateUrl: "templates/directive/scroll-top.html",
      link: function($scope, element, attrs) {
        // scroll to top
        $scope.scrollTop = function() {
          $ionicScrollDelegate.scrollTop(500);
        };

        $scope.getScrollPosition = function() {
          var scroll = $ionicScrollDelegate.getScrollPosition().top;
          // console.log(scroll);
          if (scroll >= 300) {
            $(".scroll-top").removeClass("hide");
          } else {
            $(".scroll-top").addClass("hide");
          }
        };
      }
    };
  })
  .directive("notification", function() {
    return {
      templateUrl: "templates/directive/notification-directive.html",
      link: function($scope, element, attrs) {}
    };
  })
  .directive("addEditProductForm", function($ionicScrollDelegate) {
    return {
      templateUrl: "templates/directive/add-edit-product.html",
      link: function($scope, element, attrs) {}
    };
  })
  .directive("notificationToggle", function(
    $ionicScrollDelegate,
    Navigation,
    $ionicModal,
    $timeout
  ) {
    return {
      templateUrl: "templates/directive/notification-toggle.html",
      link: function($scope, element, attrs) {
        $scope.notificationOff = null;
        Navigation.commonAPIWithoutLoader(
          "User/getOne",
          {
            _id: $.jStorage.get("userInfo")._id
          },
          function(data) {
            if (data.data.value) {
              $scope.notificationOff = !data.data.data.notificationOff;
            }
          }
        );
        $scope.setNotificationOff = function(notificationOff) {
          Navigation.commonAPIWithoutLoader(
            "User/setNotificationOff",
            {
              user: $.jStorage.get("userInfo")._id,
              notificationOff: !notificationOff
            },
            function(data) {
              if (data.data.value) {
                $scope.opentogglenotificationModal();
                $timeout(function() {
                  $scope.closetogglenotificationModal();
                }, 300);
                $scope.notificationOff = !data.data.data.notificationOff;
              }
            }
          );
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
      }
    };
  })
  .directive("addEditProductImage", function($ionicScrollDelegate) {
    return {
      templateUrl: "templates/directive/add-edit-product-image.html",
      link: function($scope, element, attrs) {}
    };
  })
  .directive("productBox", function(
    Navigation,
    $ionicActionSheet,
    $state,
    ionicToast,
    $rootScope,
    $timeout,
    $ionicPopup
  ) {
    return {
      restrict: "E",
      replace: false,
      scope: {
        product: "=ngProduct",
        type: "=type",
        imgCss: "@imgCss",
        noAction: "=noAction",
        action: "=action"
      },
      templateUrl: "templates/directive/product-box.html",
      link: function($scope, element, attrs) {
        Navigation.commonAPIWithoutLoader(
          "BlockList/getBlockStatus",
          {
            blockedBy: $scope.product.owner._id
              ? $scope.product.owner._id
              : $scope.product.owner,
            blockedTo: $.jStorage.get("userInfo")._id
          },
          function(data) {
            if (data.data.value && data.data.data == true) {
              $scope.userBlocked = true;
            }
          }
        );
        $scope.goToBuyerProductDetail = function(productId) {
          $state.go("buyer-product-detail", {
            id: $.jStorage.get("UserId"),
            productId: productId
          });
        };
        var reqData = {};
        $scope.showActionsheet = function(product) {
          // Show the action sheet
          if ($scope.action) {
            var buttons = $scope.action;
          } else {
            buttons = [
              {
                text: "Favourite"
              },
              {
                text: "Interested"
              }
            ];
          }
          var hideSheet = $ionicActionSheet.show({
            buttons: buttons,
            // destructiveText: "Delete",
            cancelText: "Cancel",
            cancel: function() {
              // add cancel code..
            },
            buttonClicked: function(index) {
              if ($scope.userBlocked) {
                var alertPopup = $ionicPopup.show({
                  title: "Blocked",
                  template: "You Have Been Blocked",
                  cssClass: "logoutPopup"
                });
                $timeout(function() {
                  alertPopup.close();
                }, 1000);
              } else {
                if (buttons[0].text == "Un-Favourite") {
                  reqData.type = "favourite";
                  reqData.product = product;
                  reqData.user = $.jStorage.get("userInfo");
                  Navigation.commonAPICall(
                    "User/removeFormFavArray",
                    reqData,
                    function(returnedValue) {
                      if (returnedValue.data.value) {
                        if (returnedValue.data.value) {
                          // $scope.added = true;
                          ionicToast.show(
                            "Removed From " +
                              _.startCase(_.toLower(reqData.type)),
                            "middle"
                          );
                          $rootScope.$broadcast("getCollection", "done");
                        }
                      }
                    }
                  );
                } else {
                  if (index == 0) {
                    reqData.type = "favourite";
                  }
                  if (index == 1) {
                    reqData.type = "interested";
                  }
                  reqData.product = product;
                  reqData.user = $.jStorage.get("userInfo");
                  Navigation.commonAPICall(
                    "User/addToFavArray",
                    reqData,
                    function(data) {
                      if (data.data.value) {
                        $scope.added = true;
                        console.log(
                          "data.data.data.nModified",
                          data.data.data[0].nModified
                        );
                        if (data.data.data[0].nModified == 1) {
                          if (reqData.type == "favourite") {
                            ionicToast.show("Added To Favourites", "middle");
                          }
                          if (reqData.type == "interested") {
                            ionicToast.show("Added To Interests", "middle");
                          }
                        } else {
                          if (reqData.type == "favourite") {
                            showType = "Favourites";
                          }
                          if (reqData.type == "interested") {
                            showType = "Interests";
                          }
                          var alertPopup = $ionicPopup.show({
                            title: "",
                            template: "Already Added to " + showType,
                            cssClass: "logoutPopup"
                          });
                          $timeout(function() {
                            alertPopup.close();
                          }, 1000);
                        }
                      }
                    }
                  );
                  Navigation.commonAPICall(
                    "User/getOne",
                    {
                      _id: $.jStorage.get("UserId")
                    },
                    function(data) {}
                  );
                }
              }
              return true;
            }
          });
        };
      }
    };
  })
  .filter("uploadpath", function() {
    return function(input, width, height, style) {
      var other = "";
      if (width && width !== "") {
        other += "&width=" + width;
      }
      if (height && height !== "") {
        other += "&height=" + height;
      }
      if (style && style !== "") {
        other += "&style=" + style;
      }
      if (input) {
        if (input.indexOf("https://") == -1) {
          return imgpath + "?file=" + input + other;
        } else {
          return input;
        }
      }
    };
  })
  .directive("uploadImage", function($http, $filter, $timeout) {
    return {
      templateUrl: "templates/directive/uploadFile.html",
      scope: {
        model: "=ngModel",
        type: "@type",
        isMultiple: "@multi",
        callback: "&ngCallback"
      },
      link: function($scope, element, attrs) {
        $scope.showImage = function() {};
        $scope.check = true;
        if (!$scope.type) {
          $scope.type = "image";
        }
        if (!$scope.isMultiple) {
          $scope.isMultiple = false;
        } else $scope.isMultiple = true;

        if (_.isArray($scope.model)) {
          //    if($scope.model.length>0)
          //    $scope.model= $scope.model[$scope.model.length-1];
          $scope.type = "pdf";
        }
        console.log("attrs", attrs);
        attrs.noView = true;
        if (attrs.multiple || attrs.multiple === "") {
          $scope.isMultiple = true;
          $("#inputImage").attr("multiple", "ADD");
        }
        if (attrs.noView || attrs.noView === "") {
          $scope.noShow = true;
        }
        // if (attrs.required) {
        //     $scope.required = true;
        // } else {
        //     $scope.required = false;
        // }

        $scope.$watch("image", function(newVal, oldVal) {
          console.log("newold", newVal, oldVal);
          isArr = _.isArray(newVal);
          if (!isArr && newVal && newVal.file) {
            $scope.uploadNow(newVal);
          } else if (isArr && newVal.length > 0 && newVal[0].file) {
            $timeout(function() {
              console.log(oldVal, newVal);
              console.log(newVal.length);
              _.each(newVal, function(newV, key) {
                if (newV && newV.file) {
                  $scope.uploadNow(newV);
                }
              });
            }, 100);
          }
        });

        if ($scope.model) {
          if (_.isArray($scope.model)) {
            $scope.image = [];
            _.each($scope.model, function(n) {
              $scope.image.push({
                url: n
              });
            });
          } else {
            if (_.endsWith($scope.model, ".pdf")) {
              $scope.type = "pdf";
            }
          }
        }
        if (attrs.inobj || attrs.inobj === "") {
          $scope.inObject = true;
        }
        $scope.clearOld = function() {
          $scope.model = [];
        };
        $scope.uploadNow = function(image) {
          $scope.uploadStatus = "uploading";
          console.log("img", image);
          var Template = this;
          image.hide = true;
          var formData = new FormData();
          formData.append("file", image.file, image.name);
          $http
            .post(uploadurl, formData, {
              headers: {
                "Content-Type": undefined
              },
              transformRequest: angular.identity
            })
            .then(function(data) {
              data = data.data;
              $scope.uploadStatus = "uploaded";
              if ($scope.isMultiple) {
                if ($scope.inObject) {
                  $scope.model.push({
                    image: data.data[0]
                  });
                } else {
                  if (!$scope.model) {
                    $scope.clearOld();
                  }
                  $scope.clearOld();
                  $scope.model.push(data.data[0]);
                }
              } else {
                if (_.endsWith(data.data[0], ".pdf")) {
                  $scope.type = "pdf";
                } else {
                  $scope.type = "image";
                }

                $scope.model = data.data[0];
              }

              $timeout(function() {
                console.log("directive", $scope.model);

                $scope.callback();
              }, 100);
            });
        };
        $scope.downloadFile = function() {
          console.log(" in downloadFile", $scope.model);
        };
      }
    };
  });
