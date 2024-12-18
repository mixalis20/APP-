const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
});


  
// const validEmails = [
//     "test@example.com",
//     "user123@example.com",
//     "admin@domain.com"
// ];


// function checkEmail() {
//     const email = document.getElementById("emailInput").value;

//     if (validEmails.includes(email)) {

//         window.location.href = "/APP-/html/app.html"; 
//     } else {
//         alert("Email not recognized.");
//     }
// }

document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault();  

    
    const email = document.getElementById('email');
    console.log();
    // Validate email format using a regular expression
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (emailPattern.test(email)) {
        
        window.location.href = '/APP-/html/app.html';  
    } else {
        alert('Please enter a valid email address');
    }
});