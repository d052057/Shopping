// MODULE
var shopApp = angular.module('shoppingApp', ['ngRoute', 'ngResource']);
// ROUTES
shopApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/shopping.html',
            controller: 'shopController'
        })
        .otherwise({ redirectTo: '/index.html' })

    $locationProvider.hashPrefix('');
});
// SERVICES
shopApp.service('_getDataService', function ($http) {
    var _url = '/data/storeItems.json';
    return {
        getStoreData: $http.get(_url)
    }
});
// DIRECTIVES
shopApp.directive('bsTooltip', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).hover(function () {
                // on mouseenter
                $(element).tooltip('show');
            }, function () {
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});

// CONTROLLERS from HOME.HTML
shopApp.controller('shopController', function ($scope, _getDataService, $filter) {

    $scope.alerts;
    // array
    $scope.products;
    $scope.newStoreArray;
    $scope.selectedStore;
    $scope.showProduct = 'NONE';
    $scope.showAlert = 'BLOCK';
    $scope.showAlert = 'BLOCK';
    $scope.alerts = {
        typeInfo: 'info',
        messageInfo: 'Notes: Please chose shopping store first!!!'
    };
    $scope.returnArray;
    $scope.lowerPrice;
    $scope.lowerPriceStore;
    $scope.searchFor;
    $scope.downIconDisplay = 'NONE';
    $scope.upIconDisplay = 'INLINE';

    $scope.sortOrderFlag = true;
    $scope.sortOrder = '-price';
    $scope.stores = [
        { storeIndex: -1, storeName: '--select--' },
        { storeIndex: 1, storeName: 'Costco' },
        { storeIndex: 2, storeName: 'Safeway' },
        { storeIndex: 3, storeName: 'Fred Meyer' }
    ];
    $scope.selectedStore = '-1';
    _getDataService.getStoreData
        .then(function (result) {
            $scope.products = result.data;
        })
        .catch(function (result, status) {
            console.error('Gists error', result.status, result.data);
        })
        .finally(function () {
            var lowerPriceStore  ;
            var lowerPrice;
            var storeLocation = 'Unknown';
            for (var i = 0; i < $scope.products.length; i++) {
                 lowerPriceStore = $scope.products[i].storeNumber;
                 lowerPrice = $scope.products[i].price;

                $scope.products.filter(item => { return (!(item.storeNumber == $scope.products[i].storeNumber) && (item.productDescription.toLowerCase() == $scope.products[i].productDescription.toLowerCase())) }).forEach(
                    item => {
                        if (parseInt(item.price) < parseInt( lowerPrice)) {
                             lowerPrice = item.price;
                             lowerPriceStore = item.storeNumber;
                        }
                    });

                if ( lowerPriceStore == $scope.products[i].storeNumber) {
                    $scope.products[i].note = "This is the best price!";
                }
                else {
                    switch (parseInt( lowerPriceStore)) {
                        case 1:
                             storeLocation = 'Costco';
                            break;
                        case 2:
                             storeLocation = 'Safeway';
                            break;

                        case 3:
                             storeLocation = 'Fred Meyer';
                            break;
                       
                        default:
                             storeLocation = 'Unknown';
                    }
                    $scope.products[i].note = 'At ' +  storeLocation + ', the price is ' + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format( lowerPrice) + '.'
                };
            };
        });
    // option change
    $scope.onStoreChangeHandler = function () {
        if ($scope.selectedStore == '-1') {
            $scope.showProduct = 'NONE';
            $scope.showAlert = 'BLOCK';
            $scope.newStoreArray = [];
        }
        else {
            $scope.showProduct = 'BLOCK';
            $scope.showAlert = 'NONE';
            $scope.newStoreArray = [];

            angular.forEach($scope.products, x => {
                if (parseInt($scope.selectedStore) == parseInt(x.storeNumber)) {
                    $scope.newStoreArray.push(x);
                }
            });
        }
    };
    $scope.sortPrice = function () {
        if ($scope.sortOrderFlag) {
            $scope.sortOrder = 'price';
            $scope.downIconDisplay = 'INLINE';
            $scope.upIconDisplay = 'NONE';
        }
        else {
            $scope.sortOrder = '-price';
            $scope.downIconDisplay = 'NONE';
            $scope.upIconDisplay = 'INLINE';
        }
        $scope.sortOrderFlag = !($scope.sortOrderFlag);
    };
    $scope.getSum = function () {
        var total = 0;
        angular.forEach($scope.newStoreArray, x => {
            if (parseInt($scope.selectedStore) == parseInt(x.storeNumber)) {
                if (!$scope.searchFor || $scope.searchFor.productDescription.length <= 0) {
                    total += x.price * x.quantity;
                }
                else {
                    if (x.productDescription.toLowerCase().indexOf($scope.searchFor.productDescription) > -1) {
                        total += x.price * x.quantity;
                    }
                }
            }

        });
        return total;
    };

});
