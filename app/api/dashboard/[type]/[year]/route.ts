export async function GET(request: Request, { params }: { params: Promise<{ type: string; year: string }> }) {
    const { type, year } = await params

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE3Njk2MjUwMDMsImV4cCI6MTc3MjIxNzAwM30.PdzbFXbMGHgiWAlNWqu9JXhOQb2MMWHZQqHu4i6-2Hw'

    const url = `${process.env.API_URL}/categories/dashboard/?type=${type}&year=${year}`
    const req = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    const json = await req.json()

    if (!req.ok) {
        return Response.json(json.error, { status: 403 })
    }

    return Response.json(json)
}