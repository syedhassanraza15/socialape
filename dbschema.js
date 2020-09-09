let db = {

    users: [
        {
            userId: 'dsajkhfkjdsahfkjsadkhfdsk',
            email: 'user@email.com',
            handle: 'user',
            createdAt: '2020-09-08T10:59:52.798Z',
            imageUrl: 'image/fddsfdsfsdfsdfs/fdsfdsfds',
            bio: 'Hello, my name is user, nice to meet you',
            website: 'https://user.com',
            location: 'RWP, PAK'
        }
    ],
    screams: [
        {
            userHandle: 'sample user',
            body: 'This is the sample scream body',
            createdAt: '2020-09-01T15:10:47.984Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle: 'user',
            screamId: 'sdafdsafdsafdsafdsafdsa',
            body: 'nice one dude',
            createdAt: '2020-03-15T10:59:52.798Z'
        }
    ]
};

const userDetails = {
    //Redux data
    credentials: {
        userId: 'fdsafdsafsadfsdafdsafsadfdsa',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2020-03-15T10:59:52.798Z',
        imageUrl: 'image/fdsafdsafdsafdsa/fdsafdsafdsa',
        bio: 'Hello, my name is user, nice to meet you',
        website: 'https://user.com',
        location: 'RWP, PAK'
    },
    likes: [
        {
            userHandle: 'user',
            screamId: 'dsafgsdafsafsafdsafsad'
        },
        {
            userHandle: 'user',
            screamId: 'dsafdsafdsafdsafdsadsaf'
        }
    ]
};