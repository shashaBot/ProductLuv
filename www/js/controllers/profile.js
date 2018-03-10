'use strict';

app.controller('ProfileCtrl', function(profile, uid, $scope, Auth, products, $state, $ionicModal){
  var prof = this;
  prof.currentUser = profile;
  prof.products = [];
  function init(){
    Auth.getProductsByUser(uid).$loaded().then(function(data){
      console.log(data);
      for(var i=0; i < data.length; i++){
        var item = data[i];
        console.log(item);
        prof.products.push(item);
      }
    });
  }
  init();
  console.log(prof.products);
  prof.openCreateProdModal = function (){
    $scope.createProductModal.show();
  };

  $ionicModal.fromTemplateUrl('templates/createProduct.html',{
         scope: $scope
     })
         .then(function(modal){
             $scope.createProductModal = modal;
         });

  prof.closeCreateProdModal = function(){
    $scope.createProductModal.hide();
  };
  prof.showProductDetails = function(prod_id){
  };
  prof.saveProduct = function(product){
    var newProduct = {
      creatorId: uid,
      productName: product.name,
      productCat: product.cat,
      productDesc: product.desc,
      productStat: product.stat
    };
    Auth.addProduct(newProduct).then(function(){
      prof.product = {};
      prof.closeCreateProdModal();
      init();
    })
  };
});
