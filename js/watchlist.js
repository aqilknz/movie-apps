document.addEventListener('DOMContentLoaded', () => {
    // CEK SESSION 
    const session = JSON.parse(localStorage.getItem('currentUser'));
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    // DROPDOWN PROFIL
    const profileToggle = document.getElementById('profileToggle');
    const logoutMenu = document.getElementById('logoutMenu');
    const logoutBtn = document.getElementById('logoutBtn');

    // Toggle Menu Logout
    profileToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        logoutMenu?.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
        logoutMenu?.classList.add('hidden');
    });
    //logout
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    renderWatchlist();
});

function renderWatchlist() {
    const container = document.getElementById('watchlistContainer');
    const countElement = document.getElementById('watchlistCount');
    const emptyState = document.getElementById('emptyState');
    
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const IMG_URL = 'https://image.tmdb.org/t/p/w500';

    countElement.innerText = watchlist.length;

    if (watchlist.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = '';

    watchlist.forEach(movie => {
        const movieItem = `
            <article class="flex flex-col md:flex-row gap-8 bg-zinc-800 p-6 rounded-2xl border border-zinc-800 hover:border-pink-600/50 transition duration-300 group">
                <div class="shrink-0 overflow-hidden rounded-xl shadow-lg">
                    <img src="${movie.img ? IMG_URL + movie.img : 'https://via.placeholder.com/160x240'}" 
                         class="w-40 h-60 object-cover transform group-hover:scale-105 transition duration-500">
                </div>
                
                <div class="flex-grow pt-2">
                    <h2 class="text-2xl font-bold mb-2 group-hover:text-pink-500 transition">${movie.title}</h2>
                    
                    <div class="flex items-center gap-2 text-xs font-bold text-yellow-500 mb-4">
                        <img src="../src/icons/IMDB_Logo_2016 1.svg" alt="IMDB" class="h-4 w-auto brightness-200">
                        <span>${movie.rating ? movie.rating.toFixed(1) : '0.0'} ★</span>
                    </div>

                    <p class="text-zinc-400 text-sm leading-relaxed max-w-3xl mb-8 line-clamp-3">
                        ${movie.overview || 'No description available for this movie.'}
                    </p>

                    <div class="flex gap-4">
                        <button onclick="viewDetails(${movie.id})" 
                            class="bg-white text-black px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 hover:text-white transition duration-300 shadow-md">
                            View Details
                        </button>
                        <button onclick="removeFromWatchlist(${movie.id})" 
                            class="bg-zinc-800 border border-zinc-600 text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 hover:border-pink-600 transition duration-300">
                            Remove From Watchlist
                        </button>
                    </div>
                </div>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', movieItem);
    });
}

window.removeFromWatchlist = (id) => {
    if (confirm('Remove this movie from your watchlist?')) {
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        localStorage.setItem('watchlist', JSON.stringify(watchlist.filter(m => m.id !== id)));
        renderWatchlist();
    }
};

// loogut
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
}

window.viewDetails = (id) => {
    localStorage.setItem('selectedMovieId', id);
    window.location.href = '#';
};