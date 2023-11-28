import { Box, SxProps, Theme, colors, styled } from "@mui/material"
import { ThemedText, colorScheme } from "../../theme"
import { FaTiktok } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import page from "../../api-services/page"
import { ButtonIcon, StyledButton } from "../../reusable/styles"
import PageTabs from "../page-tab-bar"
import IosShareIcon from '@mui/icons-material/IosShare';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EditIcon from '@mui/icons-material/Edit';
import { Page } from "../../models/page/page.model"
import { MutableRefObject, useRef, useState } from "react"
import { useAppDispatch } from "../../../store/hooks"
import { updatePageThunk } from "../../../reducers/page-reducer/page-thunks"
import { createToastThunk } from "../../../reducers/main-reducer/main-thunks"
import DoneIcon from '@mui/icons-material/Done';
import { AppSpinner } from "../activity-indicators"
import hexToRgba from 'hex-to-rgba';


const Container = styled(Box)(({ theme }) => ({
    marginTop: 36,
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: `1px solid ${colorScheme(theme).grayToSecondaryColor}`,
    [theme.breakpoints.down('sm')]: {
        marginTop: 36
    }
}))
const InfoHead = styled(Box)(({ theme }) => ({
    width: '100%',
    margin: 'auto',
    //display: 'grid',
    marginBottom: 8,
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    }
}))

const SocialLinks = styled(Box)(({ theme }) => ({
    position: 'relative',
    display: 'flex', justifyContent: 'center',
    [theme.breakpoints.up('xl')]: {

    }
}))


type Props = {
    page: Page
    links: string[]
    path: string
    mode: 'author' | 'read-only'
    mainButton: React.ReactNode
}

export default function PageInfo({ page, links, path, mode, mainButton }: Props) {
    const dispatch = useAppDispatch()
    const [isBio, setIsBio] = useState<'editting' | 'loading' | ''>('')
    const [isLinks, setIsLinks] = useState<'editting' | 'loading' | ''>('')

    const bioRef: MutableRefObject<HTMLParagraphElement> | any = useRef()

    async function toggleUpdateBio() {
        if (!isBio) {
            setIsBio('editting')
        } else {
            setIsBio('loading')
            const { payload } = await dispatch(updatePageThunk({ bio: bioRef.current.innerText }))
            console.log(payload)
            if (payload.success) {
                setIsBio('')
                dispatch(createToastThunk('Page bio updated successfully'))
            } else {
                dispatch(createToastThunk('Page bio not updated due to an error'))
            }
        }
    }
    async function toggleUpdateLinks() {
        if (!isLinks) {
            setIsLinks('editting')
        } else {
            setIsLinks('loading')
            const { payload } = await dispatch(updatePageThunk({ bio: bioRef.current.innerText }))
            console.log(payload)
            if (payload.success) {
                setIsLinks('')
                dispatch(createToastThunk('Page bio updated successfully'))
            } else {
                dispatch(createToastThunk('Page bio not updated due to an error'))
            }
        }
    }




    return (<Container>
        <InfoHead>
            <ThemedText sx={{ textTransform: 'capitalize', mb: 1, textAlign: 'center', fontSize: 24, fontWeight: 700 }}>
                {page.name || 'Page Name'}
            </ThemedText>
            <Box sx={(theme) => ({
                width: 260, position: 'relative', padding: 1,
                border:isBio?`1px solid ${colors.teal[500]}`:'',
                bgcolor: mode === 'author' ? hexToRgba(`${colorScheme(theme).grayToSecondaryColor}`, isBio ? '1' : '0.3') : 'unset', borderRadius: 10,
            })}>
                {mode === 'author' && <EditButton
                    sx={{ position: 'absolute', top: 0, right: 0, height: 30, width: 30, color: colors.teal[500] }}
                    loadingState={isBio} toggleUpdateHandler={toggleUpdateBio} />}
                <ThemedText ref={bioRef} contentEditable={mode === 'author' && isBio === 'editting'}
                    sx={{ textAlign: 'center', outline: 'none', fontSize: 13, lineHeight: 1.2, }}>
                    {page.bio || 'this is a bio of this page'}
                </ThemedText>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                {mainButton}
                <StyledButton
                    sx={(theme) => ({ fontSize: 14, bgcolor: colorScheme(theme).grayToSecondaryColor, color: colorScheme(theme).TextColor })}>
                    <IosShareIcon sx={{ mb: .8, fontSize: 18 }} /> Share
                </StyledButton>
            </Box>
        </InfoHead>
        <SocialLinks>
            {mode === 'author' && <EditButton
                sx={{ position: 'absolute', top: 3, right: 0, height: 30, width: 30, color: colors.teal[500] }}
                loadingState={isLinks} toggleUpdateHandler={toggleUpdateLinks} />}
            <ButtonIcon sx={{ color: colors.blue[500] }}>
                <FacebookOutlinedIcon />
            </ButtonIcon>
            <ButtonIcon>
                <FaXTwitter />
            </ButtonIcon>
            <ButtonIcon sx={{ color: colors.red[500] }}>
                <YouTubeIcon />
            </ButtonIcon>
            <ButtonIcon>
                <FaTiktok />
            </ButtonIcon>
        </SocialLinks>
        <PageTabs links={links} path={path} mode={mode} />
    </Container>)
}

type EditButtonProp = {
    loadingState: 'editting' | 'loading' | ''
    toggleUpdateHandler: () => void
    sx: SxProps<Theme>
}
const EditButton = ({ loadingState, toggleUpdateHandler, sx }: EditButtonProp) => (
    <ButtonIcon onClick={toggleUpdateHandler} sx={sx}>
        {loadingState === 'loading' ? <AppSpinner visible={true} /> : loadingState === 'editting' ? <DoneIcon sx={{ fontSize: 14 }} /> : <EditIcon sx={{ fontSize: 14 }} />}
    </ButtonIcon>
)