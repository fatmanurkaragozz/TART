import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const secret = 'tart_super_secret';
const userId = 'bb5f74e3-c79a-4dba-a845-5212005124a6';

const token = jwt.sign({ id: userId }, secret, { expiresIn: '1h' });

async function test() {
    console.log('Sending request with token:', token);
    const response = await fetch('http://localhost:5000/api/v1/discussions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title: "Test Discussion from script",
            content: "This is a test content.",
            tags: ["test"]
        })
    });

    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
}

test().catch(console.error);
