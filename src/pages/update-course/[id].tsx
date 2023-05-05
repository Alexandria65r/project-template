import React, { useState, useEffect, useCallback } from 'react'
import Layout from '../../components/layout'
import { Box, Typography, styled } from '@mui/material'
import { colorScheme } from '../../theme'
import { CSS_PROPERTIES } from '../../reusable'

import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { useRouter } from 'next/router'
import randomstring from 'randomstring'
import UploadCourseForm from '../../components/upload-course-form/upload-course-form'
import BrowseFileButton from '../../components/browse-file-button'
import UploadAPI from '../../api-services/upload'
import { courseActions } from '../../../reducers/course-reducer'
import CourseAPI from '../../api-services/course'
import { VideoCourseSchema } from '../../reusable/schemas'
import { Asset } from '../../reusable/interfaces'

const Container = styled(Box)(({ theme }) => ({
    width: '75%',
    padding: 20,
    margin: '0 auto',
    [theme.breakpoints.down("sm")]: {
        alignItems: 'center',
        width: '95%',
        padding: 0,
    }
}))
const FlexContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: 15,
    [theme.breakpoints.down("sm")]: {
        gap: 0,
        //margin: '10px auto',
        alignItems: 'center',
        width: '100%',
        padding: 0,
    }
}))

const TestHeader = styled(Box)(({ theme }) => ({
    flex: 1,
    minHeight: 60,
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    marginBottom: 10,
    backgroundColor: colorScheme(theme).secondaryColor,
    borderRadius: CSS_PROPERTIES.radius5,
    borderEndEndRadius: 0,
    borderBottomLeftRadius: 0,
    boxShadow: `0 1px 3px 0 ${colorScheme(theme).chatBoarderColor}`
}))
const TestInfoCol = styled(Box)(({ theme }) => ({
    flexBasis: '35%',
    height: 200,
    borderRadius: CSS_PROPERTIES.radius5,
    backgroundColor: colorScheme(theme).secondaryColor,
    boxShadow: `0 1px 3px 0 ${colorScheme(theme).chatBoarderColor}`,
    [theme.breakpoints.down("sm")]: {
        flexBasis: '100%',
        marginBottom: 10
    }
}))
const TestFormContainer = styled(Box)(({ theme }) => ({
    justifySelf: 'flex-end',
    flex: 1,
    padding: 10,
    minHeight: 200,
    backgroundColor: colorScheme(theme).secondaryColor,
    borderRadius: CSS_PROPERTIES.radius5,
    boxShadow: `0 1px 3px 0 ${colorScheme(theme).chatBoarderColor}`,
    [theme.breakpoints.down("sm")]: {
        flexBasis: '100%',
        marginLeft: 0,
        padding: 0,
    }
}))

const ThumbnailContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CSS_PROPERTIES.radius5,
    backgroundColor: colorScheme(theme).secondaryColor,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover'
}))





type Props = {}

export default function NewTest({ }: Props) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const testData = useAppSelector((state) => state.TestReducer.newTest)
    const isErr = useAppSelector((state) => state.TestReducer.isErr)
    const user = useAppSelector((state) => state.AuthReducer.user)
    const course = useAppSelector((state) => state.CourseReducer.video)
    const [thumbLocal, setThumbLocal] = useState<string | ArrayBuffer | null>('')
    const [imageIsLoading, setImageIsLoading] = useState<boolean>(false)


    const [imageAssests, setImageAssets] = useState<Asset>({
        publicId: '',
        secureURL: ''
    })

    const mainCourseId: any = router.query.id || []



    const fetchCourseData = useCallback(async () => {
        if (typeof mainCourseId === 'string') {
            const mainCourse = await CourseAPI.fetchCourse(mainCourseId, 'introduction')
            if (mainCourse) {
                console.log(mainCourse)
                setImageAssets(mainCourse.imageAsset)
                dispatch(courseActions.setImageAssets(mainCourse.imageAsset))
            }
        }
    }, [mainCourseId])

    useEffect(() => {
        fetchCourseData()
    }, [mainCourseId])


    async function getThumbnailBlob(base64: string | ArrayBuffer | null) {
        setImageIsLoading(true)
        setThumbLocal(base64)
        const response = await UploadAPI.uploadFile({ base64, resource_type: 'image', preset: 'image_preset' })
        console.log(response)
        if (response.secure_url) {
            setImageIsLoading(false)
            dispatch(courseActions.setImageAssets({
                publicId: response.public_id,
                secureURL: response.secure_url
            }))
        }
    }

    async function removeFile() {
        if (imageAssests.publicId !== course.imageAsset.publicId) {
            setImageIsLoading(true)
            const { data } = await UploadAPI.DeleteAsset('image', course.imageAsset.publicId)
            console.log(data)
            if (data.success) {
                setImageIsLoading(false)
                setThumbLocal('')
                dispatch(courseActions.setImageAssets({
                    publicId: '',
                    secureURL: ''
                }))
            }

        } else {
            dispatch(courseActions.setImageAssets({
                publicId: '',
                secureURL: ''
            }))
        }
    }


    async function create() {
        const courseId = randomstring.generate(19)
        const newCourse = await CourseAPI.create({
            ...course,
            _id: courseId,
            type: 'course',
            authorId: user._id ?? '',
            courseId: mainCourseId ?? '',
        })

        if (newCourse) {
            console.log(newCourse)
            setThumbLocal('')
            dispatch(courseActions.setVideo(VideoCourseSchema))
        }
    }

    return (
        <Layout>
            <Container>
                <TestHeader>
                    <Typography
                        sx={(theme) => ({
                            fontSize: 18,
                            fontWeight: 600,
                            [theme.breakpoints.down("sm")]: {
                                fontSize: 15
                            }
                        })}>
                        Course Video
                    </Typography>
                </TestHeader>
                <FlexContainer>
                    <TestInfoCol>
                        <ThumbnailContainer
                            sx={{ backgroundImage: `url(${thumbLocal || course?.imageAsset?.secureURL})` }} >
                            <BrowseFileButton mode="update" removeFile={removeFile}
                                disabled={course.imageAsset.secureURL !== ''}
                                loading={imageIsLoading}
                                getBlob={getThumbnailBlob}>
                                Browse Thumbnail
                            </BrowseFileButton>
                        </ThumbnailContainer>
                    </TestInfoCol>
                    <TestFormContainer>

                        <UploadCourseForm mode="update" submitHandler={create} />
                    </TestFormContainer>
                </FlexContainer>
            </Container>
        </Layout>
    )
}