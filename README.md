# Git-Smart

Git-Smart is an intelligent GitHub repository analyzer that leverages AI to provide smart summaries of any public GitHub repository. Simply provide a repository URL, and Git-Smart fetches all the data via GitHub API, then uses the Groq Llama model to generate an insightful summary about what the repository does.

## Features

- **Repository URL Input** — Paste any public GitHub repository URL
- **GitHub API Integration** — Automatically fetches comprehensive repository data
- **AI-Powered Summaries** — Uses Groq Llama model to generate intelligent summaries
- **What It Does Analysis** — Understands and explains the purpose of any repository
- **Fast Processing** — Quick analysis and summary generation
- **Clean Interface** — Simple and intuitive user interface
- **No Configuration Needed** — Just paste a URL and get instant insights

## How It Works

1. Enter a public GitHub repository URL
2. Git-Smart fetches all repository data using GitHub API
3. The Groq Llama model analyzes the data
4. Get an AI-generated summary explaining what the repository is about
5. Learn the key features and purpose instantly

## Technologies Used

- **TypeScript** — Type-safe frontend application
- **Next.js** — Modern React framework for the web interface
- **Python** — Backend API and data processing
- **Groq Llama Model** — Advanced AI for intelligent repository analysis and summarization
- **GitHub API** — Repository data fetching and retrieval
- **CSS** — Responsive and clean UI design

## Getting Started

1. Clone the repository.
2. Install frontend dependencies: `npm install` (in the frontend directory)
3. Install backend dependencies: `pip install -r requirements.txt` (in the backend directory)
4. Configure your GitHub API token and Groq API key in environment variables
5. Start the Python backend server
6. Start the Next.js frontend development server:
   ```bash
   npm run dev
   ```
7. Open your browser to `http://localhost:3000`

## Usage

1. Visit the application homepage
2. Paste a public GitHub repository URL (e.g., `https://github.com/owner/repo`)
3. Click "Analyze Repository" or submit
4. Wait for Git-Smart to fetch the data and generate a summary
5. Read the AI-generated summary explaining what the repository does

## Example

```
Input: https://github.com/torvalds/linux
Output: AI-generated summary about the Linux kernel repository, its purpose, features, and contributions...
```

## License

This project is open-source and available under the MIT License.
