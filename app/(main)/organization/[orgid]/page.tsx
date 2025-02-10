'use client'

import { useParams } from 'next/navigation'

export default function Organization() {
    const params = useParams()
    const orgid = params.orgid as string
    
    return <div>{orgid}</div>
}