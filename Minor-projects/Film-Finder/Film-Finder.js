let tmdbKey = key() /* Note: 'key()' is a placeholder for the API key and only works locally.

I've done it this way so that I can publish this project to GitHub without exposing my API key, but if you want to try this yourself, simply follow these steps: 
    1. Go to 'https://www.themoviedb.org/' and make an account
    2. Once signed in, click your profile icon, select 'Settings', click the 'API' section, and then apply for an API key
    3. Once you have a API key, replace the 'key' function call with a string containing your API key
    4. (Optional) Remove line 12 from index.html
*/

const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const playBtn = document.getElementById('playBtn');

// Fetches the list of genre categories to be displayed in the dropdown box for the user to select from
async function getGenres() {
    const genreRequestEndpoint = "/genre/movie/list";
    const requestParams = `?api_key=${tmdbKey}`;
    const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}${requestParams}`;

    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            const genres = jsonResponse.genres;
            console.log(genres)
            return genres;
        } else {
            console.error('Failed to fetch genres');
        };
    } catch (err) {
        console.error('Network Error:', err);
    };
};
// Fetches a list of movies based on the user-selected genre
async function getMovies() {
    const selectedGenre = getSelectedGenre();
    const discoverMovieEndpoint = '/discover/movie';
    const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}`;
    const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`;

    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            const movies = jsonResponse.results;
            return movies;
        } else {
            console.error('Failed to fetch movies');
        };
    } catch (err) {
        console.error('Network Error:', err);
    };
};
// Fetches the info for a movie based on the provided movie ID
async function getMovieInfo(movie) {
    const movieId = movie.id;
    const movieEndpoint = `/movie/${movieId}`;
    const requestParams = `?api_key=${tmdbKey}`;
    const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;

    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const movieInfo = await response.json();
            return movieInfo;
        } else {
            console.error('Failed to fetch movie info');
        };
    } catch (err) {
        console.error('Network Error:', err);
    };
};

// Gets a list of movies and ultimately displays the info of a random movie from the list
async function displayRandomMovie() {
    const movieInfo = document.getElementById('movieInfo');
    if (movieInfo.childNodes.length > 0) {
        clearCurrentMovie();
    };
    const movies = await getMovies();
    const randomMovie = getRandomMovie(movies);
    const info = await getMovieInfo(randomMovie);
    displayMovie(info);
};

getGenres().then(populateGenreDropdown);
playBtn.onclick = displayRandomMovie();