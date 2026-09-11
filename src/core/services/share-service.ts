const API_URL = import.meta.env.VITE_SHARE_API_URL as string
const API_TOKEN = import.meta.env.VITE_SHARE_API_TOKEN as string

interface ShareResponse {
    id: string
    content: string
}

const headers = {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
}

class ShareService {
    async save(content: string, existingId?: string | null): Promise<string> {
        const url = existingId ? `${API_URL}/${existingId}` : API_URL
        const method = existingId ? 'PUT' : 'POST'

        const response = await fetch(url, {
            method,
            headers,
            body: content
        })

        if (!response.ok) {
            throw new Error(`Error al compartir: ${response.status}`)
        }

        const data = await response.json() as ShareResponse
        return data.id
    }

    async get(id: string): Promise<string> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'GET',
            headers
        })

        if (!response.ok) {
            throw new Error(`Error al obtener lista compartida: ${response.status}`)
        }

        const data = await response.json() as ShareResponse
        return data.content
    }

    buildShareUrl(id: string): string {
        return `${window.location.origin}${window.location.pathname}#list-id=${id}`
    }
}

export default new ShareService()
