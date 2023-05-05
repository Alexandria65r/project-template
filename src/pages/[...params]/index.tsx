import { useRouter } from 'next/router'
import React from 'react'
import Tests from '../../components/tests'
import RenderCourses from '../../components/render-courses'
import RenderOwnCourses from '../../components/render-own-courses'

type Props = {}

function index({ }: Props) {
    const router = useRouter()
    const params: any = router.query.params || []
    return (
        <div>
            {params[1] === 'tests' && <Tests />}
            {params[1] === 'courses' && <RenderOwnCourses />}
        </div>
    )
}

export default index