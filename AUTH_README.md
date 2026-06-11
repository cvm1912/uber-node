# Auth Flow — Detailed Guide

## Folder Structure (Auth)

```
src/
├── model/
│   └── User.js               # MongoDB schema
├── repositories/
│   └── auth-repository.js    # Direct DB queries
├── services/
│   └── auth-service.js       # Business logic + JWT
├── controllers/
│   └── auth-controller.js    # HTTP request/response
└── routes/
    └── auth-routes.js        # Route definitions
```

---

## 1. Model — `User.js`

```js
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['driver', 'passenger'] },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
});
```

**Kya hai yahan:**
- `email` unique hai — ek email se sirf ek account ban sakta hai
- `role` sirf `driver` ya `passenger` ho sakta hai
- `location` GeoJSON `Point` format mein hai — nearby driver dhundhne ke liye
- `2dsphere` index lagaya hai location pe — geospatial queries ke liye zaroori hai

**Methods (User.js mein):**
```js
userSchema.methods.hashPassword = async (password) => { ... }  // bcrypt se hash karo
userSchema.methods.comparePassword = async (password) => { ... } // login pe compare karo
```

---

## 2. Repository — `auth-repository.js`

```js
const createUser = async ({ name, email, password, role }) => {
    const user = new User({ name, email, role });
    await user.hashPassword(password);   // plain password hash hoga
    return user.save();                  // MongoDB mein save
};

const findByEmail = (email) => User.findOne({ email });
```

**Kya karta hai:**
- Repository sirf DB se baat karta hai — koi logic nahi
- `createUser` — naya user banata hai, password hash karke save karta hai
- `findByEmail` — email se user dhundta hai (login ke liye)

---

## 3. Service — `auth-service.js`

```js
const generateToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = async ({ name, email, password, role }) => {
    const user = await authRepository.createUser({ name, email, password, role });
    return { token: generateToken(user), ...user };
};

const login = async ({ email, password }) => {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new Error('User not found');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid credentials');

    return { token: generateToken(user), ...user };
};
```

**Kya karta hai:**
- Service mein saari business logic hoti hai
- `register` — repository ko call karta hai user banane ke liye, phir JWT token generate karta hai
- `login` — pehle user dhundta hai, phir password compare karta hai, phir token deta hai
- `generateToken` — JWT token banata hai jisme `id` aur `role` hota hai, 7 din ke liye valid

---

## 4. Controller — `auth-controller.js`

```js
const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};
```

**Kya karta hai:**
- Controller HTTP request leta hai aur response bhejta hai
- Service ko call karta hai aur result ko JSON mein return karta hai
- Errors ko catch karke proper HTTP status code ke saath response deta hai
  - `400` — register fail (email already exists, etc.)
  - `401` — login fail (wrong password, user not found)

---

## 5. Routes — `auth-routes.js`

```js
router.post('/register', register);
router.post('/login', login);
```

**Endpoints:**
| Method | URL | Body | Response |
|--------|-----|------|----------|
| POST | `/api/auth/register` | `{ name, email, password, role }` | `{ token, id, name, email, role }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ token, id, name, email, role }` |

---

## Full Request Flow

```
HTTP Request
    ↓
auth-routes.js        — URL ko sahi controller function pe bhejta hai
    ↓
auth-controller.js    — req.body leta hai, service call karta hai, res bhejta hai
    ↓
auth-service.js       — business logic: validate, hash check, token generate
    ↓
auth-repository.js    — MongoDB se data read/write karta hai
    ↓
User.js (Model)       — MongoDB ka actual schema
```

---

## Token Use Karna (Protected Routes)

Register/Login ke baad jo token mile, use har request mein bhejo:

```
Authorization: Bearer <token>
```

`authMiddleware.js` token verify karta hai aur `req.user` mein `{ id, role }` set karta hai.

---

## .env Variables

```
JWT_SECRET=your_strong_secret_here
MONGO_URI=your_mongodb_connection_string
PORT=8080
```
