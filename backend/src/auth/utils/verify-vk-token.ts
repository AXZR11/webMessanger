import axios from "axios";

export async function verifyVkToken(accessToken: string): Promise<{ id: string; name?: string }> {
    const response = await axios.get('https://api.vk.com/method/users.get', {
        params: {
            access_token: accessToken,
            v: '5.131'
        }
    })

    const data = response.data.response?.[0]

    if(!data) {
        throw new Error('Invalid VK token')
    }

    return {
        id: data.id.toString(),
        name: `${data.first_name} ${data.last_name}`
    }
}