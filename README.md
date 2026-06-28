 # ML-Repo-Architect 🚀

> **🏆 Kaggle - Google 5-Day AI Agents: Intensive Vibe Coding Course Hackathon Capstone Project**
>
> **Developer:** Manas Sharma

---

# 💡 Why This Project Was Built

Writing documentation is often one of the most tedious parts of software development. **ML-Repo-Architect** was created to automate this process.

It features an autonomous AI agent capable of:

* Reading complex codebases
* Understanding project structure
* Analyzing files and dependencies
* Generating clean, production-grade documentation automatically

This allows developers to focus on building and "vibe coding" while the AI handles the documentation workload.

---

# 📌 Overview

ML-Repo-Architect is an AI-powered documentation generator built using Next.js and AI agent technologies.

The application analyzes repositories, understands their architecture, and automatically generates structured README files and project documentation.

The project includes:

* Next.js frontend
* API routes for AI-powered generation
* MCP (Model Context Protocol) integrations
* Repository analysis utilities
* AI agent documentation and workflows

---
### 🏗️ System Architecture Workflow
<img width="1536" height="1024" alt="Image" src="https://github.com/user-attachments/assets/6b57ee0b-9e17-47f0-9e37-3b1d58d22063" />

--- 

# ✨ Features

* 🤖 Autonomous AI Documentation Generation
* 📂 Repository Structure Analysis
* 📝 Automated README Creation
* 🔍 Codebase Understanding
* ⚡ Next.js Powered Frontend
* 🔗 GitHub Integration via MCP
* 📁 Filesystem Access via MCP
* 🚀 Production-Ready Documentation Output

---

# 📂 Project Structure

```text
.
├── AGENTS.md
├── CLAUDE.md
├── fibonacci.py
├── package.json
├── next.config.mjs
├── postcss.config.mjs
├── eslint.config.mjs
├── jsconfig.json
├── .gitignore
├── README.md
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.js
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── lib/
│   ├── filesystem-mcp-server.mjs
│   └── github-mcp-server.mjs
└── public/
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    └── window.svg
```

---



# 🔍 Key Components

## app/

Contains the main Next.js application.

### app/api/generate/route.js

API endpoint responsible for handling generation requests and interacting with AI models.

### app/page.js

Main user interface page of the application.

### app/layout.js

Root layout configuration for the Next.js application.

---

## lib/

Contains utility services and MCP integrations.

### filesystem-mcp-server.mjs

Provides filesystem access for repository analysis.

### github-mcp-server.mjs

Provides GitHub integration capabilities.

---

## AGENTS.md

Documentation related to AI agents and workflows used within the project.

---

## CLAUDE.md

Documentation and notes related to Claude AI integration.

---

## fibonacci.py

Sample Python script included for testing, demonstrations, or utility purposes.

---

## public/

Stores static assets such as SVG icons and images.

---

# 🚀 Setup Instructions

## Prerequisites

Before getting started, ensure you have:

* Node.js (LTS Version Recommended)
* npm or yarn

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ManasDevHub00/ML-Repo-Architect.git
cd ML-Repo-Architect
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

---

# ▶️ Running the Development Server

Start the Next.js development server:

Using npm:

```bash
npm run dev
```

Using yarn:

```bash
yarn dev
```

Open:

```text
http://localhost:3000
```

in your browser to view the application.

You can begin editing the project by modifying:

```text
app/page.js
```

The page will automatically refresh as changes are made.

---

# 🏗️ Building for Production

Create an optimized production build:

Using npm:

```bash
npm run build
```

Using yarn:

```bash
yarn build
```

---

# 🚀 Start Production Server

After building:

Using npm:

```bash
npm run start
```

Using yarn:

```bash
yarn start
```

---

# 🛠️ Usage

1. Run the application locally.
2. Open the web interface.
3. Submit repository information for analysis.
4. The AI agent scans the repository structure.
5. Documentation is automatically generated.
6. Export or use the generated README and project documentation.

The API endpoint located at:

```text
app/api/generate/route.js
```

handles AI-powered generation requests and can be accessed either through the frontend interface or programmatically depending on implementation.

---

# 🎯 Use Cases

* Open Source Projects
* Personal Portfolio Projects
* Startup Repositories
* AI Projects
* Machine Learning Repositories
* Hackathon Submissions
* Internal Team Documentation

---

# 🏆 Hackathon Submission

This project was developed as a capstone submission for:

**Google × Kaggle**
**5-Day AI Agents: Intensive Vibe Coding Course Hackathon**

The goal was to demonstrate how autonomous AI agents can reduce developer workload by automatically generating professional documentation from existing codebases.

---

# 👨‍💻 Developer

**Manas Sharma**

GitHub: https://github.com/ManasDevHub00

---

# 📜 License

This project is open-source and available under the MIT License.

 
