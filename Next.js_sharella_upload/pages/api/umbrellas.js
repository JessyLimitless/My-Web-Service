import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB); // Connect to the database
    const { method, body, query } = req;

    try {
        switch (method) {
            case 'GET':
                if (query.studentId) {
                    // Retrieve rental record by studentId
                    const rental = await db.collection('rentals').findOne({ studentId: query.studentId });
                    if (rental) {
                        return res.status(200).json(rental);
                    }
                    return res.status(404).json({ message: 'Rental record not found' });
                } else {
                    // Retrieve all rental records
                    const rentals = await db.collection('rentals').find({}).toArray();
                    const availableUmbrellas = 20 - rentals.filter((r) => !r.isReturned).length;
                    return res.status(200).json({ availableUmbrellas, rentals });
                }

            case 'POST':
                const { studentId, name, email, action } = body;

                if (action === 'rent') {
                    // Rent an umbrella
                    const returnBy = new Date();
                    returnBy.setDate(returnBy.getDate() + 7);

                    await db.collection('rentals').insertOne({
                        studentId,
                        name,
                        email,
                        rentedAt: new Date(),
                        returnBy,
                        isReturned: false,
                    });

                    return res.status(201).json({ message: 'Umbrella rented successfully', returnBy });
                } else if (action === 'return') {
                    // Return an umbrella
                    const result = await db.collection('rentals').updateOne(
                        { studentId, isReturned: false },
                        { $set: { isReturned: true } }
                    );

                    if (result.matchedCount === 0) {
                        return res.status(404).json({ message: 'No active rental found for this student' });
                    }

                    return res.status(200).json({ message: 'Umbrella returned successfully' });
                }
                break;

            case 'DELETE':
                // Delete all rental records
                await db.collection('rentals').deleteMany({});
                return res.status(200).json({ message: 'All rental records cleared' });

            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
