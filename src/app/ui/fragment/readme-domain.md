https://chatgpt.com/share/68d24ca6-ca8c-800c-861f-27d7842ab4a5

Install the whois Node.js package
You will need the whois library for checking domain availability. Install it via npm:
npm install whois
b. Create an API route to check domain availability
Inside the /pages/api directory, create a new file, for example, check-domain.js.
Implement the API route that performs the whois lookup.
// /pages/api/check-domain.js
import whois from 'whois';

export default function handler(req, res) {
    const { domain } = req.query; // Get the domain from the query parameter

    if (!domain) {
        return res.status(400).json({ error: 'Domain parameter is required' });
    }

    // Perform WHOIS lookup to check if the domain is available
    whois.lookup(domain, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching WHOIS data' });
        }

        // If the data contains information, the domain is registered
        if (data && data.includes("No match") || data.includes("NOT FOUND")) {
            return res.status(200).json({ available: true });
        } else {
            return res.status(200).json({ available: false });
        }
    });
}
This function takes the domain name as a query parameter and uses the whois.lookup() method to check the domain's availability.
The response will indicate whether the domain is available or not based on the whois data.
c. Create a Frontend to Check Domain Availability
In your pages/index.js or any other page, create a form that allows users to check domain availability.
// /pages/index.js
import { useState } from 'react';

export default function Home() {
    const [domain, setDomain] = useState('');
    const [status, setStatus] = useState('');

    const checkDomain = async () => {
        if (!domain) return;
        
        const res = await fetch(`/api/check-domain?domain=${domain}`);
        const data = await res.json();

        if (data.available === undefined) {
            setStatus('Error checking domain');
        } else {
            setStatus(data.available ? 'Domain is available!' : 'Domain is taken.');
        }
    };

    return (
        <div>
            <h1>Check Domain Availability</h1>
            <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain name"
            />
            <button onClick={checkDomain}>Check</button>
            {status && <p>{status}</p>}
        </div>
    );
}
The user inputs the domain name in the text field, and clicking the "Check" button will call the /api/check-domain endpoint.
The backend response is displayed to show whether the domain is available or taken.
2. Domain Name Generation in Next.js
You can generate domain name suggestions by combining relevant words and suffixes. This could be done with a simple array of keywords and suffixes.
Example for Domain Name Generation:
a. Modify the Frontend to Generate Domain Names
Add functionality to generate domain names based on user input.
// /pages/index.js
import { useState } from 'react';

export default function Home() {
    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const generateDomains = () => {
        const suffixes = ['.com', '.net', '.io', '.co'];
        const keywords = [keyword, `${keyword}tech`, `${keyword}hub`];
        const newSuggestions = [];

        keywords.forEach((word) => {
            suffixes.forEach((suffix) => {
                newSuggestions.push(word + suffix);
            });
        });

        setSuggestions(newSuggestions);
    };

    return (
        <div>
            <h1>Generate Domain Name Suggestions</h1>
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter a keyword"
            />
            <button onClick={generateDomains}>Generate</button>

            {suggestions.length > 0 && (
                <ul>
                    {suggestions.map((domain, index) => (
                        <li key={index}>{domain}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
This frontend allows the user to enter a keyword, and it will generate domain names with different suffixes like .com, .net, etc.