var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Reci-BBC' });
});

router.get('/list', function(req, res, next) {
  //Get Current users
  var allRecipes = req.app.get('allRecipes');
  res.send(allRecipes);
});

router.post('/star', function(req, res, next) {
  var allRecipes = req.app.get('allRecipes').recipes;

  var id = -1;
  if(req && req.body && req.body.id && (typeof(req.body.id) !== 'undefined' && req.body.id != null)){
    id = req.body.id;
  }

  var star = false;
  if(req && req.body && req.body.yesNo && (typeof(req.body.yesNo) !== 'undefined' && req.body.yesNo != null)){
    star = req.body.yesNo;
  }

  //get recipe from array
  var thisRecipe = allRecipes.filter(x => x.id == req.body.id)[0];
  if(thisRecipe){
    thisRecipe.starred = (star == "true")? true : false;
  }

  res.sendStatus(200);
});


router.get('/:recipeId', function(req, res, next) {

	console.log(req.params);

	var pageObect = {};
	pageObect.title = "Reci-BBC";
	pageObect.recipeNotFoundClass = "hidden";
	

	//Get the given Recipe from the array
  	var allRecipes = req.app.get('allRecipes').recipes;
  	pageObect.recipe = allRecipes.filter(x => x.id == req.params.recipeId)[0];
  	if(!pageObect.recipe){
  		pageObect.recipeNotFoundClass = "";
  		//get a random recipe
  		var randomIndexBetweenZeroAndArrayLength = Math.floor(Math.random() * allRecipes.length);
  		console.log(randomIndexBetweenZeroAndArrayLength);
  		pageObect.recipe = allRecipes[randomIndexBetweenZeroAndArrayLength];
  	}

  	console.log(pageObect);


  	res.render('recipe', pageObect);
});

module.exports = router;