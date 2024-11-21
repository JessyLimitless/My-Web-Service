import { useState, useEffect } from 'react';

export default function Home() {
    const [availableUmbrellas, setAvailableUmbrellas] = useState(20);
    const [rentals, setRentals] = useState([]);
    const [notification, setNotification] = useState('');

    const fetchUmbrellaData = async () => {
        const response = await fetch('/api/umbrellas');
        const data = await response.json();
        setAvailableUmbrellas(data.availableUmbrellas);
        setRentals(data.rentals);
    };

    useEffect(() => {
        fetchUmbrellaData();
    }, []);

    const handleRent = async (e) => {
        e.preventDefault();
        const studentId = e.target.studentId.value;
        const name = e.target.name.value;
        const email = e.target.email.value;

        const response = await fetch('/api/umbrellas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'rent', studentId, name, email }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            setNotification(`Return by: ${data.returnBy}`);
            fetchUmbrellaData();
        } else {
            alert(data.message);
        }
    };

    const handleReturn = async (studentId) => {
        const response = await fetch('/api/umbrellas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'return', studentId }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            fetchUmbrellaData();
        } else {
            alert(data.message);
        }
    };

    return (
        <div>
            {/* Embedding styles within the component */}
            <style jsx>{`
                body {
                    font-family: Arial, sans-serif;
                    background-color: #e0f7fa;
                    color: #3d3b3b;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }

                .container {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    max-width: 400px;
                    width: 100%;
                }

                h1 {
                    display: flex;
                    justify-content: space-between;
                    font-size: 21px;
                    color: #0277bd;
                    margin-bottom: 20px;
                    font-family: 'Pacifico', cursive;
                }

                form {
                    margin-bottom: 20px;
                }

                input[type='text'],
                input[type='email'],
                button {
                    padding: 10px;
                    font-size: 16px;
                    border-radius: 4px;
                    width: 100%;
                    margin-bottom: 10px;
                    border: 1px solid #999;
                }

                button {
                    border: none;
                    cursor: pointer;
                    background: linear-gradient(
                        90deg,
                        rgba(33, 150, 243, 1) 0%,
                        rgba(3, 169, 244, 1) 50%,
                        rgba(0, 188, 212, 1) 100%
                    );
                    color: white;
                    transition: background 0.3s;
                }

                button:hover {
                    background: linear-gradient(
                        90deg,
                        rgba(3, 169, 244, 1) 0%,
                        rgba(0, 188, 212, 1) 50%,
                        rgba(33, 150, 243, 1) 100%
                    );
                }
            `}</style>

            <div className="container">
                <h1>Sharella</h1>
                <p>Available Umbrellas: {availableUmbrellas}</p>
                <form onSubmit={handleRent}>
                    <input type="text" name="studentId" placeholder="Student ID" required />
                    <input type="text" name="name" placeholder="Name" required />
                    <input type="email" name="email" placeholder="Email" required />
                    <button type="submit">Rent Umbrella</button>
                </form>

                <h2>Rental Records</h2>
                <ul>
                    {rentals.map((rental, index) => (
                        <li key={index}>
                            {rental.studentId} - {rental.name} - {rental.email} -{' '}
                            {rental.isReturned ? 'Returned' : 'Rented'}
                            {!rental.isReturned && (
                                <button onClick={() => handleReturn(rental.studentId)}>Return</button>
                            )}
                        </li>
                    ))}
                </ul>
                {notification && <p>{notification}</p>}
            </div>
        </div>
    );
}
