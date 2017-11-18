var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var index = require('./routes/index');
var users = require('./routes/users');
var recipes = require('./routes/recipes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/BS', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/JQ', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

app.use('/', index);
app.use('/users', users);
app.use('/recipes', recipes);

fs.readFile('recipes.json', 'utf8', function (err, data) {
	if (err) {throw err;};

	var allRecipes = JSON.parse(data);

	//Augment the data to allow for additional features
	var units = ["tsp", "tbls", ""];
	for(var i = 0; i < allRecipes.recipes.length; i++){
		var thisRecipe = allRecipes.recipes[i];

		//IDs are just good
		thisRecipe.id = i;

		//Display ingredient Quantities
		thisRecipe.ingredientsAugmented = [];
		for(var j = 0; j < thisRecipe.ingredients.length; j++){
			thisRecipe.ingredientsAugmented.push({
				name: thisRecipe.ingredients[j],
				quantity: Math.floor(Math.random() * 3) + 1,//Random Qty
				unit: units[Math.floor(Math.random() * units.length)]//Random Unit
			});			
		}

		//CookingTime as a searchable Int
		var cookTime = parseInt(thisRecipe.cookingTime);
		thisRecipe.cookingTimeInt = (isNaN(cookTime))? -1 : cookTime;

		//Add starred prop
		thisRecipe.starred = false;
	}
	
	//Shortcut to show Pagination
	for(var i = 0; i < 50; i++)
	{
		var stock = JSON.parse(JSON.stringify(allRecipes.recipes[allRecipes.recipes.length -1]));
		stock.id++;

		//allRecipes.recipes.push(stock);
	}


	//Shortcut to show "No recipes" message
	//allRecipes.recipes = [];


	app.set('allRecipes', allRecipes);
	//console.log(allRecipes);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
