const API_KEY = '8acf2d3481398b5274e8f40e7e52a294';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const selectedMovieId = localStorage.getItem('selectedMovieId');

if (!selectedMovieId) {
    window.location.href = 'movies.html';
}

async function fetchMovieDetails() {
    try {
        // Mengambil detail film dan data kredit (untuk cast & director)
        const response = await fetch(`${BASE_URL}/movie/${selectedMovieId}?api_key=${API_KEY}&append_to_response=credits`);
        const movie = await response.json();

        renderMovieDetails(movie);
    } catch (error) {
        console.error("Error fetching details:", error);
        document.querySelector('article').innerHTML = `<p class="text-center py-20 text-pink-500">Failed to load movie details.</p>`;
    }
}

// 4. RENDER DATA KE HTML
function renderMovieDetails(movie) {
    const director = movie.credits.crew.find(person => person.job === 'Director')?.name || 'Unknown';
    const cast = movie.credits.cast.slice(0, 5).map(person => person.name).join(', ');

    const container = document.querySelector('article');

    container.innerHTML = `
        <nav class="mb-8 text-sm italic">
            <a href="../pages/movies.html" class="text-zinc-400 hover:text-pink-500">All Films /</a>
            <span class="text-pink-500">${movie.title}</span>
        </nav>

        <div class="flex flex-col md:flex-row gap-12">
            <div class="w-full md:w-80 shrink-0">
                <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}" 
                     alt="${movie.title}" 
                     class="w-full rounded-2xl shadow-2xl border border-zinc-700">
            </div>

            <div class="flex flex-col gap-6">
                <div class="flex flex-wrap gap-3">
                    ${movie.genres.map(g => `
                        <span class="px-3 py-1 rounded-full border border-pink-600 text-pink-500 text-xs font-bold uppercase tracking-widest">${g.name}</span>
                    `).join('')}
                </div>

                <h1 class="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-tight">
                    ${movie.title}
                </h1>

                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl font-bold">${movie.vote_average.toFixed(1)}</span>
                        <span class="text-yellow-400 text-2xl">★</span>
                    </div>
                    <img src="../src/icons/IMDB_Logo_2016 1.svg" alt="IMDB" class="h-6 w-auto brightness-200">
                </div>

                <p class="text-zinc-400 text-lg leading-relaxed max-w-2xl italic">
                    ${movie.overview || "No description available."}
                </p>

                <div class="space-y-2">
                    <p><span class="text-pink-600 font-bold uppercase">Director:</span> ${director}</p>
                    <p class="leading-relaxed">
                        <span class="text-pink-600 font-bold uppercase">Cast:</span> ${cast}
                    </p>
                </div>

                <div class="mt-4">
                    <button onclick='handleAddToWatchlist(${JSON.stringify({
        id: movie.id,
        title: movie.title.replace(/'/g, ""),
        img: movie.poster_path,
        rating: movie.vote_average,
        overview: movie.overview ? movie.overview.replace(/'/g, "") : ""
    })})' 
                    class="bg-pink-600 hover:bg-pink-700 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(219,39,119,0.4)]">
                        Add to Watchlist
                    </button>
                </div>
            </div>
        </div>
    `;
}

window.handleAddToWatchlist = (movie) => {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (watchlist.some(item => item.id === movie.id)) {
        alert('Film ini sudah ada di dalam Watchlist kamu!');
    } else {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert('Berhasil ditambahkan ke Watchlist!');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const profileToggle = document.getElementById('profileToggle');
    const logoutMenu = document.getElementById('logoutMenu');
    const logoutBtn = document.getElementById('logoutBtn');

    profileToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        logoutMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
        logoutMenu?.classList.add('hidden');
    });

    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    fetchMovieDetails();
});