# Bike-Mate

Welcome to Bike-Mate! 🏍️

Bike-Mate is a social mobile app designed for motorcycle enthusiasts to:
- Create, browse, and join ride events
- Follow other riders
- Manage and update their motorcycle profile
- Customize profile pictures
- Connect and interact with the riding community

---

## 🚀 Project Setup

1. **Install dependencies:**
    ```bash
    npm install
    ```

2. **Run the app locally:**
    ```bash
    npm start
    ```

This runs the app in development mode at [http://localhost:4200](http://localhost:4200).

---

## 👥 Features

- User Authentication (Firebase Auth)
- Firestore Database for storing user profiles, events, and followers
- Profile picture upload with Base64 encoding
- Create, edit, and delete ride events
- Follow/unfollow riders
- Responsive design optimized for mobile

---

## 👨‍💻 Tech Stack

- **Angular** (standalone components)
- **Ionic Framework** (UI toolkit)
- **Firebase** (Auth, Firestore, Storage)

---

## 💡 Important Notes

- Firebase rules must be correctly set for authentication, Firestore, and storage access.
- Images are stored as Base64 strings inside Firestore (no Firebase Storage upload for profile pictures).
- Make sure to update CORS rules if accessing Storage directly.

---

## 🏁 To-Do / Upcoming Improvements

- Push notifications for new events
- Direct messaging between users
- Group ride planning
- Improved search and filtering for events

---

## 🔒 License

This project is licensed under the [MIT License](LICENSE).

---

Enjoy the ride and stay safe! 🏍️✨
