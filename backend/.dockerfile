# Βασική εικόνα για Node.js
FROM node:16

# Ορισμός του working directory μέσα στο container
WORKDIR /app/backend

# Αντιγραφή του package.json και package-lock.json για να εγκατασταθούν οι εξαρτήσεις
COPY package*.json ./

# Εγκατάσταση των εξαρτήσεων
RUN npm install

# Αντιγραφή του υπόλοιπου κώδικα της εφαρμογής
COPY . .

# Έκθεση του port στο οποίο τρέχει η εφαρμογή
EXPOSE 5000

# Ορισμός της εντολής για να ξεκινήσει η εφαρμογή
CMD ["node", "app.js"]
