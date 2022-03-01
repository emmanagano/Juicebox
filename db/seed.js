
const {

    client,
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    createPost,
    updatePost,
    getAllPosts,
    getPostById,
    getPostsByUser,
    getPostsByTagName,
    getUserByUsername

} = require('./index');



async function dropTables() {

    try {

        await client.query(`

            DROP TABLE IF EXISTS post_tags;
            DROP TABLE IF EXISTS tags;
            DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS users;

        `);

        console.log("Finished dropping tables!");

    } catch( error ) {

        console.error("Error dropping tables!");

        throw error;

    } 
}

async function createTables() {

    try {

        console.log("Starting to build tables...");

        await client.query(`

            CREATE TABLE users (

                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) NOT NULL,
                name varchar(255) NOT NULL,
                location varchar(255) NOT NULL,
                active BOOLEAN DEFAULT true

            );

            CREATE TABLE posts (

                id SERIAL PRIMARY KEY,
                "authorId" INTEGER REFERENCES users(id) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                active BOOLEAN DEFAULT true

            );

            CREATE TABLE tags (

                id SERIAL PRIMARY KEY, 
                name VARCHAR(255) UNIQUE NOT NULL

            );

            CREATE TABLE post_tags (

                "postId" INTEGER REFERENCES posts(id),
                "tagId" INTEGER REFERENCES tags(id),
                UNIQUE("postId", "tagId")

            );
        `);

        console.log("Finished building tables!");

    } catch( error ) {

        console.error("Error building tables!");

        throw error;
    }
}

async function createInitialUsers() {

    try {

        console.log("Starting to create users...");

        const albert = await createUser({username:'albert', password:'bertie99', name:'alberto', location:'Mars'});
        const sandra = await createUser({username: 'sandra', password:'2sandy4me', name:'casandra', location:'Jupiter'});
        const glamgal = await createUser({username:'glamgal', password:'soglam', name:'glamy', location:'Pluto'});

        console.log(albert,sandra,glamgal);

        console.log("Finished creating users!");

    } catch( error ) {

        console.error(error);

        throw error;

    }
}

async function createInitialPosts() {

    try {

        console.log('Starting createInitialPosts');

        const [albert, sandra, glamgal] = await getAllUsers();

        await createPost({

            authorId: albert.id,
            title: 'First Post',
            content:'This is my first post. I hope I love writing blogs as much as I love writing them.',
            tags: ["#happy", "#youcandoanything"]

        });

        await createPost({

            authorId: sandra.id,
            title:'First Post',
            content:'This is sandra!!',
            tags: ["#happy", "#worst-day-ever"]

        })

        await createPost({

            authorId: glamgal.id, 
            title:'First Post',
            content:'This is glamgal!!',
            tags: ["#happy", "#youcandoanything", "#canmandoeverything"]

        })

        console.log('Finished createInitialPosts');

    } catch( error ){

        throw error;

    }
}

async function testDB() {
    try {

        console.log("Starting to test database...");

        console.log("Calling getAllUsers");

            const users = await getAllUsers();

        console.log("getAllUsers:", users);
        

        console.log("Calling updateUser on users[0]");
            const updateUserResult = await updateUser(users[0].id, {

                name: 'Bruno Mars',
                location: 'Mars'

            });
        console.log("Result:", updateUserResult);

        console.log("Calling getAllPosts");

            const posts = await getAllPosts();

        console.log("Result:", posts);

        console.log("Calling updatePost on posts[1], only updating tags");

            const updatePostTagsResult = await updatePost(posts[1].id, {

                tags: ["#youcandoanything", "#redfish", "#bluefish"]

            });

        console.log("Result:", updatePostTagsResult);

        console.log("Calling getUserById with 1");

            const albert = await getUserById(1);

        console.log("Result:", albert);

            const albertPost = await getPostById(1);
        console.log('getPostByIdResult',albertPost);

        console.log("Calling getPostsByTagName with #happy");

            const postsWithHappy = await getPostsByTagName("#happy");

        console.log("Result:", postsWithHappy);

            const getUserPost = await getPostsByUser(1);

        console.log("getPostsByUser:",getUserPost);

            const userByUsername = await getUserByUsername("albert");
        console.log("getUserByUsername",userByUsername);

        console.log("getUserByUsername",)

        
        console.log("Finished database tests!");


    } catch( error ) {

        console.error("Error testing database!");

        throw error;
    }
}

async function rebuildDB() {

    try {

        client.connect();
        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();

    } catch( error ) {

        console.log("Error during rebuildDB");
        
        throw error;

    } 
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());

