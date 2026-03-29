const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailErr = document.getElementById('emailError');
        const confirmErr = document.getElementById('confirmError');

        emailErr.classList.add('hidden');
        confirmErr.classList.add('hidden');

        // validasi email
        if (!emailPattern.test(email)) {
            emailErr.innerText = "Please enter a valid email address.";
            emailErr.classList.remove('hidden');
            return;
        }

        // validasi password
        if (password.length < 8) {
            confirmErr.innerText = "Password must be at least 8 characters.";
            confirmErr.classList.remove('hidden');
            return;
        }

        // validasi confirm password
        if (password !== confirmPassword) {
            confirmErr.innerText = "Passwords do not match.";
            confirmErr.classList.remove('hidden');
            return;
        }

        // simpan di local storage
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const isExist = existingUsers.find(user => user.email === email);

        if (isExist) {
            emailErr.innerText = "User already exists!";
            emailErr.classList.remove('hidden');
        } else {
            existingUsers.push({ email, password });
            localStorage.setItem('users', JSON.stringify(existingUsers));
            localStorage.setItem('users', JSON.stringify(existingUsers));
            
            window.location.href = 'login.html';
        }
    });
}