# 🚀 VENTURA Brand Builder Battle 🎨

Welcome to **VENTURA Brand Builder Battle**, a dynamic platform designed for competitions where participants can showcase their creativity and products! 🌟 Buyers can purchase items using tokens, helping track team trades and determining winners. 🎯

## ✨ Features
- 🏆 **Showcase Products**: Display participant creations and compete!
- 💰 **Token-Based Transactions**: Easy-to-track sales and purchases.
- 📊 **Manage Standings**: Monitor competition performance in real-time.
- 🖥️ **User-Friendly Interface**: Smooth and intuitive experience for participants and buyers.

## 🚀 Deployment Guide

### 🛠️ Prerequisites
- Install **Node.js**, **npm**, and **Python**.
- Create accounts on **Vercel** and **Render**.

### 🌐 Frontend Deployment on Vercel

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nagesh-merva/VENTURA-brandbuilderbattle.git
   cd VENTURA-brandbuilderbattle/frontend

2. **Install dependencies**:
    ```bash
    npm install

3. **Set up environment variables**:
    Create a .env file with the required configurations.

4. **Deploy on Vercel**:
    Run vercel in the frontend directory.
    Follow the prompts, confirm the project settings, and deploy! 🎉
    Manage deployments via your Vercel dashboard.

5. **🖥️ Backend Deployment on Render**:    
    Navigate to the backend:
    ```bash
    cd VENTURA-brandbuilderbattle/backend

6. **Install dependencies**:
    ```bash
    pip install -r requirements.txt

7. **Configure environment variables**:
    Add database connections and secrets to your Render environment.[ USE MONGODB for database management]

6. **Deploy on Render**:
    Create a new web service on Render.
    Link it to the backend repository.
    Specify the start command: python app.py.
    🗄️ Database Configuration
    Use MongoDB: Create a MongoDB cluster or deploy it on Render.
    Set the connection string in the backend environment variables.

## 🎮 How to Use
    Participants: 
        Register and add your products 🏷️
        give specific QR codes for all buyers by accessing the /teamlist route and creating a QR of the link

    Buyers: 
        create a QR code of the frontend hosted link, ask buyers to scan.
        provide them credentials to login as entered in the backend from add buyers option.
        they get 150 coins to buy from the teams.
        buyers can now scan a teams QR to see the product and buy it and purchase items using tokens and pin provided 💳.

    Admins: 
        Track sales, monitor team and Buyers standings, and declare winners 🏅.

    📸 Screenshots
    Here's what the platform looks like! 


🤝 Contributing:
    Fork the repository 📂
    Create a new branch: git checkout -b feature-xyz 🌿
    Commit your changes: git commit -m 'Add new feature' 💡
    Push to the branch: git push origin feature-xyz 🚀
    Create a pull request 🔄


