// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
function startApplication() {
  angular.element(document).ready(function () {
    angular.bootstrap(document, myApp);
  });
}
var myApp = angular
  .module("starter", [
    "ionic",
    "starter.services",
    "star-rating",
    "ionic-toast",
    "ngCordova",
    "ui.select",
    "selectize",
    "rzModule",
    "angularPromiseButtons",
    "imageupload"
  ])

  .run(function (
    $ionicPlatform,
    $state,
    $rootScope,
    Navigation,
    $cordovaNetwork,
    $ionicHistory,
    $stateParams
  ) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      // var userInfo = $.jStorage.get('userInfo');

      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      // io.sails.url = "http://localhost:1337/";

      $ionicPlatform.registerBackButtonAction(function (event) {
        event.preventDefault();
        if ($state.current.name == "plan-subscription" && $stateParams.expiry == true) {
          navigator.app.exitApp();
        } else
        if (
          $state.current.name == "network-error" ||
          $state.current.name == "otp"
        ) {
          //no back
        } else {
          Navigation.gobackHandler(); //This works
        }
      }, 101);


      // if (window.StatusBar) {
      //   // org.apache.cordova.statusbar required
      //   StatusBar.styleDefault();
      // }

      if (!_.isEmpty($.jStorage.get("userState"))) {
        var userId = $.jStorage.get("userState");
        Navigation.commonAPIWithoutLoader(
          "user/getUserRegistrationStatus", {
            _id: userId.id,
            checkExpiry: false
          },
          function (data) {
            var user = data.data.data;
            if (user.registrationStatus) {
              switch (user.registrationStatus) {
                case "signup":
                  $state.go("otp", {
                    userId: userId.id,
                    mobile: userId.mobile
                  });
                  break;
                case "otp":
                  $state.go("buyer-seller", {
                    id: userId.id
                  });
                  break;
                case "userType":
                  $state.go("add-information", {
                    id: userId.id,
                    type: $.jStorage.get("type")
                  });
                  break;
                case "gst":
                  $state.go("subscription", {
                    id: userId.id
                  });
                  break;
                case "payment":
                  if (
                    $.jStorage.get("userInfo").isSeller &&
                    $.jStorage.get("userInfo").isTextile
                  ) {
                    $state.go("category", {
                      id: userId.id,
                      firstVisit: true
                    });
                  } else if (
                    $.jStorage.get("userInfo").isSeller &&
                    $.jStorage.get("userInfo").isAccessories
                  ) {
                    $state.go("accessory", {
                      id: userId.id,
                      firstVisit: true
                    });
                  } else if ($.jStorage.get("userInfo").isBuyer) {
                    $state.go("buyer-category", {
                      id: userId.id,
                      firstVisit: true
                    });
                  }
                  break;
                case "category":
                  if ($.jStorage.get("userInfo").isSeller) {
                    $state.go("inner-category", {
                      id: userId.id,
                      firstVisit: true
                    });
                  } else if ($.jStorage.get("userInfo").isBuyer) {
                    $state.go("buyer-inner-category", {
                      id: userId.id,
                      firstVisit: true
                    });
                  }
                  break;
                case "subCategory":
                  if ($.jStorage.get("userInfo").isSeller) {
                    $state.go("tab.myshop");
                  } else if ($.jStorage.get("userInfo").isBuyer) {
                    $state.go("tab.market");
                  }
                  break;
                case "accessory":
                  if ($.jStorage.get("userInfo").isSeller) {
                    $state.go("tab.myshop");
                  } else if ($.jStorage.get("userInfo").isBuyer) {
                    $state.go("tab.market");
                  }
                  $.jStorage.deleteKey("userState");
                  break;
                default:
                  break;
              }
            }
          }
        );
      }
      // if (ionic.Platform.isAndroid()) {
      if (!_.isEmpty($.jStorage.get("userInfo"))) {
        if (window.plugins && window.plugins.OneSignal) {
          var notificationOpenedCallback = function (jsonData) {
            // alert("Notification opened:\n" + JSON.stringify(jsonData));
            if ($.jStorage.get("userInfo").isSeller) {
              $state.go("tab.notification", {
                innerTab: "General"
              });
            }
            if ($.jStorage.get("userInfo").isBuyer) {
              $state.go("tab.buyernotification", {
                innerTab: "General"
              });
            }
          };
          window.plugins.OneSignal.startInit(
              "46aab31d-3e3e-4e00-b303-4b0848306c70"
            )
            .handleNotificationOpened(notificationOpenedCallback)
            .inFocusDisplaying(
              window.plugins.OneSignal.OSInFocusDisplayOption.Notification
            )
            .endInit();
          window.plugins.OneSignal.getIds(function (ids) {
            // console.log('getIds: ' + JSON.stringify(ids));
            $rootScope.deviceId = ids.userId;
            // $.jStorage.set("deviceId", ids.userId);
            if (!_.isEmpty($.jStorage.get("userInfo"))) {
              mySocket.on(
                "deviceId_" + $.jStorage.get("userInfo")._id,
                function onConnect(socketData) {
                  Navigation.commonAPIWithoutLoader(
                    "user/getOne", {
                      _id: $.jStorage.get("userInfo")._id,
                      checkExpiry: false
                    },
                    function (data) {
                      if (data.data.data.deviceId !== ids.userId) {
                        startApplication();
                        location.reload();
                        $.jStorage.flush();
                        $state.go("login");
                      }
                      console.log("done");
                    }
                  );
                }
              );
              Navigation.commonAPIWithoutLoader(
                "user/getOne", {
                  _id: $.jStorage.get("userInfo")._id,
                  checkExpiry: false
                },
                function (data) {
                  if (data.data.data.deviceId !== ids.userId) {
                    startApplication();
                    location.reload();
                    $.jStorage.flush();
                    $state.go("login");
                  }
                  console.log("done");
                }
              );
            }
          });
        }
      }
      // }

      // $rootScope.$on("$cordovaNetwork:online", function (event, networkState) {
      //   window.history.back();
      // });

      // $rootScope.$on("$cordovaNetwork:offline", function (event, networkState) {
      //   $state.go("network-error");
      // });

      var stateArray = [
        "login",
        "otp",
        "signup",
        "buyer-seller",
        "add-information",
        "subscription"
      ];
      var stateIndex = _.findIndex(stateArray, function (state) {
        return state == $state.current.name;
      });
      if (stateIndex == -1) {
        console.log("aaaaa");
        if (window.StatusBar) {
          StatusBar.styleLightContent();
          StatusBar.backgroundColorByHexString("#002e6e");
        }
      } else {
        console.log("bbb");
        if (window.StatusBar) {
          StatusBar.styleDefault();
          StatusBar.backgroundColorByHexString("#ffffff");
        }
      }

      $rootScope.$on("$stateChangeSuccess", function (
        event,
        toState,
        toParams,
        fromState,
        fromParams
      ) {
        // if (
        //   $state.current.name != "network-error" &&
        //   $cordovaNetwork.isOffline()
        // ) {
        //   $state.go("network-error");
        // }
        var stateIndex = _.findIndex(stateArray, function (state) {
          return state == $state.current.name;
        });
        if (stateIndex == -1) {
          console.log("aaaaa");
          if (window.StatusBar) {
            StatusBar.styleLightContent();
            StatusBar.backgroundColorByHexString("#002e6e");
          }
        } else {
          console.log("bbb");
          if (window.StatusBar) {
            StatusBar.styleDefault();
            StatusBar.backgroundColorByHexString("#ffffff");
          }
        }
      });
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.form.checkbox("square");
    $ionicConfigProvider.views.maxCache(10000);
    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.views.transition('none');
    $ionicConfigProvider.scrolling.jsScrolling(false);

    var isSeller = false;
    // if ($.jStorage.get("userInfo") && $.jStorage.get("userInfo").isSeller) {
    //   var isSeller = $.jStorage.get("userInfo").isSeller
    // }
    if ($.jStorage.get("userInfo")) {
      var isSeller = !_.isEmpty($.jStorage.get("userInfo"));
    }
    $stateProvider
      .state("app", {
        url: "/app",
        abstract: true,
        cache: false,
        templateUrl: "templates/menu.html",
        controller: "AppCtrl"
      })
      .state("login", {
        cache: false,
        url: "/login",
        templateUrl: "templates/login-signup/login.html",
        controller: "LoginCtrl"
      })
      .state("otp", {
        cache: false,
        url: "/otp/:userId/:mobile",
        templateUrl: "templates/login-signup/otp.html",
        controller: "OtpCtrl"
      })
      .state("forgot-mobile", {
        cache: false,
        url: "/forgot/mobile",
        templateUrl: "templates/login-signup/forgot-mobile.html",
        controller: "ForgotMobileCtrl"
      })
      .state("forgot-otp", {
        cache: false,
        url: "/forgot/otp/:userId",
        templateUrl: "templates/login-signup/forgot-otp.html",
        controller: "ForgotOtpCtrl"
      })
      .state("forgot-password", {
        cache: false,
        url: "/forgot/password/:userId",
        templateUrl: "templates/login-signup/forgot-password-reset.html",
        controller: "ForgotPasswordCtrl"
      })

      .state("signup", {
        cache: false,
        url: "/signup",
        templateUrl: "templates/login-signup/signup.html",
        controller: "SignupCtrl"
      })

      .state("add-information", {
        cache: false,
        url: "/add-information/:id/:type",
        templateUrl: "templates/login-signup/add-information.html",
        controller: "AddInformationCtrl"
      })

      .state("subscription", {
        cache: false,
        url: "/subscription/:id",
        templateUrl: "templates/login-signup/subscription.html",
        controller: "SubscriptionCtrl"
      })
      .state("subscription-invoice", {
        cache: false,
        url: "/subscription-invoice/:firstVisit",
        templateUrl: "templates/subscription-invoice.html",
        controller: "SubscriptionInvoiceCtrl"
      })
      .state("buyer-seller", {
        cache: false,
        url: "/buyer-seller/:id",
        templateUrl: "templates/login-signup/seller-buyer-select.html",
        controller: "SellerBuyerCtrl"
      })
      .state("select-seller", {
        cache: false,
        url: "/select-seller",
        templateUrl: "templates/login-signup/select-seller.html",
        controller: "SelectSellerCtrl"
      })

      .state("category", {
        cache: false,
        url: "/category/:id/:firstVisit",
        templateUrl: "templates/category/category.html",
        controller: "CategoryCtrl"
      })
      .state("inner-category", {
        cache: false,
        url: "/inner-category/:id/:firstVisit",
        templateUrl: "templates/category/inner-category.html",
        controller: "InnerCategoryCtrl"
      })
      .state("buyer-inner-category", {
        cache: false,
        url: "/buyer-inner-category/:id/:firstVisit",
        templateUrl: "templates/category/buyer-inner-category.html",
        controller: "BuyerInnerCategoryCtrl"
      })
      .state("buyer-category", {
        cache: false,
        url: "/buyer-category/:id/:firstVisit",
        templateUrl: "templates/category/buyer-category.html",
        controller: "buyer-CategoryCtrl"
      })
      .state("accessory", {
        cache: false,
        url: "/accessory/:id/:firstVisit",
        templateUrl: "templates/accessories/accessory.html",
        controller: "AccessoryCtrl"
      })
      .state("product-detail", {
        cache: false,
        url: "/product-detail/:id/:productId",
        templateUrl: "templates/product-detail/product-detail.html",
        controller: "ProductDetailCtrl"
      })
      .state("buyer-product-detail", {
        // cache: false,
        url: "/buyer-product-detail/:id/:productId",
        templateUrl: "templates/product-detail/buyer-product-detail.html",
        controller: "BuyerProductDetailCtrl"
      })
      .state("plan-subscription", {
        cache: false,
        url: "/plan-subscription/:expiry",
        templateUrl: "templates/plan-subscription.html",
        controller: "PlansubscriptionCtrl"
      })
      .state("recently-view", {
        // cache: false,
        url: "/recently-view",
        templateUrl: "templates/myshop/recently-view.html",
        controller: "RecentlyviewCtrl"
      })
      .state("feedback", {
        cache: false,
        url: "/feedback",
        templateUrl: "templates/feedback.html",
        controller: "FeedbackCtrl"
      })
      .state("inner-market", {
        cache: false,
        url: "/inner-market",
        templateUrl: "templates/myshop/inner-market.html",
        controller: "InnerMarketCtrl"
      })
      .state("app.buyer-myshop", {
        url: "/buyer-myshop",
        cache: false,
        views: {
          menuContent: {
            templateUrl: "templates/myshop/buyer-myshop.html",
            controller: "BuyerMyShopCtrl"
          }
        }
      })
      .state("add-new-product", {
        cache: false,
        url: "/add-new-product/:id/:category/:subCategory",
        templateUrl: "templates/add-new-product/add-new-product.html",
        controller: "AddNewProductCtrl"
      })
      .state("newly-added", {
        url: "/newly-added",
        templateUrl: "templates/recently-added/newly-added.html",
        controller: "newlyAddedCtrl"
      })
      .state("innermarket-newly-added", {
        // cache: false,
        url: "/newly-added-products/:categoryId",
        templateUrl: "templates/innermarket-newlyadded.html",
        controller: "innerMarketNewlyAddedCtrl"
      })
      .state("tab", {
        url: "/tab",
        abstract: true,
        // cache: false,
        templateUrl: "templates/myshop/sellertab.html",
        controller: "AppCtrl"
      })

      // Each tab has its own nav history stack:
      //seller tabs start
      .state("tab.myshop", {
        url: "/myshop",
        // cache: false,
        views: {
          "tab-myshop": {
            templateUrl: "templates/myshop/myshop.html",
            controller: "MyShopCtrl"
          }
        }
      })
      .state("inner-shop", {
        // cache: false,
        url: "/inner-shop/:category/:subCategory",
        // views: {
        //   "tab-myshop": {
        templateUrl: "templates/myshop/inner-shop.html",
        controller: "InnerShopCtrl"
        //   }
        // }
      })
      .state("tab.statistics", {
        url: "/statistics",
        // cache: false,
        views: {
          "tab-statistics": {
            templateUrl: "templates/statistics.html",
            controller: "StatisticsCtrl"
          }
        }
      })
      .state("inner-statistics", {
        url: "/inner-statistics/:type",
        // cache: false,
        templateUrl: "templates/inner-statistics.html",
        controller: "InnerStatisticsCtrl"
      })
      .state("tab.notification", {
        url: "/notification/:innerTab",
        // cache: false,
        views: {
          "tab-notification": {
            templateUrl: "templates/notification/notification.html",
            controller: "NotificationCtrl"
          }
        }
      })
      //seller tabs end

      //buyer tabs start
      .state("tab.market", {
        url: "/market",
        // cache: false,
        views: {
          "tab-market": {
            templateUrl: "templates/myshop/inner-market.html",
            controller: "InnerMarketCtrl"
          }
        }
      })
      .state("buyer-inner-shop", {
        url: "/buyer-inner-shop/:sellerId/:category/:subCategory",
        // cache: false,
        templateUrl: "templates/myshop/buyer-inner-shop.html",
        controller: "BuyerInnerShopCtrl"
      })
      .state("tab.collection", {
        url: "/collection",
        // cache: false,
        views: {
          "tab-collection": {
            templateUrl: "templates/collection/categories.html",
            controller: "CategoriesCtrl"
          }
        }
      })
      .state("tab.buyernotification", {
        url: "/buyernotification/:innerTab",
        // cache: false,
        views: {
          "tab-buyernotification": {
            templateUrl: "templates/notification/buyer-notification.html",
            controller: "BuyerNotificationCtrl"
          }
        }
      })

      //buyer tabs end
      .state("edit-product", {
        cache: false,
        url: "/edit-product/:id/:product",
        templateUrl: "templates/add-new-product/edit-product.html",
        controller: "editProductCtrl"
      })
      .state("followers", {
        cache: false,
        url: "/followers",
        templateUrl: "templates/followers.html",
        controller: "FollowersCtrl"
      })
      .state("block-list", {
        cache: false,
        url: "/Blocked",
        templateUrl: "templates/blocked-list.html",
        controller: "BlockedListCtrl"
      })
      .state("following", {
        url: "/following",
        // cache: false,
        templateUrl: "templates/following.html",
        controller: "FollowingCtrl"
      })
      .state("favourites", {
        url: "/favourites/:type/:id",
        // cache: false,
        templateUrl: "templates/myshop/favourites.html",
        controller: "FavouritesCtrl"
      })

      .state("interested", {
        url: "/interested/:type/:id",
        // cache: false,
        templateUrl: "templates/myshop/interested.html",
        controller: "InterestedCtrl"
      })
      .state("sample-request", {
        url: "/sample-request/:type/:id",
        // cache: false,
        templateUrl: "templates/myshop/sample-request.html",
        controller: "SampleRequestCtrl"
      })
      .state("similar-products", {
        url: "/similar-products/:id/:categoryId/:subCategoryId/:qualityType",
        cache: false,
        templateUrl: "templates/myshop/similar-product.html",
        controller: "SimilarProductsCtrl"
      })
      .state("search-seller", {
        url: "/search-seller",
        // cache: false,
        templateUrl: "templates/search-buyers/search-seller.html",
        controller: "SearchSellerCtrl"
      })
      .state("search-buyer", {
        url: "/search-buyer",
        cache: false,
        templateUrl: "templates/search-buyers/search-buyers.html",
        controller: "SearchBuyerCtrl"
      })
      .state("app.requirement-list", {
        url: "/requirement-list",
        // cache: false,
        views: {
          menuContent: {
            templateUrl: "templates/requirement-list.html",
            controller: "RequirementListCtrl"
          }
        }
      })
      .state("profile", {
        cache: false,
        url: "/profile",
        templateUrl: "templates/profile/profile.html",
        controller: "ProfileCtrl"
      })
      .state("seller-profile", {
        cache: false,
        url: "/seller-profile/:sellerId",
        templateUrl: "templates/profile/seller-profile.html",
        controller: "SellerProfileCtrl"
      })
      .state("sellermyshop", {
        url: "/seller-myshop/:sellerId",
        cache: false,
        templateUrl: "templates/myshop/seller-myshop.html",
        controller: "SellerShopCtrl"
      })
      .state("buyer-profile", {
        cache: false,
        url: "/buyer-profile",
        templateUrl: "templates/profile/buyer-profile.html",
        controller: "BuyerProfileCtrl"
      })
      .state("network-error", {
        cache: false,
        url: "/network-error",
        templateUrl: "templates/network-error.html",
        controller: "NetworkErrorCtrl"
      })
      .state("recently-added", {
        // cache: false,
        url: "/recently-added/:id",
        templateUrl: "templates/recently-added/recently-added.html",
        controller: "RecentlyAddedCtrl"
      })
      .state("searched-products", {
        cache: false,
        url: "/searched-products/:keyword",
        templateUrl: "templates/searched-products.html",
        controller: "SearchedProductsCtrl"
      })
      .state("buyer-searched-products", {
        cache: false,
        url: "/buyer-searched-products/:keyword",
        templateUrl: "templates/buyer-searched-products.html",
        controller: "BuyerSearchedProductsCtrl"
      })
      .state("buyers-detail", {
        cache: false,
        url: "/buyers-detail/:buyerId",
        templateUrl: "templates/profile/buyers-detail.html",
        controller: "BuyersDetailCtrl"
      })
      .state("seller-detail", {
        cache: false,
        url: "/seller-detail",
        templateUrl: "templates/profile/seller-detail.html",
        controller: "SellerDetailCtrl"
      })
      .state("redirecting", {
        cache: false,
        url: "/redirecting",
        template: "",
        controller: "RedirectingCtrl"
      })
      .state("success", {
        cache: false,
        url: "/success",
        templateUrl: "templates/success.html",
        controller: "SuccessCtrl"
      })
      .state("failure", {
        cache: false,
        url: "/failure",
        templateUrl: "templates/failure.html",
        controller: "FailureCtrl"
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(function (Navigation) {
      if (_.isEmpty($.jStorage.get("userInfo"))) {
        if (_.isEmpty($.jStorage.get("userState"))) {
          return "/login";
        } else {
          //do nothing
        }
      } else {
        if (_.isEmpty($.jStorage.get("userState"))) {
          if ($.jStorage.get("userInfo").isSeller) {
            return "/tab/myshop";
          } else if ($.jStorage.get("userInfo").isBuyer) {
            return "/tab/market";
          } else {
            return "/login";
          }
        } else {
          //do nothing
        }
      }
    });
  })

  .filter("dateDob", function () {
    return function (input) {
      return moment(input, "DD/MM/YYYY").format("ddd, Do MMM YYYY");
    };
  })
  .filter("serverimage", function () {
    return function (input, width, height, style) {
      if (input) {
        if (input.substr(0, 4) == "http") {
          return input;
        } else {
          image = imgpath + "?file=" + input;
          if (width) {
            image += "&width=" + width;
          }
          if (height) {
            image += "&height=" + height;
          }
          if (style) {
            image += "&style=" + style;
          }
          return image;
        }
      } else {
        return "img/noImage.png";
      }
    };
  })

  .filter("showPlayerBy", function () {
    return function (input) {
      return _.join(input, ", ");
    };
  })
  .filter("timeDiff", function () {
    return function (filterDate) {
      return moment(filterDate).fromNow();
    };
  })

  .filter("numberprice", function ($filter) {
    return function (input) {
      if (input > 999 && input <= 99999) {
        input = $filter("number")(input / 1000, 1) + "K";
        return input;
      } else if (input > 99999) {
        input = $filter("number")(input / 100000, 1) + "M";
        return input;
      } else {
        return input;
      }
    };
  });
