"""
seed_books.py - Populates SQLite Database with 50+ Curated, Authentic Books
Includes authentic English, Hindi, and Marathi literature across diverse genres,
moods, difficulty levels, and reading purposes with valid book cover images.
"""

from database import init_db, get_db_connection

BOOKS_DATA = [
    # ==========================
    # ENGLISH BOOKS (1 - 26)
    # ==========================
    {
        "title": "Atomic Habits",
        "author": "James Clear",
        "genre": "Self-Help",
        "description": "An easy and proven way to build good habits and break bad ones through tiny changes that deliver remarkable results.",
        "language": "English",
        "pages": 320,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Motivated",
        "reading_purpose": "Personal Development",
        "cover_image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    },
    {
        "title": "The Alchemist",
        "author": "Paulo Coelho",
        "genre": "Fiction",
        "description": "A magical story about following your dreams and listening to your heart through the journey of an Andalusian shepherd boy named Santiago.",
        "language": "English",
        "pages": 208,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Relaxed",
        "reading_purpose": "Motivation",
        "cover_image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
        "rating": 4.7
    },
    {
        "title": "Rich Dad Poor Dad",
        "author": "Robert T. Kiyosaki",
        "genre": "Self-Help",
        "description": "What the rich teach their kids about money that the poor and middle class do not. The foundation of personal financial literacy.",
        "language": "English",
        "pages": 336,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Motivated",
        "reading_purpose": "Knowledge",
        "cover_image": "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&auto=format&fit=crop&q=80",
        "rating": 4.6
    },
    {
        "title": "Harry Potter and the Sorcerer's Stone",
        "author": "J.K. Rowling",
        "genre": "Fantasy",
        "description": "A young wizard discovers his magical heritage upon receiving an acceptance letter to Hogwarts School of Witchcraft and Wizardry.",
        "language": "English",
        "pages": 320,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Adventurous",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=600&auto=format&fit=crop&q=80",
        "rating": 4.8
    },
    {
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "genre": "Fantasy",
        "description": "Bilbo Baggins, a peaceful hobbit, is whisked away into an epic quest to reclaim the lost Dwarf Kingdom of Erebor from the dragon Smaug.",
        "language": "English",
        "pages": 310,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Adventurous",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=600&auto=format&fit=crop&q=80",
        "rating": 4.8
    },
    {
        "title": "A Brief History of Time",
        "author": "Stephen Hawking",
        "genre": "Science Fiction",
        "description": "A landmark exploration of profound questions about the universe: Where did it begin? Is time travel possible? What lies inside black holes?",
        "language": "English",
        "pages": 256,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Curious",
        "reading_purpose": "Knowledge",
        "cover_image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
        "rating": 4.7
    },
    {
        "title": "The Psychology of Money",
        "author": "Morgan Housel",
        "genre": "Self-Help",
        "description": "Doing well with money isn't necessarily about what you know. It's about how you behave. Timeless lessons on wealth, greed, and happiness.",
        "language": "English",
        "pages": 252,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Curious",
        "reading_purpose": "Knowledge",
        "cover_image": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
        "rating": 4.8
    },
    {
        "title": "Wings of Fire",
        "author": "A.P.J. Abdul Kalam",
        "genre": "Biography",
        "description": "An inspiring autobiography of the Missile Man of India, detailing his journey from a humble boat owner's son in Rameswaram to the President of India.",
        "language": "English",
        "pages": 180,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Motivated",
        "reading_purpose": "Motivation",
        "cover_image": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    },
    {
        "title": "The Hound of the Baskervilles",
        "author": "Arthur Conan Doyle",
        "genre": "Mystery",
        "description": "Sherlock Holmes and Dr. Watson investigate the legendary curse of a demonic hound haunting the eerie Dartmoor moors.",
        "language": "English",
        "pages": 190,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Curious",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80",
        "rating": 4.7
    },
    {
        "title": "And Then There Were None",
        "author": "Agatha Christie",
        "genre": "Mystery",
        "description": "Ten strangers are lured to an isolated island mansion off the Devon coast and murdered one by one according to an ominous nursery rhyme.",
        "language": "English",
        "pages": 272,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Curious",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    },
    {
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "genre": "Romance",
        "description": "The turbulent relationship between Elizabeth Bennet, daughter of a country gentleman, and Fitzwilliam Darcy, a rich aristocratic landowner.",
        "language": "English",
        "pages": 432,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Emotional",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80",
        "rating": 4.6
    },
    {
        "title": "Me Before You",
        "author": "Jojo Moyes",
        "genre": "Romance",
        "description": "Louisa Clark takes a job caring for Will Traynor, a wealthy young banker left wheelchair-bound after an accident. An emotional, unforgettable tale.",
        "language": "English",
        "pages": 384,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Emotional",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&auto=format&fit=crop&q=80",
        "rating": 4.5
    },
    {
        "title": "Dune",
        "author": "Frank Herbert",
        "genre": "Science Fiction",
        "description": "Set on the harsh desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
        "language": "English",
        "pages": 688,
        "reading_difficulty": "Advanced",
        "suitable_mood": "Adventurous",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
        "rating": 4.8
    },
    {
        "title": "Project Hail Mary",
        "author": "Andy Weir",
        "genre": "Science Fiction",
        "description": "Ryland Grace is the sole survivor on a desperate, last-chance scientific mission to save humanity from an extinction-level solar anomaly.",
        "language": "English",
        "pages": 496,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Curious",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    },
    {
        "title": "The Shining",
        "author": "Stephen King",
        "genre": "Horror",
        "description": "Jack Torrance becomes winter caretaker at the isolated Overlook Hotel, where sinister supernatural forces gradually push him into madness.",
        "language": "English",
        "pages": 447,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Emotional",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80",
        "rating": 4.7
    },
    {
        "title": "Dracula",
        "author": "Bram Stoker",
        "genre": "Horror",
        "description": "The gothic epistolary masterpiece detailing Count Dracula's attempt to move from Transylvania to England to spread the undead curse.",
        "language": "English",
        "pages": 418,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Curious",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
        "rating": 4.6
    },
    {
        "title": "Steve Jobs",
        "author": "Walter Isaacson",
        "genre": "Biography",
        "description": "The definitive biography of Apple's visionary founder, built on unprecedented interviews with Jobs, family, friends, and competitors.",
        "language": "English",
        "pages": 656,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Motivated",
        "reading_purpose": "Knowledge",
        "cover_image": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80",
        "rating": 4.7
    },
    {
        "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
        "author": "Robert C. Martin",
        "genre": "Technology",
        "description": "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Master software craftsmanship.",
        "language": "English",
        "pages": 464,
        "reading_difficulty": "Advanced",
        "suitable_mood": "Curious",
        "reading_purpose": "Learning",
        "cover_image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
        "rating": 4.8
    },
    {
        "title": "The Pragmatic Programmer",
        "author": "Andrew Hunt & David Thomas",
        "genre": "Technology",
        "description": "One of the most influential software engineering books ever written, offering timeless practical advice for modern coders and architects.",
        "language": "English",
        "pages": 352,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Curious",
        "reading_purpose": "Learning",
        "cover_image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    },
    {
        "title": "Sapiens: A Brief History of Humankind",
        "author": "Yuval Noah Harari",
        "genre": "History",
        "description": "How an insignificant ape became the ruler of planet Earth: from hunter-gatherer roots to cognitive, agricultural, and scientific revolutions.",
        "language": "English",
        "pages": 498,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Curious",
        "reading_purpose": "Knowledge",
        "cover_image": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80",
        "rating": 4.8
    },
    {
        "title": "Guns, Germs, and Steel",
        "author": "Jared Diamond",
        "genre": "History",
        "description": "A Pulitzer Prize-winning examination of how geographic and environmental factors shaped the modern world's civilizations.",
        "language": "English",
        "pages": 528,
        "reading_difficulty": "Advanced",
        "suitable_mood": "Curious",
        "reading_purpose": "Knowledge",
        "cover_image": "https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=600&auto=format&fit=crop&q=80",
        "rating": 4.5
    },
    {
        "title": "The Power of Your Subconscious Mind",
        "author": "Joseph Murphy",
        "genre": "Self-Help",
        "description": "Learn spiritual and psychological techniques to tap into the hidden powerhouse within your mind to bring success, healing, and peace.",
        "language": "English",
        "pages": 304,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Relaxed",
        "reading_purpose": "Personal Development",
        "cover_image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80",
        "rating": 4.6
    },
    {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "genre": "Fiction",
        "description": "Through the eyes of young Scout Finch, a searing exploration of racial injustice, courage, and compassion in the American South.",
        "language": "English",
        "pages": 336,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Emotional",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
        "rating": 4.8
    },
    {
        "title": "Designing Data-Intensive Applications",
        "author": "Martin Kleppmann",
        "genre": "Technology",
        "description": "The indispensable guide for software architects navigating distributed storage, stream processing, replication, and consensus.",
        "language": "English",
        "pages": 616,
        "reading_difficulty": "Advanced",
        "suitable_mood": "Curious",
        "reading_purpose": "Learning",
        "cover_image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    },
    {
        "title": "Deep Work",
        "author": "Cal Newport",
        "genre": "Self-Help",
        "description": "Rules for focused success in a distracted world. The superpower of achieving intense cognitive concentration to master complicated skills.",
        "language": "English",
        "pages": 304,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Motivated",
        "reading_purpose": "Personal Development",
        "cover_image": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80",
        "rating": 4.7
    },
    {
        "title": "Animal Farm",
        "author": "George Orwell",
        "genre": "Fiction",
        "description": "A brilliant satirical allegory about a farm where the oppressed animals overthrow their human master, only to descend into tyranny.",
        "language": "English",
        "pages": 140,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Curious",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600&auto=format&fit=crop&q=80",
        "rating": 4.7
    },

    # ==========================
    # HINDI BOOKS (27 - 40)
    # ==========================
    {
        "title": "Godan (गोदान)",
        "author": "Munshi Premchand",
        "genre": "Fiction",
        "description": "Considered the greatest Hindi novel of all time, Godan depicts the socio-economic deprivation and exploitation of the Indian peasantry through Hori.",
        "language": "Hindi",
        "pages": 396,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Emotional",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    },
    {
        "title": "Gunahon Ka Devta (गुनाहों का देवता)",
        "author": "Dharamvir Bharati",
        "genre": "Romance",
        "description": "An evergreen romantic tragedy exploring ideal love, societal barriers, and deep emotional turmoil between Chander and Sudha.",
        "language": "Hindi",
        "pages": 240,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Emotional",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80",
        "rating": 4.8
    },
    {
        "title": "Madhushala (मधुशाला)",
        "author": "Harivansh Rai Bachchan",
        "genre": "Fiction",
        "description": "A poetic masterpiece of 135 four-line quatrains (Ruba'iyat) using wine, cup, and tavern as profound metaphors for life's complexities and unity.",
        "language": "Hindi",
        "pages": 120,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Relaxed",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    },
    {
        "title": "Raag Darbari (राग दरबारी)",
        "author": "Shrilal Shukla",
        "genre": "Fiction",
        "description": "A biting satirical novel that ruthlessly exposes the post-independence rural politics, corruption, and systemic decay in the village of Shivpalganj.",
        "language": "Hindi",
        "pages": 344,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Curious",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1471970471555-bf5d1b32822b?w=600&auto=format&fit=crop&q=80",
        "rating": 4.8
    },
    {
        "title": "Rashmirathi (रश्मिरथी)",
        "author": "Ramdhari Singh Dinkar",
        "genre": "Fiction",
        "description": "An epic Hindi poem capturing the magnificent life, unwavering valor, charity, and tragic heroism of Karna from the Mahabharata.",
        "language": "Hindi",
        "pages": 160,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Motivated",
        "reading_purpose": "Motivation",
        "cover_image": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    },
    {
        "title": "Tamas (तमस)",
        "author": "Bhisham Sahni",
        "genre": "History",
        "description": "A harrowing, realistic depiction of the communal riots and human tragedy during the partition of India in 1947.",
        "language": "Hindi",
        "pages": 312,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Emotional",
        "reading_purpose": "Knowledge",
        "cover_image": "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=600&auto=format&fit=crop&q=80",
        "rating": 4.7
    },
    {
        "title": "Nirmala (निर्मला)",
        "author": "Munshi Premchand",
        "genre": "Fiction",
        "description": "A sensitive and heart-wrenching novel addressing the evils of the dowry system and mismatch marriages in pre-independence Indian society.",
        "language": "Hindi",
        "pages": 192,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Emotional",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
        "rating": 4.7
    },
    {
        "title": "Chandrakanta (चन्द्रकान्ता)",
        "author": "Devaki Nandan Khatri",
        "genre": "Fantasy",
        "description": "The pioneer fantasy work in Hindi literature involving magical tilism, ingenious aiyyars (spies), romance, and political intrigues.",
        "language": "Hindi",
        "pages": 448,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Adventurous",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
        "rating": 4.6
    },
    {
        "title": "Kitne Pakistan (कितने पाकिस्तान)",
        "author": "Kamleshwar",
        "genre": "History",
        "description": "A unique historical fiction where historical figures appear before a surreal court of conscience discussing hatred, borders, and humanity.",
        "language": "Hindi",
        "pages": 360,
        "reading_difficulty": "Advanced",
        "suitable_mood": "Curious",
        "reading_purpose": "Knowledge",
        "cover_image": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80",
        "rating": 4.8
    },
    {
        "title": "Byomkesh Bakshi Rahasyagatha (ब्योमकेश बक्शी)",
        "author": "Sharadindu Bandyopadhyay (Hindi Tr.)",
        "genre": "Mystery",
        "description": "The fascinating investigations of India's iconic truth-seeker (Satyanweshi) Byomkesh Bakshi solving perplexing crimes in colonial Calcutta.",
        "language": "Hindi",
        "pages": 280,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Curious",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80",
        "rating": 4.8
    },
    {
        "title": "Aapka Banti (आपका बंटी)",
        "author": "Mannu Bhandari",
        "genre": "Fiction",
        "description": "A deeply moving psychological novel examining the devastating emotional impact of parental divorce through the innocent perspective of a child.",
        "language": "Hindi",
        "pages": 208,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Emotional",
        "reading_purpose": "Personal Development",
        "cover_image": "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80",
        "rating": 4.7
    },
    {
        "title": "Jeet Aapki (जीत आपकी)",
        "author": "Shiv Khera",
        "genre": "Self-Help",
        "description": "Winners don't do different things; they do things differently. A practical, step-by-step roadmap for building confidence and achieving success.",
        "language": "Hindi",
        "pages": 288,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Motivated",
        "reading_purpose": "Personal Development",
        "cover_image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
        "rating": 4.6
    },
    {
        "title": "Meri Jeevan Yatra (मेरी जीवन यात्रा)",
        "author": "Rahul Sankrityayan",
        "genre": "Biography",
        "description": "The rich memoirs of Maha-pandit Rahul Sankrityayan, father of Hindi travelogue literature, polymath, scholar, and fearless traveler.",
        "language": "Hindi",
        "pages": 480,
        "reading_difficulty": "Advanced",
        "suitable_mood": "Adventurous",
        "reading_purpose": "Knowledge",
        "cover_image": "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=600&auto=format&fit=crop&q=80",
        "rating": 4.7
    },
    {
        "title": "Bharat Ek Khoj (भारत एक खोज)",
        "author": "Jawaharlal Nehru (Hindi Tr.)",
        "genre": "History",
        "description": "The Hindi translation of The Discovery of India, written during imprisonment at Ahmednagar fort, chronicling India's civilizational ethos.",
        "language": "Hindi",
        "pages": 612,
        "reading_difficulty": "Advanced",
        "suitable_mood": "Curious",
        "reading_purpose": "Knowledge",
        "cover_image": "https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=600&auto=format&fit=crop&q=80",
        "rating": 4.8
    },

    # ==========================
    # MARATHI BOOKS (41 - 54)
    # ==========================
    {
        "title": "Mrityunjay (मृत्युंजय)",
        "author": "Shivaji Sawant",
        "genre": "Fiction",
        "description": "A monumental classic of Marathi literature portraying the life, unmeasured sacrifice, valor, and soul of Karna from the Mahabharata.",
        "language": "Marathi",
        "pages": 628,
        "reading_difficulty": "Advanced",
        "suitable_mood": "Emotional",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80",
        "rating": 5.0
    },
    {
        "title": "Shyamchi Aai (श्यामची आई)",
        "author": "Sane Guruji",
        "genre": "Biography",
        "description": "An autobiographical masterpiece narrating the pure values of love, sacrifice, discipline, and compassion taught by Shyam's mother.",
        "language": "Marathi",
        "pages": 198,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Emotional",
        "reading_purpose": "Personal Development",
        "cover_image": "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    },
    {
        "title": "Yayati (ययाति)",
        "author": "V.S. Khandekar",
        "genre": "Fiction",
        "description": "Jnanpith Award-winning novel exploring insatiable human desires, moral conflict, and sensual temptations through the myth of King Yayati.",
        "language": "Marathi",
        "pages": 432,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Curious",
        "reading_purpose": "Personal Development",
        "cover_image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    },
    {
        "title": "Batatyachi Chaal (बटाट्याची चाळ)",
        "author": "P.L. Deshpande",
        "genre": "Fiction",
        "description": "A timeless humorous and warm depiction of everyday lives, aspirations, and eccentricities of residents living in a Mumbai chawl.",
        "language": "Marathi",
        "pages": 184,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Happy",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    },
    {
        "title": "Kosala (कोसला)",
        "author": "Bhalchandra Nemade",
        "genre": "Fiction",
        "description": "A landmark existentialist Marathi novel following Pandurang Sangvikar, exploring youth, identity, disillusionment, and education.",
        "language": "Marathi",
        "pages": 272,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Curious",
        "reading_purpose": "Learning",
        "cover_image": "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600&auto=format&fit=crop&q=80",
        "rating": 4.7
    },
    {
        "title": "Panipat (पानिपत)",
        "author": "Vishwas Patil",
        "genre": "History",
        "description": "A thrilling and poignant historical narrative recounting the Third Battle of Panipat fought in 1761 and the immortal bravery of the Marathas.",
        "language": "Marathi",
        "pages": 520,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Adventurous",
        "reading_purpose": "Knowledge",
        "cover_image": "https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    },
    {
        "title": "Shriman Yogi (श्रीमान योगी)",
        "author": "Ranjit Desai",
        "genre": "Biography",
        "description": "The magnum opus biography of Chhatrapati Shivaji Maharaj, presenting his unparalleled genius, statesmanship, and high ethical ideals.",
        "language": "Marathi",
        "pages": 960,
        "reading_difficulty": "Advanced",
        "suitable_mood": "Motivated",
        "reading_purpose": "Knowledge",
        "cover_image": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80",
        "rating": 5.0
    },
    {
        "title": "Swami (स्वामी)",
        "author": "Ranjit Desai",
        "genre": "History",
        "description": "A celebrated historical novel capturing the intense life, love, triumphs, and tragic demise of Peshwa Madhavrao and his devoted wife Ramabai.",
        "language": "Marathi",
        "pages": 416,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Emotional",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80",
        "rating": 4.8
    },
    {
        "title": "Partner (पार्टनर)",
        "author": "Vasant Purushottam Kale (Vapu)",
        "genre": "Fiction",
        "description": "A philosophical yet deeply engaging Marathi novel about friendship, unconditional trust, human quirks, and understanding life's rhythm.",
        "language": "Marathi",
        "pages": 224,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Relaxed",
        "reading_purpose": "Personal Development",
        "cover_image": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80",
        "rating": 4.8
    },
    {
        "title": "Baluta (बलुतं)",
        "author": "Daya Pawar",
        "genre": "Biography",
        "description": "One of the most powerful and groundbreaking autobiographies in modern Indian literature, confronting social inequality with raw honesty.",
        "language": "Marathi",
        "pages": 288,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Emotional",
        "reading_purpose": "Knowledge",
        "cover_image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
        "rating": 4.8
    },
    {
        "title": "Natsamrat (नटसम्राट)",
        "author": "V.V. Shirwadkar (Kusumagraj)",
        "genre": "Fiction",
        "description": "The tragic and stirring play depicting an aging theater actor, Appasaheb Belwalkar, coping with retirement, abandonment, and loss of dignity.",
        "language": "Marathi",
        "pages": 144,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Emotional",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    },
    {
        "title": "Vyakti Aani Valli (व्यक्ती आणि वल्ली)",
        "author": "P.L. Deshpande",
        "genre": "Fiction",
        "description": "Sahitya Akademi Award-winning character sketches by Pu La Deshpande, lovingly portraying memorable, endearing, and colorful personalities.",
        "language": "Marathi",
        "pages": 240,
        "reading_difficulty": "Beginner",
        "suitable_mood": "Happy",
        "reading_purpose": "Entertainment",
        "cover_image": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    },
    {
        "title": "Radheya (राधेय)",
        "author": "Ranjit Desai",
        "genre": "Fiction",
        "description": "A compelling portrayal of Karna's life focusing on his steadfast friendship with Duryodhana, honour, and emotional battles.",
        "language": "Marathi",
        "pages": 310,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Motivated",
        "reading_purpose": "Motivation",
        "cover_image": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
        "rating": 4.7
    },
    {
        "title": "Chhava (छावा)",
        "author": "Shivaji Sawant",
        "genre": "Biography",
        "description": "The epic biographical saga of Chhatrapati Sambhaji Maharaj, his immense courage, scholarship, and indomitable spirit in the face of torture.",
        "language": "Marathi",
        "pages": 720,
        "reading_difficulty": "Advanced",
        "suitable_mood": "Motivated",
        "reading_purpose": "Knowledge",
        "cover_image": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80",
        "rating": 4.9
    }
]

def seed_database():
    """Initialize DB schema and populate books table."""
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear existing books to make seeding idempotent
    cursor.execute("DELETE FROM books")
    cursor.execute("DELETE FROM sqlite_sequence WHERE name = 'books'")

    inserted_count = 0
    for book in BOOKS_DATA:
        cursor.execute("""
            INSERT INTO books (
                title, author, genre, description, language,
                pages, reading_difficulty, suitable_mood, reading_purpose,
                cover_image, rating
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            book["title"],
            book["author"],
            book["genre"],
            book["description"],
            book["language"],
            book["pages"],
            book["reading_difficulty"],
            book["suitable_mood"],
            book["reading_purpose"],
            book["cover_image"],
            book["rating"]
        ))
        inserted_count += 1

    conn.commit()

    # Verify counts
    cursor.execute("SELECT language, COUNT(*) FROM books GROUP BY language")
    lang_counts = cursor.fetchall()

    conn.close()

    print(f"[SUCCESS] Successfully seeded {inserted_count} authentic books into SQLite database.")
    print("Breakdown by Language:")
    for row in lang_counts:
        print(f"   * {row[0]}: {row[1]} books")

if __name__ == "__main__":
    seed_database()
