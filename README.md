This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

# Made with love <3

# Challenges
## 1. Recommending matches
- One of our biggest challenge is how can it recommend other attendees of an event and how they can be matched. 
  . At first, we developed a machine learning algorithm to check for the similarity from the prompts. However, 
  it means that we need to create another server which can run Python script. 
- After that, we remembered that OpenAI is perfect at analysing data. Therefore, we utilises OpenAI to analyse their 
  profiles and gives out reasons why they might be a match. Users can use that as a ice breaker and create 
  meaningful conversation
## 2. Chat
- One of an important aspects of the app is chat function. When first thought using conventional database should 
  work well. However, we realised the response time is slow and some of the messages are not updated correctly.
- By utilising Firebase Real-time Database, not only it preserves the quality of the chat, but provides an excellent 
  reliability, even if the database are offline (as provided by google)
