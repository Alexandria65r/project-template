import { Box, Button, MenuItem, Select, TextField, Typography, colors, styled } from '@mui/material'
import React, { useState } from 'react'
import { CSS_PROPERTIES } from '../../reusable'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import SelectWithCheckMarks from '../form-inputs/select-with-checkmarks'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { testActions } from '../../../reducers/test-reducer'
import { Section } from '../../reusable/interfaces'
import { useRouter } from 'next/router'
import randomstring from 'randomstring'
import TestAPI from '../../api-services/test'



const ChoicesContainer = styled(Box)(({ theme }) => ({
    marginLeft: 20
}))

const TextInput = styled(TextField)(({ theme }) => ({
    flex: 1
}))
const FormContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    padding: 10,
}))
const FormControl = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '20px 0'
}))
const _FormControlColBadge = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    margin: 5,
    borderRadius: '50%',
    backgroundColor: colors.grey[300]
}))

const BadgeText = styled(Typography)(() => ({
    fontSize: 20,
    fontWeight: 500,
    color: '#ffff'
}))

const FormControlColBadge = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    margin: 5,
    fontSize: 18,
    fontWeight: 500,
    color: '#ffff',
    borderRadius: '50%',
    backgroundColor: colors.blue[400]
}))


const Textarea = styled(TextareaAutosize)(({ theme }) => ({
    padding: 10,
    resize: 'none',
    fontFamily: 'inherit',
    outline: 'none',
    borderRadius: CSS_PROPERTIES.radius5,
    borderColor: theme.palette.grey[400]
}))

const StyledButton = styled(Button)(({ theme }) => ({
    textTransform: 'capitalize',
    height: 45,
    borderRadius: 5,
    [theme.breakpoints.down('sm')]: {
        flexBasis: '100%',
        borderRadius: 5,
        margin: '6px 0'
    }
}))



type Props = {}

