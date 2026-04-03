
// KONFIGURASI API & STATE
const API_KEY = '8acf2d3481398b5274e8f40e7e52a294';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
let currentGenre = "";
let currentSort = "";
const totalMoviesGoal = 100;
const moviesPerPage = 10;

const genreMap = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
    99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
    27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

//  DROPDOWN GENRE
function setupGenreDropdown() {
    const selectElement = document.getElementById('genreFilter');
    if (!selectElement) return;

    // Sort genre berdasarkan abjad
    const sortedGenres = Object.entries(genreMap).sort((a, b) => a[1].localeCompare(b[1]));

    sortedGenres.forEach(([id, name]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        option.className = "bg-zinc-800";
        selectElement.appendChild(option);
    });

    // Event Listener Filter Genre
    selectElement.addEventListener('change', (e) => {
        currentGenre = e.target.value;
        currentPage = 1; // Reset ke hal 1 saat ganti genre
        fetchMovies(currentPage);
    });
}

// INISIALISASI SORT IMDB
function setupSortDropdown() {
    const sortElement = document.getElementById('sortIMDB');
    if (!sortElement) return;

    sortElement.addEventListener('change', (e) => {
        currentSort = e.target.value;
        fetchMovies(currentPage);
    });
}

// 5. FUNGSI FETCH DATA (GENRE & PAGINATION)
async function fetchMovies(page = 1) {
    const movieContainer = document.getElementById('movieContainer');
    const movieCount = document.getElementById('movieCount');

    movieContainer.innerHTML = `<div class="text-center py-20 text-zinc-500 italic">Fetching movies from universe...</div>`;

    try {
        let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&page=${page}&sort_by=popularity.desc`;

        if (currentGenre) {
            url += `&with_genres=${currentGenre}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
            // Ambil 10 film (TMDB kirim 20)
            let processedMovies = data.results.slice(0, moviesPerPage);

            // Logika Pengurutan Rating Manual
            if (currentSort === "high") {
                processedMovies.sort((a, b) => b.vote_average - a.vote_average);
            } else if (currentSort === "low") {
                processedMovies.sort((a, b) => a.vote_average - b.vote_average);
            }

            renderMovies(processedMovies);

            if (movieCount) movieCount.innerText = data.total_results > 100 ? 100 : data.total_results;
            updatePaginationUI();
        }
    } catch (error) {
        console.error("Error:", error);
        movieContainer.innerHTML = `<p class="text-center py-20 text-pink-500">Failed to load movies.</p>`;
    }
}


function renderMovies(movies) {
    const container = document.getElementById('movieContainer');
    container.innerHTML = '';

    movies.forEach(movie => {
        const genres = movie.genre_ids.slice(0, 3).map(id => genreMap[id] || "Movie");
        const movieCard = `
            <article class="flex flex-col md:flex-row gap-6 bg-zinc-800 p-5 rounded-2xl border border-zinc-800 hover:border-pink-600/50 transition-all duration-300 group shadow-lg">
                <div class="relative overflow-hidden rounded-xl shrink-0">
                    <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/160x240?text=No+Image'}" 
                         class="w-full md:w-40 h-64 md:h-60 object-cover transform group-hover:scale-110 transition duration-500">
                </div>
                <div class="flex-grow flex flex-col justify-between py-1">
                    <div>
                        <h2 class="text-2xl font-bold text-white group-hover:text-pink-500 transition">${movie.title}</h2>
                        <div class="flex flex-wrap gap-2 my-3">
                            ${genres.map(g => `<span class="text-[10px] uppercase tracking-widest border border-zinc-700 px-3 py-1 rounded-full text-zinc-400 font-medium">${g}</span>`).join('')}
                        </div>
                        <div class="flex items-center gap-2 text-sm font-bold text-yellow-500 mb-4">
                            <span class="px-2 py-1 rounded flex items-center gap-2">
                                <img src="../src/icons/IMDB_Logo_2016 1.svg" alt="IMDB" class="h-4 w-auto brightness-200">
                                <span>${movie.vote_average.toFixed(1)} ★</span>
                            </span>
                        </div>
                        <p class="text-zinc-400 text-sm leading-relaxed line-clamp-3 max-w-3xl">${movie.overview || "No description available."}</p>
                    </div>
                    <div class="flex flex-wrap gap-3 mt-6">
                        <button onclick="viewDetails(${movie.id})" class="bg-white text-black px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-tighter hover:bg-pink-600 hover:text-white transition duration-300">View Details</button>
                        <button onclick='addToWatchlist(${JSON.stringify({
            id: movie.id,
            title: movie.title.replace(/'/g, ""),
            img: movie.poster_path,
            rating: movie.vote_average,
            overview: movie.overview ? movie.overview.replace(/'/g, "") : ""
        })})' 
                            class="bg-zinc-800 border border-zinc-700 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-tighter hover:bg-pink-600 hover:border-pink-600 transition duration-300">Add To Watchlists</button>
                    </div>
                </div>
            </article>`;
        container.insertAdjacentHTML('beforeend', movieCard);
    });
}

// PAGINATION UI
function updatePaginationUI() {
    const startRange = ((currentPage - 1) * moviesPerPage) + 1;
    const endRange = Math.min(currentPage * moviesPerPage, totalMoviesGoal);

    const paginationText = document.querySelector('footer span:nth-child(2)');
    if (paginationText) paginationText.innerText = `${startRange} - ${endRange} of ${totalMoviesGoal}`;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === (totalMoviesGoal / moviesPerPage);

    [prevBtn, nextBtn].forEach(btn => {
        if (btn?.disabled) { btn.classList.add('opacity-30', 'cursor-not-allowed'); }
        else { btn.classList.remove('opacity-30', 'cursor-not-allowed'); }
    });
}

// listener utama
document.addEventListener('DOMContentLoaded', () => {
    setupGenreDropdown();
    setupSortDropdown();
    fetchMovies(currentPage);

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchMovies(currentPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    nextBtn?.addEventListener('click', () => {
        if (currentPage < (totalMoviesGoal / moviesPerPage)) {
            currentPage++;
            fetchMovies(currentPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    const loginBtn = document.getElementById('loginBtn');
    loginBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = './pages/login.html';
    });
});

// tab wathclist
window.handleWatchlistAccess = () => {
    const userSession = JSON.parse(localStorage.getItem('currentUser'));

    if (!userSession) {
        alert('Silakan login terlebih dahulu untuk mengakses Watchlist Anda!');
        window.location.href = '../pages/login.html';
    } else {
        window.location.href = 'watchlist.html';
    }
};

window.viewDetails = (id) => {
    localStorage.setItem('selectedMovieId', id);
    window.location.href = '#';
};
window.addToWatchlist = (id) => {
    const userSession = JSON.parse(localStorage.getItem('currentUser'));

    if (!userSession) {
        alert('Silakan login terlebih dahulu untuk mengakses Watchlist Anda!');
        window.location.href = '../pages/login.html';
    }
};