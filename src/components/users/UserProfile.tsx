import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    name: string;
    email: string;
    age: number;
}

export const UserProfile = ({ email }) => {
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        axios.get(`http://localhost:7777/api/users/${email}`)
        .then(response => setUser(response.data as any))
        .catch(error => console.error('Error fetching user:', error));
    }, [email]);
    
    return (
        <div>
            {user ? (
                <>
                    <h1>{user.name}</h1>
                    <p>{user.email}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}