export default function NewTestForm({ }: Props) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const newTest = useAppSelector((state) => state.TestReducer.newTest)
    const [sections, setSelectedSections] = useState<string[]>([])
    const isErr = useAppSelector((state) => state.TestReducer.isErr)
    const user = useAppSelector((state) => state.AuthReducer.user)


    function selectCartegory({ target }: any) {
        dispatch(testActions.setNewTestProperties({
            name: target.name,
            value: target.value
        }))
    }
    function selectSectionType({ target: { name, value } }: any) {
        if (newTest.sections.length) {
            //clear existing before set
            dispatch(testActions.setNewTestProperties({
                name: 'sections',
                value: []
            }))
        }

        if (value === 'None sectioned') {
            dispatch(testActions.setNewTestProperties({
                name: 'sections',
                value: [{
                    name: value,
                    questions:[],
                    wayOfAnswering: '',
                    numberOfQuestions: 0
                }]
            }))
        }
        dispatch(testActions.setNewTestProperties({
            name,
            value
        }))
    }

    let newSections: Section[] = []
    function handleSelectedSection({ target: { name, ...rest } }: any) {
        const value: string[] = rest.value
        console.log(value)
        setSelectedSections(value)

        value.forEach((section) => {
            newSections.push({
                name: section.split(' ')[1],
                numberOfQuestions: 0,
                wayOfAnswering: '',
                questions: []
            })
        })
        dispatch(testActions.setNewTestProperties({
            name,
            value: newSections
        }))
        console.log(newTest)
    }


    function handleSectionNumberOfQuestions(index: number, update: string, updateKey: 'numberOfQuestions' | 'wayOfAnswering') {
        const clonedSections = [...newTest.sections]
        const clonedSection: Section | any = { ...clonedSections[index] }
        //if (update === 'Way of answering') return

        if (updateKey === 'numberOfQuestions') {
            clonedSection[updateKey] = parseInt(update)
        } else {
            clonedSection[updateKey] = update
        }

        clonedSections[index] = clonedSection;

        dispatch(testActions.setNewTestProperties({
            name: 'sections',
            value: clonedSections
        }))
    }

    function handleOnChange({ target: { name, value } }: any) {
        dispatch(testActions.setNewTestProperties({
            name,
            value
        }))
    }


    function handleValidations() {
        if (!(newTest.cartegory && newTest.description && newTest.subjectOrlanguage)) {
            console.log('rrr')
            dispatch(testActions.setError(true))
            return true
        } else {
            dispatch(testActions.setError(false))
            return false
        }
    }

    async function createTest() {
        const error = handleValidations()
        if (error) return
        if (!isErr) {
            const testId = randomstring.generate(17)
            const { data } = await TestAPI.create({
                ...newTest,
                _id: testId,
                authorId: user._id ?? ''
            })
            if (data.success) {
                console.log(newTest)
                router.push(`/prepare/${data.newTest._id}`)
            }
        }
    }

    return (
        <FormContainer>
            <FormControl>
                <Select fullWidth onChange={selectCartegory}
                    error={isErr && !newTest.cartegory}
                    value={newTest.cartegory || undefined}
                    name='cartegory' defaultValue='Select cartegory' >
                    <MenuItem value="Select cartegory">Select cartegory</MenuItem>
                    <MenuItem value="School">School Test</MenuItem>
                    <MenuItem value="Coding">Coding Challenge</MenuItem>
                    <MenuItem value="Survey">Survey Feedback</MenuItem>
                </Select>
            </FormControl>

            <ChoicesContainer>

                {newTest.cartegory && (
                    <FormControl>
                        <TextInput sx={{ flexBasis: '50%' }}
                            error={isErr && !newTest.subjectOrlanguage
                            }
                            value={newTest.subjectOrlanguage}
                            onChange={handleOnChange}
                            name="subjectOrlanguage"
                            label={newTest.cartegory === 'School' ? 'Subject' : newTest.cartegory === 'Survey' ? 'Survey Name' : 'Language'}
                            placeholder={newTest.cartegory === 'School' ? 'Subject' : newTest.cartegory === 'Survey' ? 'Survey Name' : 'Language'} />
                    </FormControl>
                )}


                <FormControl>
                    <Select onChange={selectSectionType}
                        error={isErr && !newTest.sectionType}
                        name="sectionType"
                        defaultValue='Split test into sections?'
                        value={newTest.sectionType || undefined}
                        sx={{ flexBasis: '68%' }}>
                        <MenuItem value="Split test into sections?">Split into sections?</MenuItem>
                        <MenuItem value="None sectioned">None sectioned</MenuItem>
                        <MenuItem value="With sections">With sections</MenuItem>
                    </Select>
                    {newTest.cartegory !== 'Survey' && (
                        <Select onChange={handleOnChange}
                            error={isErr && !newTest.sectionType}
                            value={newTest.duration || undefined}
                            name="duration"
                            defaultValue='Duration'
                            sx={{ flexBasis: '30%' }}>
                            <MenuItem value="Duration">Duration</MenuItem>
                            <MenuItem value="30mins">30mins</MenuItem>
                            <MenuItem value="40mins">40mins</MenuItem>
                            <MenuItem value="1hr">1hr</MenuItem>
                            <MenuItem value="2hrs">2hrs</MenuItem>
                        </Select>
                    )}
                </FormControl>

                {newTest.sectionType === 'None sectioned' && (
                    <FormControl>
                        <FormControlColBadge sx={{
                            fontSize: 16,
                            borderRadius: 1,
                            padding: '0 10px',
                            width: 'fit-content',
                            height: 55
                        }} >
                            {newTest.sectionType}
                        </FormControlColBadge>
                        <TextInput
                            error={isErr && newTest.sections[0].numberOfQuestions < 1}
                            sx={{ flex: 1 }}
                            onChange={({ target: { value } }) => handleSectionNumberOfQuestions(0, value, 'numberOfQuestions')}
                            value={newTest.sections[0].numberOfQuestions}
                            type='number'
                            label="Number of questions"
                            placeholder="Number of questions"
                        />

                        <Select sx={{ flexBasis: '48%', marginLeft: 1 }}
                            defaultValue='Way of answering'
                            error={isErr && !newTest.sections[0].wayOfAnswering}
                            onChange={({ target: { value } }) => handleSectionNumberOfQuestions(0, value, 'wayOfAnswering')}
                            value={newTest.sections[0].wayOfAnswering || undefined}
                            name='cartegory'>
                            <MenuItem value="Way of answering">Way of answering</MenuItem>
                            <MenuItem value="multiple choice">multiple choice</MenuItem>
                            <MenuItem value="select that apply">select that apply</MenuItem>
                            <MenuItem value="word answer">word answer</MenuItem>
                        </Select>
                    </FormControl>
                )}


                {newTest.sectionType === 'With sections' && (<>
                    <FormControl>
                        <SelectWithCheckMarks error={isErr && !sections.length}
                            name="sections"
                            handleSelectedSection={handleSelectedSection}
                            sections={sections} />
                    </FormControl>

                    {newTest.sections.map((section, index) => (
                        <FormControl key={section.name} sx={{ gap: 1 }}>
                            <FormControlColBadge sx={{
                                fontSize: 16,
                                borderRadius: 1,
                                //padding: '0 10px',
                                height: 55
                            }} >
                                {section.name}
                            </FormControlColBadge>
                            <TextInput sx={{ flex: 1 }}
                                error={isErr && newTest.sections[index].numberOfQuestions < 1}
                                onChange={({ target: { value } }) => handleSectionNumberOfQuestions(index, value, 'numberOfQuestions')}
                                value={section.numberOfQuestions}
                                type='number'
                                label={`Number of questions for section ${section.name}  `}
                                placeholder={`Number of questions for section ${section.name}`}
                            />

                            <Select sx={{ flex: 1 }}
                                defaultValue='Way of answering'
                                error={isErr && !newTest.sections[index].wayOfAnswering}
                                onChange={({ target: { value } }) => handleSectionNumberOfQuestions(index, value, 'wayOfAnswering')}
                                value={section.wayOfAnswering || undefined}
                                name='cartegory'>
                                <MenuItem value="Way of answering">Way of answering</MenuItem>
                                <MenuItem value="multiple choice">multiple choice</MenuItem>
                                <MenuItem value="select that apply">select that apply</MenuItem>
                                <MenuItem value="word answer">word answer</MenuItem>
                            </Select>
                        </FormControl>
                    ))}

                </>
                )}




                <FormControl>
                    <Textarea minRows={2} value={newTest.description}
                        name="description"
                        onChange={handleOnChange}
                        sx={{ flex: 1, borderColor: isErr && !newTest.description ? colors.red[400] : colors.grey[400] }}
                        placeholder={`${newTest.cartegory} description`} />
                </FormControl>

                <FormControl onClick={createTest} sx={{ justifyContent: 'flex-end' }}>
                    <StyledButton variant='contained'>Create</StyledButton>
                </FormControl>
            </ChoicesContainer>
        </FormContainer>
    )
}