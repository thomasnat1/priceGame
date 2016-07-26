var amazon = require('amazon-product-api');
var aws = require("aws-lib");


module.exports.getProduct = function(req, res){
  var productCategories = [
		{name: "Appliances", ID: "2619526011"},
		{name: "Baby", ID: "165797011"}, //gets sale price here 
		{name: "Cell Phones & Accessories", ID: "2335753011"}, //for some reason it gets the non-sale price here 
		{name: "Tools & Home Improvement", ID:"468240"},
		{name: "Toys & Games", ID:"165795011"},
		{name: "", ID:""},
		{name: "", ID:""},
		{name: "", ID:""}
	]

	var productCategory = productCategories[Math.floor(Math.random()*productCategories.length)];

	if(req.params.type != "random"){ 
		for (var i = 0; i < productCategories.length; i++) {
			if(productCategories[i].name == req.params.type){
				productCategory = productCategories[i]
			}
		}
	}

	prodAdv = aws.createProdAdvClient(process.env.AWSAccessKeyId, process.env.AWSSecretKey, "nattestad-20");

	prodAdv.call("ItemSearch", {"SearchIndex":"Books", "BrowseNode": 3375301 , "ResponseGroup":"Images,ItemAttributes,Offers", "ItemPage": Math.floor(Math.random()*10)+1}, function(err, result) {
  	var chosenItem = result.Items.Item[Math.floor(Math.random()*result.Items.Item.length)];
  	
  	while(!chosenItem.Offers.Offer || !chosenItem.Offers.Offer.OfferListing.Price.Amount || !chosenItem.LargeImage || !chosenItem.ItemAttributes.Title || chosenItem.Offers.Offer.OfferListing.Price.Amount < 3){
  		
  		console.log(chosenItem.Offers.Offer.OfferListing.Price.Amount)
	  	chosenItem = result.Items.Item[Math.floor(Math.random()*result.Items.Item.length)];
  	}

  	var usefulItem = {}

  	console.log(chosenItem.Offers.Offer)
		
		usefulItem.showPrice = chosenItem.Offers.Offer.OfferListing.Price.Amount / 100;
  	
  	if(chosenItem.Offers.Offer.OfferListing.SalePrice){
  		usefulItem.showPrice = chosenItem.Offers.Offer.OfferListing.SalePrice.Amount / 100;
  		usefulItem.oldPrice = chosenItem.Offers.Offer.OfferListing.Price.Amount / 100;
  	}else if(chosenItem.Offers.Offer.OfferListing.AmountSaved){
  		usefulItem.oldPrice = (chosenItem.Offers.Offer.OfferListing.Price.Amount/100) + (chosenItem.Offers.Offer.OfferListing.AmountSaved.Amount/100) ;
  	}

  	usefulItem.title = chosenItem.ItemAttributes.Title;
  	usefulItem.productURL = chosenItem.DetailPageURL;
  	usefulItem.largeURL = chosenItem.LargeImage.URL;

  	usefulItem.fullItem = chosenItem;

  	res.send(usefulItem);
	});

};






