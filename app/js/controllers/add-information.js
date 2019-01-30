myApp.controller("AddInformationCtrl", function (
  $scope,
  $stateParams,
  Navigation,
  $state,
  ionicToast,
  $ionicActionSheet,
  $cordovaCamera,
  $cordovaFileTransfer,
  $cordovaImagePicker,
  $ionicHistory
) {
  $scope.formData = {
    country: "India",
    search: ""
  };
  $scope.getPlaceDescription = function (name) {
    var obj = {};
    obj.name = name;
    obj.checkExpiry = false;
    Navigation.commonAPIWithoutLoader("User/getPlaceDescription", obj, function (
      data
    ) {
      $scope.getCityDetails = data.data.data;
      // console.log("$scope.getCityDetails", $scope.getCityDetails);
    });
  };
  $scope.selectedCity = function (city) {
    $scope.formData.search = city.description;
    $scope.getCityDetails = [];
    $scope.formData.city = city.terms[0].value;
    $scope.formData.state = city.terms[1].value;
    $scope.formData.country = city.terms[2].value;
    console.log("Selected City Is ", city);
  };
  // $scope.getState = function () {
  //   if (!_.isEmpty($scope.formData.country)) {
  //     Navigation.commonAPIWithoutLoader(
  //       "User/getState", {
  //         country: $scope.formData.country
  //       },
  //       function (data) {
  //         $scope.states = data.data.data;
  //       }
  //     );
  //   }
  // };
  // $scope.getState();
  if ($stateParams.id) {
    Navigation.commonAPICall(
      "User/getOne", {
        _id: $stateParams.id,
        checkExpiry: false
      },
      function (data) {
        if (data.data.value) {
          $scope.formData = data.data.data;
          $scope.formData.country = $scope.formData.country ?
            $scope.formData.country :
            "India";
          // $scope.getState();
          // $scope.getCity();
        }
      }
    );
  } else {}
  $scope.goBackHandler = function () {
    Navigation.gobackHandler();
  };
  $scope.gstValidate = false;
  $scope.validateGst = function (gstin, valid) {
    $scope.invalidGst = false;
    $scope.noCity = false;
    if (valid) {
      Navigation.gstAPICall(
        "User/getGSTInfo", {
          gstin: gstin,
          checkExpiry: false
        },
        function (data) {
          if (data.data.value) {
            if (data.data.data.error) {
              $scope.gstValidate = false;
              $scope.invalidGst = true;
              $scope.formData.gstAddress = "";
              $scope.formData.pincode = "";
              $scope.formData.city = "";
              $scope.formData.state = "";
              $scope.formData.companyName = "";
            } else {
              $scope.gstValidate = true;
              console.log(data.data.data);
              $scope.gstAddr = data.data.data.data.pradr.addr;
              $scope.formData.gstCompanyName = data.data.data.data.tradeNam;
              $scope.formData.gstAddress = "";
              $scope.formData.gstAddress += $scope.gstAddr.bno ?
                $scope.gstAddr.bno + "," :
                "";
              $scope.formData.gstAddress += $scope.gstAddr.bnm ?
                $scope.gstAddr.bnm + "," :
                "";
              $scope.formData.gstAddress += $scope.gstAddr.st ?
                $scope.gstAddr.st + "," :
                "";
              $scope.formData.gstAddress += $scope.gstAddr.loc ?
                $scope.gstAddr.loc + "," :
                "";
              $scope.formData.gstAddress = $scope.formData.gstAddress.substring(
                0,
                $scope.formData.gstAddress.length - 1
              );
              $scope.formData.pincode = $scope.gstAddr.pncd;
              $scope.formData.city =
                $scope.gstAddr.city != "" ?
                $scope.gstAddr.city :
                $scope.gstAddr.dst;
              if ($scope.formData.city == "") {
                $scope.noCity = true;
              }
              $scope.formData.state = $scope.gstAddr.stcd;
            }
          }
        }
      );
    } else {
      $scope.gstValidate = false;
      $scope.invalidGst = true;
    }
  };

  // Navigation.commonAPICall("User/getCountry", "", function (data) {
  //   var obj = data.data.data;
  //   var result = Object.keys(obj).map(function (key) {
  //     return obj[key];
  //   });
  //   var popped = result.pop();
  //   $scope.countries = result;
  // });

  $scope.getCity = function () {
    console.log("$scope.formData.state", $scope.formData.state);
    if (
      !_.isEmpty($scope.formData.country) &&
      !_.isEmpty($scope.formData.state)
    ) {
      Navigation.commonAPICall(
        "User/getCity", {
          state: $scope.formData.state,
          country: $scope.formData.country,
          checkExpiry: false
        },
        function (data) {
          $scope.cities = data.data.data;
        }
      );
    }
  };

  $scope.submit = function () {
    $scope.formData.checkExpiry = false;
    $scope.formData.registrationStatus = "gst";
    $scope.addInfoPromise = Navigation.commonAPICall(
      "User/save",
      $scope.formData,
      function (data) {
        if (data.data.value) {
          $scope.addNewProductPromise = Navigation.commonAPICall(
            "User/getOne", {
              _id: $stateParams.id,
              checkExpiry: false
            },
            function (data) {
              if (data.data.value) {
                data.data.data.checkExpiry = false;
                $scope.addNewProductPromise = Navigation.commonAPICall(
                  "User/welcomeMessage",
                  data.data.data,
                  function () {}
                );
                $.jStorage.set("userInfo", data.data.data);
              }
            }
          );
          $state.go("subscription", {
            id: $stateParams.id
          });
        } else {
          ionicToast.show("Please Submit Again", "middle");
        }
      }
    );
    // $state.go("subscription");
  };
  $scope.adducimage = function (maxImage) {
    Navigation.showActionsheet(true, null, maxImage, function (Images) {
      $scope.formData.photo = Images[0];
    });
    if (maxImage > 1) {
      $ionicActionSheet.close();
    }
  };
});
