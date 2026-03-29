const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Element Error dari HTML Login
        const emailErr = document.getElementById('emailError');
        const passwordErr = document.getElementById('passwordError');

        emailErr.classList.add('hidden');
        passwordErr.classList.add('hidden');

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validasi Format Input
        let hasError = false;
        if (!emailPattern.test(email)) {
            emailErr.innerText = "Please enter a valid email address.";
            emailErr.classList.remove('hidden');
            hasError = true;
        }
        if (password.length < 8) {
            passwordErr.innerText = "Password must be at least 8 characters.";
            passwordErr.classList.remove('hidden');
            hasError = true;
        }
        if (hasError) return; // Berhenti jika format salah

        // Ambil Database dari Local Storage (Data dari Signup)
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        // Cari User di Database
        const registeredUser = existingUsers.find(user => user.email === email);

        if (!registeredUser) {
            // Email tidak ada di localStorage
            emailErr.innerText = "Email not found. Please register first!";
            emailErr.classList.remove('hidden');
        } else if (registeredUser.password !== password) {
            // Email ada, tapi password salah
            passwordErr.innerText = "Incorrect password!";
            passwordErr.classList.remove('hidden');
        } else {
            // BERHASIL LOGIN
            // Simpan sesi user yang sedang aktif
            localStorage.setItem('currentUser', JSON.stringify({
                email: registeredUser.email,
                status: 'online'
            }));
            window.location.href = 'movies.html';
        }
    });
}