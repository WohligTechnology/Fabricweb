// var adminSocket = "http://192.168.1.106:1337/";
var adminSocket = "http://payment.fabricterminal.com/";
// var adminSocket = "http://localhost:1337/";
var adminUrl = adminSocket + "api/";
// var adminUrl = "http://wohlig.io:1337/api/";
var imgpath = adminUrl + "upload/readFile";
var uploadurl = adminUrl + "upload/";
var loading = null;
io.sails.useCORSRouteToGetCookie = false;
io.sails.autoConnect = false;
io.sails.url = adminSocket;
var mySocket = io.sails.connect(adminSocket);
angular
  .module("starter.services", [])

  .factory("Navigation", function (
    $http,
    $ionicActionSheet,
    $cordovaCamera,
    $ionicLoading,
    $cordovaFileTransfer,
    $cordovaImagePicker,
    $state,
    $ionicHistory,
    $stateParams
  ) {
    return {
      signUp: function (url, data, callback) {
        $ionicLoading.show({
          templateUrl: "templates/loader.html",
          animation: "fade-in",
          hideOnStateChange: true
        });
        return $http.post(adminUrl + url, data).then(function (data) {
          $ionicLoading.hide();
          console.log("snehal", data);
          if (data.data.value == false) {} else {
            $.jStorage.set("UserId", data.data.data._id);
            if (data.data.data.isSeller) {
              $.jStorage.set("type", "Seller");
            } else if (data.data.data.isBuyer) {
              $.jStorage.set("type", "Buyer");
            }
          }

          callback(data);
        });
      },

      login: function (url, data, callback) {
        $ionicLoading.show({
          templateUrl: "templates/loader.html",
          animation: "fade-in",
          hideOnStateChange: true
        });
        return $http.post(adminUrl + url, data).then(function (data) {
          $ionicLoading.hide();
          $.jStorage.set("UserId", data.data.data._id);
          if (data.data.data.isSeller) {
            $.jStorage.set("type", "Seller");
          } else if (data.data.data.isBuyer) {
            $.jStorage.set("type", "Buyer");
          }
          callback(data);
        });
      },
      commonAPICall: function (url, data, callback) {
        // if (loading == null) {
        loading = $ionicLoading.show({
          templateUrl: "templates/loader.html",
          animation: "fade-in",
          hideOnStateChange: true
        });
        // }
        data.expiryCheck = $.jStorage.get('UserId');
        // $http.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        // $httpProvider.defaults.headers = {'Access-Control-Allow-Origin':'*'}
        return $http.post(adminUrl + url, data).then(
          function (data) {
            if (data.data.error == 'Expired') {
              $state.go("plan-subscription");
            }
            if (data.data.error == 'Inactive') {
              $state.go('login');
            }
            $ionicLoading.hide().then(function () {
              // loading = null;
            });

            callback(data);
          },
          function errorCallback(response) {
            // loading = null;
            $ionicLoading.hide();
            // $ionicLoading.show({
            //   template: '<div class="wrong-loading">Something went wrong</div>',
            //   noBackdrop: true,
            //   duration: 2000
            // });
          }
        );
      },
      gstAPICall: function (url, data, callback) {
        // if (loading == null) {
        loading = $ionicLoading.show({
          templateUrl: "templates/loader.html",
          animation: "fade-in",
          hideOnStateChange: true
        });
        // }
        data.expiryCheck = $.jStorage.get('UserId');
        if (data.gstin) {
          data.gstin = _.toUpper(data.gstin)
        }
        // $http.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        // $httpProvider.defaults.headers = {'Access-Control-Allow-Origin':'*'}
        return $http.post("http://payment.fabricterminal.com/api/" + url, data).then(
          function (data) {
            if (data.data.error == 'Expired') {
              $state.go("plan-subscription");
            }
            if (data.data.error == 'Inactive') {
              $state.go('login');
            }
            $ionicLoading.hide().then(function () {
              // loading = null;
            });

            callback(data);
          },
          function errorCallback(response) {
            // loading = null;
            $ionicLoading.hide();
            // $ionicLoading.show({
            //   template: '<div class="wrong-loading">Something went wrong</div>',
            //   noBackdrop: true,
            //   duration: 2000
            // });
          }
        );
      },
      commonAPIWithoutLoader: function (url, data, callback) {
        data.expiryCheck = $.jStorage.get('UserId');
        return $http.post(adminUrl + url, data).then(function (data) {
          if (data.data.error == 'Expired') {
            $state.go("plan-subscription");
          }
          if (data.data.error == 'Inactive') {
            $state.go('login');
          }
          callback(data);
        });
      },
      getCity: function (callback) {
        return $http.post(adminUrl + url, data).then(function (data) {
          callback(data);
        });
      },
      gobackHandler: function () {
        if (!$stateParams.firstVisit) {
          var userType =
            $.jStorage.get("userInfo") && $.jStorage.get("userInfo").isSeller ?
            "myshop" :
            "market";
          if ($ionicHistory.backView()) {
            var stateName = $ionicHistory.backView().stateName;
            var stateParams = $ionicHistory.backView().stateParams;
            var stateArray = [
              "login",
              "otp",
              "signup",
              "buyer-seller",
              "add-information",
              "subscription"
            ];

            function findRegistrationState() {
              var index = _.findIndex(stateArray, function (state) {
                return state === stateName;
              });
              return index != -1;
            }
            if (findRegistrationState()) {
              if (_.isEmpty($.jStorage.get("userInfo"))) {
                if ($state.current.name == 'login') {
                  navigator.app.exitApp();
                } else {
                  window.history.back();
                }
              } else {
                if ($state.current.name == "tab." + userType) {
                  $state.reload();
                } else {
                  $state.go("tab." + userType);
                }
              }
            } else {
              if ($state.current.name == "tab." + userType) {
                $state.reload();
              } else {
                $state.go(stateName, stateParams);
              }
            }
          } else {
            if (_.isEmpty($.jStorage.get("userInfo"))) {
              if ($state.current.name == 'login') {
                navigator.app.exitApp();
              } else {
                window.history.back();
              }
            } else {
              if ($state.current.name == "tab." + userType) {
                $state.reload();
              } else {
                $state.go("tab." + userType);
              }
            }
          }
        }
      },
      showActionsheet: function (showActionsheet, index, maxImage, callback) {
        console.log("In Here");
        var actionsheet = [];

        function getPictures(index) {
          console.log("BUTTON CLICKED", index);
          if (index === 0) {
            var options = {
              quality: 90, // Higher is better
              maximumImagesCount: maxImage, // Max number of selected images
              width: 1024,
              height: 1024,
              saveToPhotoAlbum: true
            };
            cordova.plugins.diagnostic.isCameraAuthorized({
              successCallback: function (authorized) {
                if (authorized == false) {
                  cordova.plugins.diagnostic.requestCameraAuthorization({
                    successCallback: function (status) {
                      $cordovaImagePicker.getPictures(options).then(
                        function (results) {
                          var i = 0;
                          if (results.length > 0) {
                            $ionicLoading
                              .show({
                                templateUrl: "templates/loader.html",
                                animation: "fade-in",
                                hideOnStateChange: true
                              })
                              .then(function () {
                                console.log("results", results);
                                if (results.length == 0) {
                                  $ionicLoading.hide();
                                }
                              });
                            // _.forEach(results, function (value) {
                            async.eachSeries(
                              results,
                              function (value, cbEach) {
                                // var options = {
                                //   allowEdit: true
                                // };
                                // plugins.crop
                                //   .promise(value, options)
                                //   .then(function success(newPath) {
                                //     console.log(newPath);
                                $cordovaFileTransfer
                                  .upload(adminUrl + "upload", value)
                                  .then(
                                    function (result) {
                                      $ionicLoading.hide().then(function () {
                                        console.log(
                                          "The loading indicator is now hidden"
                                        );
                                      });
                                      result.response = JSON.parse(
                                        result.response
                                      );
                                      console.log(result.response.data[0]);
                                      actionsheet.push(result.response.data[0]);
                                      i++;
                                      // if (results.length == i) {
                                      //   callback(actionsheet);
                                      // }
                                      cbEach();
                                    },
                                    function (err) {
                                      console.log("Here 1");
                                      $ionicLoading.hide();
                                      // Error
                                      cbEach();
                                    },
                                    function (progress) {
                                      // cbEach();
                                      // constant progress updates
                                    }
                                  );
                                // })
                                // .catch(function fail(err) {
                                //   console.log(err);
                                //   $ionicLoading.hide();
                                //   // cbEach();
                                // });
                              },
                              function (err) {
                                console.log("last cb");
                                // if (results.length == i) {
                                callback(actionsheet);
                                // }
                              }
                            );
                            // });
                          }
                        },
                        function (error) {
                          $ionicLoading.hide();
                          console.log("Error: " + JSON.stringify(error)); // In case of error
                        }
                      );
                    },
                    errorCallback: function (error) {
                      $ionicLoading.hide();
                      console.error(error);
                    }
                  });
                } else {
                  $cordovaImagePicker.getPictures(options).then(
                    function (results) {
                      var i = 0;
                      if (results.length > 0) {
                        $ionicLoading
                          .show({
                            templateUrl: "templates/loader.html",
                            animation: "fade-in",
                            hideOnStateChange: true
                          })
                          .then(function () {});
                        // _.forEach(results, function (value) {
                        async.eachSeries(
                          results,
                          function (value, cbEach) {
                            // var options = {
                            //   allowEdit: true
                            // };
                            // plugins.crop
                            //   .promise(value, options)
                            //   .then(function success(newPath) {
                            //     console.log(newPath);
                            $cordovaFileTransfer
                              .upload(adminUrl + "upload", value)
                              .then(
                                function (result) {
                                  $ionicLoading.hide().then(function () {});
                                  result.response = JSON.parse(result.response);
                                  actionsheet.push(result.response.data[0]);
                                  i++;
                                  // if (results.length == i) {
                                  //   callback(actionsheet);
                                  // }
                                  cbEach();
                                },
                                function (err) {
                                  $ionicLoading.hide();
                                  cbEach();
                                  // Error
                                },
                                function (progress) {
                                  // constant progress updates
                                  // cbEach();
                                }
                              );
                            // })
                            // .catch(function fail(err) {
                            //   console.log(err);
                            //   // cbEach();
                            //   $ionicLoading.hide();
                            // });
                          },
                          function (err) {
                            console.log("last cb");
                            // if (results.length == i) {
                            callback(actionsheet);
                            // }
                          }
                        );
                        // });
                      }
                    },
                    function (error) {
                      $ionicLoading.hide();
                      console.log("Error: " + JSON.stringify(error)); // In case of error
                    }
                  );
                }
              },
              errorCallback: function (error) {
                $ionicLoading.hide();
                console.error("The following error occurred: " + error);
              }
            });
          } else if (index === 1) {
            var cameraOptions = {
              quality: 90,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              encodingType: 0,
              targetWidth: 1024,
              targetHeight: 1024,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: true,
              correctOrientation: true
            };

            $cordovaCamera.getPicture(cameraOptions).then(
              function (imageData) {
                var imageSrc = "data:image/jpeg;base64," + imageData;
                // $scope.showLoading('Uploading Image...', 10000);
                $ionicLoading
                  .show({
                    templateUrl: "templates/loader.html",
                    animation: "fade-in",
                    hideOnStateChange: true
                  })
                  .then(function () {
                    console.log("The loading indicator is now displayed");
                  });
                $cordovaFileTransfer.upload(adminUrl + "upload", imageSrc).then(
                  function (result) {
                    $ionicLoading.hide().then(function () {
                      console.log("The loading indicator is now hidden");
                    });
                    result.response = JSON.parse(result.response);
                    console.log(result.response.data[0]);
                    actionsheet.push(result.response.data[0]);
                    callback(actionsheet);
                  },
                  function (err) {
                    $ionicLoading.hide();
                    // Error
                  },
                  function (progress) {
                    // constant progress updates
                  }
                );
              },
              function (err) {
                console.log(err);
              }
            );
          } else {
            console.log("hello pdf");
            var fs = new $fileFactory();
            $ionicPlatform.ready(function () {
              fs.getEntriesAtRoot().then(
                function (result) {
                  $scope.files = result;
                },
                function (error) {
                  console.error(error);
                }
              );
              $scope.getContents = function (path) {
                fs.getEntries(path).then(function (result) {
                  $scope.files = result;
                  $scope.files.unshift({
                    name: "[parent]"
                  });
                  fs.getParentDirectory(path).then(function (result) {
                    result.name = "[parent]";
                    $scope.files[0] = result;
                  });
                });
              };
            });
          }
          return true;
        }

        if (showActionsheet) {
          $ionicActionSheet.show({
            //  titleText: 'choose option',
            buttons: [{
                text: '<i class="icon ion-ios-camera-outline"></i> Choose from gallery'
              },
              {
                text: '<i class="icon ion-images"></i> Take from camera'
              }
              // {
              //   text: '<i class="icon ion-document-text"></i> Take from file'
              // }
              // ,{
              //   text: '<i class="icon ion-document-text"></i> <input type="file" value="" accept="application/pdf,application/vnd.ms-excel" class="hw100"> Take from file'
              // }
            ],
            //  destructiveText: 'Delete',
            cancelText: "Cancel",
            cancel: function () {
              console.log("CANCELLED");
            },
            buttonClicked: function (index) {
              getPictures(index);
              if (true) {
                return true;
              }
            },
            destructiveButtonClicked: function () {
              console.log("DESTRUCT");
              return true;
            }
          });
        } else {
          getPictures(index);
        }
      },
      proceedToPayment: function (url, data, callback) {
        console.log("datadata", data)
        return $http.get(adminUrl + url + "?amount=" + data.amount + "&user=" + data.user + "&name=" + data.name).
        then(function (data) {});
      }
    };
  });
