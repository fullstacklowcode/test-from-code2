const functionName = '/api/v1/function1';

// Handler function
const handler = async (req, res, db) => {
    try {
        // Fetch documents from the collection
        const users = await db.collection('users').find().toArray();

        // Send the fetched data as the response
        res.send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    route: functionName,
    handler: handler
};
