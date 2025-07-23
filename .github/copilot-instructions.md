# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a student ranking website project built with React, TypeScript, and Vite. The project uses Supabase for database and authentication.

## Project Structure and Guidelines

### Technology Stack
- Frontend: React 18 + TypeScript + Vite
- Database & Auth: Supabase
- UI: Custom CSS with responsive design
- Icons: Lucide React
- Routing: React Router DOM

### Key Features
1. Teacher authentication and login
2. Student management (add students)
3. Score recording with timestamps
4. Score modification
5. Student ranking display for visitors
6. Mobile-responsive design

### Database Schema
- Users table (for teachers)
- Students table (name, created_at)
- Scores table (student_id, score, date, created_at, updated_at)

### Code Style
- Use TypeScript interfaces for type safety
- Follow React functional components with hooks
- Use modern ES6+ syntax
- Implement responsive design with CSS Grid/Flexbox
- Handle loading states and errors gracefully

### Supabase Integration
- Use Row Level Security (RLS) policies
- Implement proper authentication flows
- Use Supabase real-time features for live updates
