myApp.controller("editProductCtrl", function(
  $scope,
  $ionicModal,
  $stateParams,
  Navigation,
  ionicToast,
  $state,
  $ionicSlideBoxDelegate
) {
  $scope.goBackHandler = function() {
    Navigation.gobackHandler(); //This works
  };
  if (_.isEmpty($stateParams.id) || $stateParams.id == undefined) {
    $stateParams.id = $.jStorage.get("UserId");
  }
  $scope.unitArray = [
    {
      name: "cm"
    },
    {
      name: "inch"
    },
    {
      name: "m"
    }
  ];
  //seletize
  $scope.optionUnit = $scope.unitArray;
  $scope.optionUnitConfig = {
    valueField: "name",
    labelField: "name",
    searchField: ["name"],
    delimiter: "|",
    maxItems: 1
    // onInitialize: function(selectize) {
    //   console.log(selectize);
    // }
  };
  if ($stateParams.id) {
    Navigation.commonAPIWithoutLoader(
      "User/getOne",
      {
        _id: $stateParams.id
      },
      function(data) {
        if (data.data.value) {
          $scope.user = data.data.data;
          $scope.categories = $scope.user.category;
          Navigation.commonAPIWithoutLoader(
            "Product/getOne",
            {
              _id: $stateParams.product
            },
            function(data) {
              if (data.data.value) {
                $scope.formData = data.data.data;
                if (_.isObject($scope.formData.category)) {
                  $scope.formData.category = $scope.formData.category._id;
                }
                if (_.isObject($scope.formData.subCategory)) {
                  $scope.formData.subCategory = $scope.formData.subCategory._id;
                }
                if (!_.isEmpty($scope.formData.images)) {
                  $scope.imageChunk = _.chunk($scope.formData.images, 3);
                }
                //seletize
                $scope.optionCategoriesName = $scope.categories;
                $scope.optionCategoriesNameConfig = {
                  valueField: "_id",
                  labelField: "name",
                  searchField: ["name"],
                  delimiter: "|",
                  maxItems: 1
                  // onInitialize: function(selectize) {
                  //   console.log(selectize);
                  // }
                };
                $scope.getSubCategory();

                // console.log("$scope.user", $scope.user);
                // console.log("$scope.formData", $scope.formData);
              }
            }
          );
        }
      }
    );
  } else {
    ionicToast.show("No User Selected Please Try Again", "middle");
  }
  $scope.getSubCategory = function() {
    var data = {};
    if ($scope.formData.category) {
      data.category = $scope.formData.category;
    }
    Navigation.commonAPICall("SubCategory/getAllSubCategories", data, function(
      data
    ) {
      if (data.data.value) {
        $scope.subCategories = [];
        _.each(data.data.data, function(n) {
          _.each($scope.user.subCategory, function(m) {
            if (n._id.toString() == m._id.toString()) {
              $scope.subCategories.push(n);
            }
          });
        });
        //seletize
        $scope.optionSubCategoriesName = $scope.subCategories;
        $scope.optionSubCategoriesNameConfig = {
          valueField: "_id",
          labelField: "name",
          searchField: ["name"],
          delimiter: "|",
          maxItems: 1
        };
        if ($stateParams.category && $stateParams.subCategory) {
          $scope.formData.category = $stateParams.category;
          $scope.formData.subCategory = $stateParams.subCategory;
        }
      } else {
        ionicToast.show("Please Reload Again", "middle");
      }
    });
  };
  $scope.addCamera = function(index, maxImage) {
    Navigation.showActionsheet(false, index, maxImage, function(Images) {
      if (!$scope.formData.images) {
        $scope.formData.images = [];
      }
      _.forEach(Images, function(value) {
        $scope.formData.images.push(value);
      });
      if (!_.isEmpty($scope.formData.images)) {
        $scope.imageChunk = _.chunk($scope.formData.images, 3);
      }
    });
  };

  $scope.submit = function() {
    if (
      (_.isEmpty($scope.formData.name) || $scope.formData.name == undefined) &&
      (_.isEmpty($scope.formData.Category) ||
        $scope.formData.Category == undefined) &&
      (_.isEmpty($scope.formData.SubCategory) ||
        $scope.formData.SubCategory == undefined) &&
      (_.isEmpty($scope.formData.designNumber) ||
        $scope.formData.designNumber == undefined) &&
      (_.isEmpty($scope.formData.qualityType) ||
        $scope.formData.qualityType == undefined) &&
      (_.isEmpty($scope.formData.rate) || $scope.formData.rate == undefined) &&
      (_.isEmpty($scope.formData.size) || $scope.formData.size == undefined) &&
      (_.isEmpty($scope.formData.minimumOrder) ||
        $scope.formData.minimumOrder == undefined) &&
      (_.isEmpty($scope.formData.description) ||
        $scope.formData.description == undefined) &&
      (_.isEmpty($scope.formData.newRate) ||
        $scope.formData.newRate == undefined)
    ) {
      $scope.showValidationSelectize = true;
    } else {
      $scope.formData.owner = $scope.user._id;
      $scope.formData.city = $scope.user.city;
      if ($scope.formData.rate == undefined) {
        $scope.formData.rate = "";
        $scope.formData.newRate = "";
      }
      if (!$scope.formData.offer) {
        $scope.formData.newRate = "";
      }
      $scope.addNewProductPromise = Navigation.commonAPICall(
        "Product/save",
        $scope.formData,
        function(data) {
          window.history.back();
        }
      );
    }
  };
  $scope.removeImage = function(outerIndex, innerIndex) {
    var index = 3 * outerIndex + innerIndex;
    _.pullAt($scope.formData.images, index);
    // console.log("Image", $scope.formData.images);
    $scope.imageChunk = _.chunk($scope.formData.images, 3);
  };
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
    $scope.product.images = $scope.formData.images;
    // console.log($scope.formData.images);
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  /***Gallery End */
  $scope.goToShop = function() {
    $state.go("tab.myshop");
  };

  //Product Name Array
  $scope.userId = {
    user: $stateParams.id
  };
  $scope.getproductName = function() {
    Navigation.commonAPIWithoutLoader(
      "Product/getNameArray",
      $scope.userId,
      function(data) {
        $scope.productName = data.data.data;
        // console.log("$scope.productName", $scope.productName);
        //seletize
        $scope.optionName = $scope.productName;
        $scope.optionNameConfig = {
          create: true,
          valueField: "name",
          labelField: "name",
          searchField: ["name"],
          delimiter: "|",
          maxItems: 1
        };
      }
    );
  };
  $scope.getproductName();

  // Quality Type
  $scope.getQualityType = function() {
    Navigation.commonAPIWithoutLoader(
      "Product/getQualityTypeArray",
      $scope.userId,
      function(data) {
        $scope.getQualityType = data.data.data;
        // console.log("$scope.getQualityType", $scope.getQualityType);
        //seletize
        $scope.optionQualityType = $scope.getQualityType;
        $scope.optionQualityTypeConfig = {
          create: true,
          valueField: "qualityType",
          labelField: "qualityType",
          searchField: ["qualityType"],
          delimiter: "|",
          maxItems: 1
        };
      }
    );
  };
  $scope.getQualityType();

  // Design Number Array
  $scope.getDesignNumber = function() {
    Navigation.commonAPIWithoutLoader(
      "Product/getDesignNumberArray",
      $scope.userId,
      function(data) {
        $scope.designNumber = data.data.data;
        // console.log("getDesignNumberArray", $scope.designNumber);
        //seletize
        $scope.optionDesignNumber = $scope.designNumber;
        $scope.optionDesignNumberConfig = {
          create: true,
          valueField: "designNumber",
          labelField: "designNumber",
          searchField: ["designNumber"],
          delimiter: "|",
          maxItems: 1
        };
      }
    );
  };
  $scope.getDesignNumber();

  // Get Rate
  $scope.getRate = function() {
    Navigation.commonAPIWithoutLoader(
      "Product/getRateArray",
      $scope.userId,
      function(data) {
        $scope.rate = data.data.data;
        // console.log("$scope.rate", $scope.rate);
        //seletize
        $scope.optionRate = $scope.rate;
        $scope.optionRateConfig = {
          create: true,
          valueField: "rate",
          labelField: "rate",
          searchField: ["rate"],
          delimiter: "|",
          maxItems: 1
        };
      }
    );
  };
  $scope.getRate();

  // get Size
  $scope.getSize = function() {
    Navigation.commonAPIWithoutLoader(
      "Product/getSizeArray",
      $scope.userId,
      function(data) {
        $scope.size = data.data.data;
        // console.log("$scope.size", $scope.size);
        //seletize
        $scope.optionSize = $scope.size;
        $scope.optionSizeConfig = {
          create: true,
          valueField: "size",
          labelField: "size",
          searchField: ["size"],
          delimiter: "|",
          maxItems: 1
        };
      }
    );
  };
  $scope.getSize();

  // get Min Order
  $scope.getMinOrderArray = function() {
    Navigation.commonAPIWithoutLoader(
      "Product/getMinOrderArray",
      $scope.userId,
      function(data) {
        $scope.minOrder = data.data.data;
        // console.log("$scope.minOrder", $scope.minOrder);
        //seletize
        $scope.optionMinOrder = $scope.minOrder;
        $scope.optionMinOrderConfig = {
          create: true,
          valueField: "minimumOrder",
          labelField: "minimumOrder",
          searchField: ["minimumOrder"],
          delimiter: "|",
          maxItems: 1
        };
      }
    );
  };
  $scope.getMinOrderArray();

  // get Description
  $scope.getDescriptionArray = function() {
    Navigation.commonAPIWithoutLoader(
      "Product/getDescriptionArray",
      $scope.userId,
      function(data) {
        $scope.description = data.data.data;
        // console.log("$scope.description", $scope.description);
        //seletize
        $scope.optionDescription = $scope.description;
        $scope.optionDescriptionConfig = {
          create: true,
          valueField: "description",
          labelField: "description",
          searchField: ["description"],
          delimiter: "|",
          maxItems: 1
        };
      }
    );
  };
  $scope.getDescriptionArray();

  // get New Rate
  $scope.getNewRateArray = function() {
    Navigation.commonAPIWithoutLoader(
      "Product/getNewRateArray",
      $scope.userId,
      function(data) {
        $scope.newRate = data.data.data;
        // console.log("$scope.newRate", $scope.newRate);
        //seletize
        $scope.optionNewRate = $scope.newRate;
        $scope.optionNewRateConfig = {
          create: true,
          valueField: "newRate",
          labelField: "newRate",
          searchField: ["newRate"],
          delimiter: "|",
          maxItems: 1
        };
      }
    );
  };
  $scope.getNewRateArray();
  $scope.refreshResults = function($select, field) {
    var search = $select.search,
      list = angular.copy($select.items),
      FLAG = -1;
    //remove last user input
    list = list.filter(function(item) {
      return item.id !== FLAG;
    });

    if (!search) {
      //use the predefined list
      $select.items = list;
    } else {
      //manually add user input and set selection
      var userInputItem = {
        id: FLAG,
        [field]: search
      };
      $select.items = [userInputItem].concat(list);
      $select.selected = search;
    }
  };
});
