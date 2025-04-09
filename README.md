# CourseGPT

CourseGPT is a modern web application built with Next.js that helps educators and content creators generate structured course content using AI. The application provides an intuitive interface for creating, managing, and organizing educational modules and lessons.


![Screenshot 2025-04-10 000823](https://github.com/user-attachments/assets/ea68a8e4-85e6-4f7c-a3da-382bd7345133)
![Screenshot 2025-04-10 000720](https://github.com/user-attachments/assets/c21cbf1d-a14b-468f-81d1-2efb45740fd7)
![Screenshot 2025-04-10 000735](https://github.com/user-attachments/assets/5d150fc5-381c-4def-a443-06d382ab67dd)
![Screenshot 2025-04-10 000918](https://github.com/user-attachments/assets/1c78487f-a51d-427d-a09b-2f1383b7e8ce)

## Features

- 🎓 AI-powered lesson generation
- 📚 Module management system
- 🎨 Modern UI with Tailwind CSS and Shadcn UI
- 🔄 Drag-and-drop lesson organization
- 📱 Responsive design
- 🔒 Type-safe development with TypeScript
- 🚀 Server-side rendering with Next.js
- 💾 State management with Zustand

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **UI Components**: 
  - Tailwind CSS
  - Shadcn UI
  - Radix UI
- **State Management**: Zustand
- **Validation**: Zod
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/coursegpt.git
   cd coursegpt
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
coursegpt/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and API calls
├── store/           # Zustand store
├── types/           # TypeScript type definitions
├── public/          # Static assets
└── styles/          # Global styles
```
