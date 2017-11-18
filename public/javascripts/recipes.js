getAllReps();

var allRecipesResultCache = [];
function getAllReps(){

	$.ajax({
		url:'/recipes/list',
		type:'GET'
	})
	.done(listAllRecipesCallSuccess)
	.fail(ajaxFailure);

	function listAllRecipesCallSuccess(res, status)
	{
		allRecipesResultCache = res.recipes;
		if(allRecipesResultCache.length == 0){
			$('#noRecipeMessage .jumbotron h1').text("Sorry, we currently have no recipes for you")
		}
		
		renderRecipesTable(allRecipesResultCache);
	}
}

function renderRecipesTable(recipes, searchType){
	var innerRecipes = JSON.parse(JSON.stringify(recipes));

	var recipeTableElem = $('#AllRecipeListTable');
	var noRepsMessageElem = $('#noRecipeMessage');
	var noStarredRecipeMessage = $('#noStarredRecipeMessage');


	//Cleanup Pagination from previous render
	$('#tablePaginationContainer').toggleClass('hidden', true);
	$('#tblNextButton, #tblPrevButton').off('click');

	if(innerRecipes.length == 0)
	{
		//no result, so hide table and show message
		recipeTableElem.toggleClass('hidden', true);
		if(searchType == "Starred"){
			noStarredRecipeMessage.toggleClass('hidden', false);
		}
		else{
			noRepsMessageElem.toggleClass('hidden', false);
		}
	}
	else
	{
		//have results, so show Table container and hide no results message container
		recipeTableElem.toggleClass('hidden', false);
		noRepsMessageElem.toggleClass('hidden', true);
		noStarredRecipeMessage.toggleClass('hidden', true);

		//Split into an array of pages
		var pages = [];
		while(innerRecipes.length > 0){
			var page = innerRecipes.splice(0, 10);
			pages.push(page);
		}

		var currentPage = 0;
		drawTable();
		enableDisableNextPrev();


		//If More than one page
		if(pages.length > 1){

			//Show pagination controls
			$('#tablePaginationContainer').toggleClass('hidden', false);

			$('#tblNextButton').on('click', function(){
				currentPage++;
				reRender();

			});

			$('#tblPrevButton').on('click', function(){
				currentPage--;
				reRender();
			});
		}

		function reRender(){
			drawTable();
			enableDisableNextPrev();
			$('#currPageNumberContainer').text('Page: ' + (currentPage + 1));
		}


		function drawTable(){
			var tableHTML = "";
			$(pages[currentPage]).each(function(i,v){
				tableHTML += '<tr>\n';
				tableHTML += '\t<td>' + v.id + '</td>\n';
				tableHTML += '\t<td><img class="repipeImage" src="' + v.imageUrl + '"/></td>\n';
				tableHTML += '\t<td><a href="/recipes/' + v.id + '">' + v.name + '</a></td>\n';
				tableHTML += '\t<td>' + v.ingredients.join(', ') + '</td>\n';
				tableHTML += '\t<td>' + v.cookingTime + '</td>\n';
				tableHTML += '\t<td><span class="glyphicon glyphicon-star ' + ((v.starred)? 'starred' : "") + '" data-recipeid="' + v.id + '"></span></td>\n';
				tableHTML += '</tr>\n';
			});

			recipeTableElem.find('tbody').html(tableHTML);

			//Add star click listner
			$('#AllRecipeListTable .glyphicon-star').on('click', function(e){
				var clickedRecipeID = $(e.target).data('recipeid');

				//current state
				var currentlyIsStarred = $(e.target).hasClass('starred');

				//Star Recipe on server
				starRecipe(clickedRecipeID, !currentlyIsStarred);

				//Star it locally
				var thisPageRep = pages[currentPage].filter(function(o){ return o.id == clickedRecipeID })[0]
				if (thisPageRep){
					thisPageRep.starred = !currentlyIsStarred;
				}
				var thisGlobalRep = allRecipesResultCache.filter(function(o){ return o.id == clickedRecipeID })[0]
				if (thisGlobalRep){
					thisGlobalRep.starred = !currentlyIsStarred;
				}

				//Change Star
				$(e.target).toggleClass('starred', !currentlyIsStarred);

				//Refilter table
				$('#recipeFilterByInput').change();
			})
		}

		function enableDisableNextPrev(){

			$('#tblNextButton').prop('disabled', false);
			$('#tblPrevButton').prop('disabled', false);

			if(currentPage == 0){
				$('#tblPrevButton').prop('disabled', true);
			}
			else if (currentPage == (pages.length -1)){
				$('#tblNextButton').prop('disabled', true);
			}
		}
	}
}

function filterRecipeTable(type, e){
	var searchText = "";
	var searchType = "Name";

	if(type == "word") {
		searchText = e.target.value;
		searchType = $('#recipeFilterByInput').val();
	}
	else if(type == "type") {
		searchText = $('#recipeFilterInput').val();
		searchType = e.target.value;
	}

	searchText = searchText.trim();

	var searchItems = searchText.split(' ');
	var filteredRecipes = allRecipesResultCache.filter(function(recipe){ 

		var searchSubjects = [];
		switch(searchType)
		{
			case "Name":
			default:
			searchSubjects = recipe.name.split(' ');
			break;

			case "Ingredient":
			searchSubjects = recipe.ingredients;
			break;

			case "Time":
			searchSubjects = parseInt(searchText);
			searchSubjects = (isNaN(searchSubjects))? 0 : searchSubjects;
			break;

			case "Starred":
			searchSubjects = [];
			break;
		}

		if(searchType == "Time")
		{
			return recipe.cookingTimeInt <= searchSubjects;
		}
		else if(searchType == "Starred"){
			return recipe.starred;
		}
		else
		{
			for(var i = 0; i < searchSubjects.length; i++)
			{
				for(var j = 0; j < searchItems.length; j++)
				{
					if(searchSubjects[i].toLocaleLowerCase().indexOf(searchItems[j].toLocaleLowerCase()) > -1){
						return true;
					}
				}
			}
		}

		return false;
	});

	renderRecipesTable(filteredRecipes, searchType);
}

function starRecipe(id, yesNo){
	$.ajax({
		url:'/recipes/star',
		type:'POST',
		data: {
			id:id,
			yesNo:yesNo
		}
	})
	.done(function(res, status){
		//do noting
	})
	.fail(ajaxFailure);
}

function ajaxFailure(reqObj, status){
	console.log(status, reqObj);
}