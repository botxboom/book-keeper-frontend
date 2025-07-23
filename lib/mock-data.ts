// Mock data for development when GraphQL server isn't available
export const mockBooks = [
  {
    id: '1',
    title: 'The Great Gatsby',
    isbn: '978-0-7432-7356-5',
    publishedYear: 1925,
    genre: 'Classic Literature',
    description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of narrator Nick Carraway and his enigmatic neighbor Jay Gatsby.',
    coverImage: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.2,
    reviewCount: 1247,
    author: {
      id: '1',
      name: 'F. Scott Fitzgerald',
      biography: 'Francis Scott Key Fitzgerald was an American novelist and short story writer, widely regarded as one of the greatest American writers of the 20th century. He is best known for his novel The Great Gatsby.'
    },
    reviews: [
      {
        id: '1',
        rating: 5,
        comment: 'A masterpiece of American literature. Fitzgerald\'s prose is beautiful and the story is timeless.',
        reviewerName: 'Literary Critic',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        rating: 4,
        comment: 'Great character development and symbolism. A must-read for understanding the American Dream.',
        reviewerName: 'Book Lover',
        createdAt: '2024-01-10T14:20:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    isbn: '978-0-06-112008-4',
    publishedYear: 1960,
    genre: 'Fiction',
    description: 'A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of Scout Finch as her father, lawyer Atticus Finch, defends a black man falsely accused of rape.',
    coverImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviewCount: 2156,
    author: {
      id: '2',
      name: 'Harper Lee',
      biography: 'Nelle Harper Lee was an American novelist best known for her 1960 novel To Kill a Mockingbird. She won the 1961 Pulitzer Prize for Fiction and was awarded the Presidential Medal of Freedom in 2007.'
    },
    reviews: [
      {
        id: '3',
        rating: 5,
        comment: 'One of the most important books I\'ve ever read. A powerful story about justice and morality.',
        reviewerName: 'Reader123',
        createdAt: '2024-01-12T16:45:00Z'
      }
    ]
  },
  {
    id: '3',
    title: '1984',
    isbn: '978-0-452-28423-4',
    publishedYear: 1949,
    genre: 'Dystopian Fiction',
    description: 'A dystopian social science fiction novel that tells the story of Winston Smith, a member of the Outer Party who works for the Ministry of Truth. The novel explores themes of totalitarianism, mass surveillance, and repressive regimentation.',
    coverImage: 'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.3,
    reviewCount: 3421,
    author: {
      id: '3',
      name: 'George Orwell',
      biography: 'Eric Arthur Blair, known by his pen name George Orwell, was an English novelist, essayist, journalist and critic. His work is characterised by lucid prose, biting social criticism, opposition to totalitarianism, and outspoken support of democratic socialism.'
    },
    reviews: []
  }
];

export const mockAuthors = [
  {
    id: '1',
    name: 'F. Scott Fitzgerald',
    biography: 'Francis Scott Key Fitzgerald was an American novelist and short story writer, widely regarded as one of the greatest American writers of the 20th century. He is best known for his novel The Great Gatsby (1925). Fitzgerald was part of the Lost Generation of the 1920s and is considered a member of the "Lost Generation" and was part of the expatriate community in 1920s Paris.',
    birthYear: 1896,
    nationality: 'American',
    avatar: 'https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg?auto=compress&cs=tinysrgb&w=400',
    bookCount: 4,
    books: [
      {
        id: '1',
        title: 'The Great Gatsby',
        isbn: '978-0-7432-7356-5',
        publishedYear: 1925,
        genre: 'Classic Literature',
        coverImage: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.2,
        reviewCount: 1247,
        author: { id: '1', name: 'F. Scott Fitzgerald' }
      }
    ]
  },
  {
    id: '2',
    name: 'Harper Lee',
    biography: 'Nelle Harper Lee was an American novelist best known for her 1960 novel To Kill a Mockingbird. She won the 1961 Pulitzer Prize for Fiction and was awarded the Presidential Medal of Freedom in 2007 for her contribution to literature. She also wrote Go Set a Watchman in 2015, which was actually written before To Kill a Mockingbird but published much later.',
    birthYear: 1926,
    nationality: 'American',
    avatar: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    bookCount: 2,
    books: [
      {
        id: '2',
        title: 'To Kill a Mockingbird',
        isbn: '978-0-06-112008-4',
        publishedYear: 1960,
        genre: 'Fiction',
        coverImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.5,
        reviewCount: 2156,
        author: { id: '2', name: 'Harper Lee' }
      }
    ]
  },
  {
    id: '3',
    name: 'George Orwell',
    biography: 'Eric Arthur Blair, known by his pen name George Orwell, was an English novelist, essayist, journalist and critic. His work is characterised by lucid prose, biting social criticism, opposition to totalitarianism, and outspoken support of democratic socialism. He is best known for his dystopian novels Nineteen Eighty-Four (1949) and Animal Farm (1945).',
    birthYear: 1903,
    nationality: 'British',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    bookCount: 2,
    books: [
      {
        id: '3',
        title: '1984',
        isbn: '978-0-452-28423-4',
        publishedYear: 1949,
        genre: 'Dystopian Fiction',
        coverImage: 'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.3,
        reviewCount: 3421,
        author: { id: '3', name: 'George Orwell' }
      }
    ]
  }
];