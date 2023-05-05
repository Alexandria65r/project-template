import { Box, MenuItem, Select, TextField, colors, styled } from '@mui/material'
import React, { } from 'react'
import SelectWithCheckMarks from '../form-inputs/select-with-checkmarks'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { testActions } from '../../../reducers/test-reducer'
import { Textarea } from '../../reusable/styles'
import { forumActions } from '../../../reducers/forum-reducer'


const ChoicesContainer = styled(Box)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        marginLeft: 0
    }
}))

const TextInput = styled(TextField)(({ theme }) => ({
    flex: 1
}))
const FormContainer = styled(Box)(({ theme }) => ({
   // width: '80%',
    //padding: 10,
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
        width: '97%'
    }
}))
const FormControl = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '20px 0'
}))



type Props = {
  //  mode: 'post' | "update",
    submitHandler: () => void
}

export default function InquiryForm({ submitHandler }: Props) {
    const dispatch = useAppDispatch()
    const post = useAppSelector((state) => state.ForumReducer.post)
    const isErr = useAppSelector((state) => state.ForumReducer.isErr)
 



    function handleOnChange({ target: { name, value } }: any) {
        dispatch(forumActions.setPostProps({
            name,
            value
        }))
    }


    function handleSubmit() {
        if (!(post.type && post.description && post.title)) {
            console.log('rrr')
            dispatch(testActions.setError(true))
            return true
        } else {
            dispatch(testActions.setError(false))
            submitHandler()
            return false
        }
    }



    return (
        <FormContainer>
            <FormControl>
                <TextInput sx={{ flexBasis: '50%' }}
                    error={isErr && !post.title
                    }
                    value={post.title}
                    onChange={handleOnChange}
                    name="title"
                    label={post.type === 'academic question' ? 'Question' : 'Title'}
                    placeholder={post.type === 'academic question' ? 'Question' : 'Title'} />
            </FormControl>
            <FormControl>

                <SelectWithCheckMarks error={isErr && !post?.subjects?.length}
                    data={["Chemestry", "Physics", "Math"]}
                    label="Subjects"
                    name="subjects"
                    handleSelectedSection={handleOnChange}
                    value={post.subjects ?? []} />

                <Select sx={{ flex: 1, ml: 1 }}
                    onChange={handleOnChange}
                    error={isErr && !post.request}
                    value={post.request || undefined}
                    name='request'
                    defaultValue='Select cartegory'>
                    <MenuItem value="Select cartegory">Select cartegory</MenuItem>
                    <MenuItem value="Assignment">Assignment</MenuItem>
                    <MenuItem value="Teach me">Teach me</MenuItem>
                    <MenuItem value="Stuck">Stuck</MenuItem>
                </Select>
            </FormControl>

            <ChoicesContainer>

                <FormControl>
                    <Select sx={{ flex: 1 }}
                        defaultValue='Way of conducting'
                        error={isErr && !post.delivery}
                        onChange={handleOnChange}
                        value={post.delivery || undefined}
                        name='delivery'>
                        <MenuItem value="Way of conducting">Way of conducting</MenuItem>
                        <MenuItem value="Course video">Course video</MenuItem>
                        <MenuItem value="Real time video">Real time video</MenuItem>

                    </Select>
                    {post.type === 'hire tutor' && (
                        <TextInput
                            error={isErr && !post.budget}
                            sx={{ flex: 1, marginLeft: 1 }}
                            onChange={handleOnChange}
                            name="budget"
                            value={post.budget }
                            type='number'
                            label="Budget"
                            placeholder="Budget"
                        />
                    )}
                </FormControl>

                <FormControl>
                    <Textarea minRows={6} value={post.description}
                        name="description"
                        onChange={handleOnChange}
                        sx={{ color: 'inherit', flex: 1, borderColor: isErr && !post.description ? colors.red[400] : colors.grey[400] }}
                        placeholder={`Detailed description`} />
                </FormControl>
            </ChoicesContainer>
        </FormContainer>
    )
}