# 🎭 Theatre Booking App

**Μάθημα:** Mobile & Distributed Systems (CN6035)  
**Φοιτητής:** Aggelos Lalafragkos-Tolias  
**Κωδικός Φοιτητή:** 2678441  

Εφαρμογή κινητού για κράτηση θέσεων σε θεατρικές παραστάσεις. Υλοποιεί πλήρες κατανεμημένο σύστημα τριών επιπέδων (Frontend – Backend – Database).

---

## 📁 Δομή Project

```
theatre-booking-app/
├── theatre-backend/       # Node.js & Express REST API
│   ├── controllers/       # Business logic
│   ├── middleware/        # JWT Authentication
│   ├── routes/            # API Routes
│   ├── db.js              # MariaDB Connection
│   └── server.js          # Entry point
└── theatre-frontend/      # React Native (Expo)
    ├── src/screens/       # App Screens
    ├── api.js             # Axios API client
    └── App.js             # Navigation setup
```

---

## ⚙️ Οδηγίες Εγκατάστασης

### Προαπαιτούμενα

- Node.js v18+
- MariaDB 11.4+
- Expo Go (για κινητό) ή browser

### 1. Βάση Δεδομένων

Συνδέσου στη MariaDB και τρέξε:

```sql
CREATE DATABASE theatre_booking;
USE theatre_booking;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE theatres (
    theatre_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shows (
    show_id INT AUTO_INCREMENT PRIMARY KEY,
    theatre_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration INT,
    age_rating VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id) ON DELETE CASCADE
);

CREATE TABLE showtimes (
    showtime_id INT AUTO_INCREMENT PRIMARY KEY,
    show_id INT NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (show_id) REFERENCES shows(show_id) ON DELETE CASCADE
);

CREATE TABLE reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    showtime_id INT NOT NULL,
    tickets INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id) ON DELETE CASCADE
);
```

### 2. Backend

```bash
cd theatre-backend
npm install
```

Δημιούργησε αρχείο `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=theatre_booking
JWT_SECRET=theatresecretkey123
PORT=3001
```

Εκκίνηση server:

```bash
node server.js
```

Ο server τρέχει στο: `http://localhost:3001`

### 3. Frontend

```bash
cd theatre-frontend
npm install
npx expo start
```

Πάτα **w** για εκτέλεση στον browser ή σκανάρισε το QR code με το Expo Go.

---

## 🌐 API Endpoints

| Method | Endpoint | Περιγραφή | Auth |
|--------|----------|-----------|------|
| POST | `/register` | Εγγραφή χρήστη | ❌ |
| POST | `/login` | Σύνδεση & JWT token | ❌ |
| GET | `/theatres` | Λίστα θεάτρων | ✅ |
| GET | `/shows` | Λίστα παραστάσεων | ✅ |
| GET | `/showtimes` | Διαθέσιμα ωράρια | ✅ |
| POST | `/reservations` | Δημιουργία κράτησης | ✅ |
| GET | `/reservations/user` | Κρατήσεις χρήστη | ✅ |
| DELETE | `/reservations/:id` | Ακύρωση κράτησης | ✅ |

> ✅ = Απαιτείται JWT token στο header: `Authorization: Bearer <token>`

---

## 📱 Screens

| Screen | Περιγραφή |
|--------|-----------|
| Login | Σύνδεση με email & password |
| Register | Εγγραφή νέου χρήστη |
| Theatres | Λίστα θεάτρων με αναζήτηση |
| Shows | Παραστάσεις ανά θέατρο |
| Showtimes | Διαθέσιμες ημερομηνίες & ώρες |
| Booking | Κράτηση εισιτηρίων με υπολογισμό τιμής |
| Profile | Ιστορικό & ακύρωση κρατήσεων |

---

## 🛠️ Τεχνολογίες

| Layer | Τεχνολογία |
|-------|-----------|
| Frontend | React Native, Expo, React Navigation |
| Backend | Node.js, Express.js |
| Database | MariaDB |
| Auth | JWT (jsonwebtoken), bcryptjs |
| HTTP Client | Axios |
| Storage | AsyncStorage (@react-native-async-storage) |

---

## 📊 Βάση Δεδομένων

```
users ──────────────────────────────┐
                                    │
theatres ──→ shows ──→ showtimes ──→ reservations
                                    │
                                    └── users
```

---

## 🔐 Ασφάλεια

- Passwords αποθηκεύονται με **bcrypt hashing** (salt rounds: 10)
- Authentication με **JWT tokens** (24h expiry)
- Προστασία endpoints με **JWT Middleware**
- Κρατήσεις με **database transactions** και `SELECT FOR UPDATE` για αποφυγή overbooking
- Token αποθήκευση με **AsyncStorage** (React Native safe)

---

## 🔧 Διορθώσεις & Βελτιώσεις

- **AsyncStorage** αντί `localStorage` για συμβατότητα με React Native (mobile)
- **Database transactions** (`BEGIN` / `COMMIT` / `ROLLBACK`) στις κρατήσεις για ασφαλή ταυτόχρονη πρόσβαση
- **Connection leak fix**: `finally { conn.release() }` σε όλους τους controllers
- **Auto-login** μετά την εγγραφή — δεν χρειάζεται ξεχωριστό βήμα σύνδεσης
- **Auto-refresh θέσεων** με `useFocusEffect` στο ShowtimesScreen κάθε φορά που επιστρέφει ο χρήστης
