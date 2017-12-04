APIs from OMDB and TMDB are used to display information of each movie from the search results. 

OMDB gives us detailed information of each movie if it's queried with an ID, however, if we search by name 
it gives us a brief overview of the movie. Also, it doesn't provide us with the trailers. 

In order to make the trailers for each movie available, we used TMDB API which provides us with youtube official trailer
keys. 

The challenge was to combine information from OMDB and TMDB to display information of each movie. In order to that,
inf app.get("/info") method the movieID from the OMDB database is passed from results.ejs page. Using, this ID
OMDB was searched and required information was passed as a javascript object to info.ejs template. Also, trailer 
data from TMDB was sent as javasript object to info.ejs.

This functionality is yet to deployed on the main website.