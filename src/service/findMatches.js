"use server";
import OpenAI from "openai";

// dummy data
const data = `
[
  {
    "id": "1",
    "name": "Alice Johnson",
    "avatar": "https://picsum.photos/id/1027/200",
    "lastMessage": "Hey, how's it going?",
    "timestamp": "2024-08-03T10:30:00Z",
    "bio": "Adventure seeker and coffee enthusiast. Always planning my next trip!",
    "age": 28,
    "location": "New York, NY",
    "prompts": [
      {
        "question": "My ideal first date",
        "answer": "A cozy cafe and a walk in Central Park"
      },
      {
        "question": "Two truths and a lie",
        "answer":
        "I've climbed Kilimanjaro, I can speak 3 languages, I've never had a brain freeze"
      },
      {
        "question": "My go-to karaoke song",
        "answer": "Don't Stop Believin' by Journey"
      }
    ],
    "pictures": [
      "https://picsum.photos/id/1027/400",
      "https://picsum.photos/id/1028/400",
      "https://picsum.photos/id/1029/400",
      "https://picsum.photos/id/1030/400"
    ]
  },
  {
    "id": "2",
    "name": "Bob Smith",
    "avatar": "https://picsum.photos/id/1025/200",
    "lastMessage": "Are you excited for the event?",
    "timestamp": "2024-08-03T09:45:00Z",
    "bio": "Tech geek by day, amateur chef by night. Ask me about my latest coding project or recipe!",
    "age": 32,
    "location": "San Francisco, CA",
    "prompts": [
      {
        "question": "My hidden talent",
        "answer": "I can solve a Rubik's cube in under 2 minutes"
      },
      {
        "question": "My favorite travel story",
        "answer":
        "Getting lost in Tokyo and stumbling upon the best ramen of my life"
      },
      {
        "question": "What I'm looking for",
        "answer": "Someone to explore new restaurants and tech meetups with"
      }
    ],
    "pictures": [
      "https://picsum.photos/id/1025/400",
      "https://picsum.photos/id/1031/400",
      "https://picsum.photos/id/1032/400",
      "https://picsum.photos/id/1033/400"
    ]
  },
  {
    "id": "3",
    "name": "Carol Davis",
    "avatar": "https://picsum.photos/id/1062/200",
    "lastMessage": "I love that band too!",
    "timestamp": "2024-08-02T18:20:00Z",
    "bio": "Music teacher with a passion for indie rock. Always on the hunt for new vinyl records.",
    "age": 26,
    "location": "Austin, TX",
    "prompts": [
      {
        "question": "My ultimate concert lineup",
        "answer": "The Strokes, Tame Impala, and Arctic Monkeys"
      },
      {
        "question": "A cause I care about",
        "answer": "Bringing music education to underfunded schools"
      },
      {
        "question": "My ideal weekend",
        "answer":
        "Record shopping, trying a new brunch spot, and ending with a live gig"
      }
    ],
    "pictures": [
      "https://picsum.photos/id/1062/400",
      "https://picsum.photos/id/1035/400",
      "https://picsum.photos/id/1036/400",
      "https://picsum.photos/id/1037/400"
    ]
  },
  {
    "id": "4",
    "name": "David Wilson",
    "avatar": "https://picsum.photos/id/1074/200",
    "lastMessage": "What's your favorite outdoor activity?",
    "timestamp": "2024-08-02T15:10:00Z",
    "bio": "Environmental scientist and weekend warrior. Happiest when I'm surrounded by nature.",
    "age": 30,
    "location": "Denver, CO",
    "prompts": [
      {
        "question": "My bucket list",
        "answer": "Hike the Pacific Crest Trail from start to finish"
      },
      {
        "question": "Best travel advice I've received",
        "answer": "Always pack a reusable water bottle and a good attitude"
      },
      {
        "question": "A random fact I love",
        "answer": "Honeybees can recognize human faces"
      }
    ],
    "pictures": [
      "https://picsum.photos/id/1074/400",
      "https://picsum.photos/id/1038/400",
      "https://picsum.photos/id/1039/400",
      "https://picsum.photos/id/1040/400"
    ]
  },
  {
    "id": "5",
    "name": "Eva Brown",
    "avatar": "https://picsum.photos/id/1069/200",
    "lastMessage": "Can't wait to meet you at the event!",
    "timestamp": "2024-08-01T22:05:00Z",
    "bio": "Yoga instructor and tea connoisseur. Seeking balance in life and love.",
    "age": 29,
    "location": "Los Angeles, CA",
    "prompts": [
      {
        "question": "My perfect morning routine",
        "answer": "Sunrise yoga, meditation, and a cup of Oolong tea"
      },
      {
        "question": "A skill I want to learn",
        "answer": "Aerial silks - it looks so graceful and challenging!"
      },
      {
        "question": "My happy place",
        "answer": "On my yoga mat, preferably on a beach at sunset"
      }
    ],
    "pictures": [
      "https://picsum.photos/id/1069/400",
      "https://picsum.photos/id/1041/400",
      "https://picsum.photos/id/1042/400",
      "https://picsum.photos/id/1043/400"
    ]
  },
  {
    "id": "6",
    "name": "Frank Lee",
    "avatar": "https://picsum.photos/id/1072/200",
    "lastMessage": "Do you have any song requests?",
    "timestamp": "2024-08-01T14:30:00Z",
    "bio": "DJ and electronic music producer. Life's better with a good beat!",
    "age": 34,
    "location": "Miami, FL",
    "prompts": [
      {
        "question": "My favorite way to unwind",
        "answer": "Creating new mixes in my home studio"
      },
      {
        "question": "A fun fact about me",
        "answer": "I once DJed for 24 hours straight for charity"
      },
      {
        "question": "My ideal partner",
        "answer": "Someone who appreciates good music and isn't afraid to dance"
      }
    ],
    "pictures": [
      "https://picsum.photos/id/1072/400",
      "https://picsum.photos/id/1044/400",
      "https://picsum.photos/id/1045/400",
      "https://picsum.photos/id/1046/400"
    ]
  }
]`;

/**
 * Enquire openAI for giving out reasons why they be a match
 * @param id
 * @param id2
 * @returns {Promise<any>}
 */
export async function findMatches(id, id2) {
  const openai = new OpenAI(process.env.OPENAI_API_KEY);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              `from this dataset of fellow users who will be attending the same event, please tell me why the user ${id} matches with the ${id2}. Please format your response to JSON format and only output similarity score (in field 'sim-score') in percentage, and the reasons why they might be similar (in field 'reasons')` +
              `The data is formatted in JSON:${data}`,
          },
        ],
      },
    ],
    model: "gpt-4o-mini",
  });
  const response = completion.choices[0].message.content.slice(7, -3);

  return JSON.parse(response);
}
