class HttpHelper {
    async post(url: string, headers: Record<string, string> = {}, body: Record<string, any> = {}): Promise<any> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error in POST request:', error);
            throw error;
        }
    }

    async postForm(url: string, headers: Record<string, string> = {}, body: FormData): Promise<any> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: body,
                headers: {
                    ...headers
                },
                redirect: 'follow'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error in POST form request:', error);
            throw error;
        }
    }

    async get(url: string, headers: Record<string, string> = {}): Promise<any> {
        try {
            const response = await fetch(url, {
                headers: {
                    ...headers
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error in GET request:', error);
            throw error;
        }
    }
}

export default HttpHelper;