document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
        const response = await fetch('http://localhost:5000/users', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });
          
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Κάτι πήγε στραβά.');
      }
  
      alert('Ο χρήστης δημιουργήθηκε!');
    } catch (error) {
      console.error('Σφάλμα:', error);
      alert(error.message);
    }
  });
  