/**
 * Enhanced fetch wrapper with automatic error logging for both network
 * and backend-returned errors.
 */
export const apiFetch = async (url: string, options: RequestInit = {}) => {
    try {
        console.log(`[API_REQUEST] ${options.method || 'GET'} ${url}`);

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            // This is a backend error (4xx or 5xx)
            console.error('--- BACKEND API ERROR ---');
            console.error('URL:', url);
            console.error('Status:', response.status);
            console.error('Error Data:', JSON.stringify(data, null, 2));
            console.error('--------------------------');

            const error = new Error(data.message || data.error || 'API Request failed');
            (error as any).status = response.status;
            (error as any).data = data;
            throw error;
        }

        return data;
    } catch (error: any) {
        if (error.name === 'TypeError' && error.message === 'Network request failed') {
            console.error('--- NETWORK ERROR ---');
            console.error('URL:', url);
            console.error('Message: Could not connect to the server. Check if backend is running and URL is correct.');
            console.error('----------------------');
        } else if (!error.status) {
            // Other JS/Runtime errors during fetch
            console.error('--- API CLIENT ERROR ---');
            console.error('URL:', url);
            console.error('Error:', error);
            console.error('------------------------');
        }
        throw error;
    }
};
