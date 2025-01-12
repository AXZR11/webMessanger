import axios from 'axios';

export async function verifyYandexToken(token: string) {
    try {
        const response = await axios.get('https://login.yandex.ru/info', {
            headers: {
                Authorization: `OAuth ${token}`,
            },
        });

        console.log('Yandex token verified:', response.data);

        return response.data;
    } catch (error) {
        console.error('Error verifying Yandex token:', error.response?.data || error.message);
        throw new Error('Failed to verify Yandex token');
    }
}
