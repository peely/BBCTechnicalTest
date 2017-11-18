# Reci-BBC
Joes jovial recipe repository search system


## To Run
You'll need [NodeJS](https://nodejs.org) and npm (npm should come with NodeJS) installed on the machine you wish to run this on.


On your target machine, open your command window of choice, cd your way to your working directory, and clone this repo. Once that's done, cd into the newly created directory and run `npm install`


I suggest also installing the npm module [nodemon](https://www.npmjs.com/package/nodemon), `npm install -g nodemon`, this will restart the server each time you make a change to a file, which you might do while going though testing the features. Run nodemon with the command `nodemon --ignore public bin/www`.


Now its running you should be able to browse to [http://localhost:3000](http://localhost:3000) and see the index page.


## Features

### 1. Recipe List
Navigate to the index page, and you'll be presented with a table of recipes. The `recipes.json` file has three recipes in it, and these are listed with their names, ingredients and cooking times. If there are no recipes in the system a message is displayed saying so (uncomment `app.js:75` to see this behaviour). Clicking on a name will take you to feature two.

### 2. Recipe page
Clicking a name in the recipe list table will bring you to this page. It displays the recipe's image, name, ingredients and cooking time. The ingredient quantities are not part of the given `recipes.json`, so they are made up (`app.js:51`). If you alter the URL to send an invalid recipe ID, you'll be shown a message telling you that the recipe cannot be found, but the page is still populated with an alternative recipe.

### 3. Filter recipes
On the index page, you can filter by Name, Ingredient, Time and Starred. If your search returns no results, you'll be shown an appropriate message.

### 4. Pagination
When there are more than ten recipes in the system, pagination controls are displayed and the user can click next and previous, to see multiple pages of results. Regrettably, I'm not a culinary artist, so recipe four onwards is just recipe three with a ++'ed ID, which probably won’t give Joe much inspiration... uncomment `app.js:70` to see this behaviour.

### 5. Star
Click the star on the table, it changes to being stared, and you can filter based on this. If Joe has no starred recipes, hes told so.