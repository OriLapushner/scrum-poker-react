# Scrum Poker React

A real-time planning poker application built with React, Next.js, and Socket.IO for agile teams to facilitate story point estimation sessions.

**🌐 Live at: [scrum-poker.site](scrum-poker.site)**

## 🚀 Features

- **Real-time Collaboration**: Seamless voting experience with instant updates across all participants
- **Create Your Own Deck**: Choose from premade decks or make your own deck to fit your team's need.
- **Easy to Use**: No complex setup required - create a room, share the link, and start estimating
- **Vote History**: Keep track of previously estimated items for future reference

## 📋 Tech Stack

- **Frontend**: React 19, Next.js 15, TypeScript
- **State Management**: Zustand
- **UI Components**: Shadcn with Tailwind CSS
- **Real-time Communication**: Socket.IO

## 🔒 Backend

This repository contains only the frontend code for the Scrum Poker application. The backend code is closed-source and maintained separately. The frontend communicates with the backend via Socket.IO for real-time updates.

## 🛠️ Setup & Development

### Prerequisites

- Node.js 18+ and npm/yarn

## 📝 Usage

1. Create a new room with your preferred estimation deck
2. Share the room link with your team members
3. Vote on stories as they are discussed
4. Reveal the votes when everyone has voted
5. Start a new round for the next story
