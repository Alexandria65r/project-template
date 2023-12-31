import { Box } from '@mui/joy'
import React from 'react'
import NavBar from './navbar'
import _app from '../pages/_app'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useRouter } from 'next/router'
import ReusablePopper from './reusable-popper'
import SideBar from './side-bar'
import { mainActions } from '../../reducers/main-reducer'
import { LinearProgress, styled, useMediaQuery, useTheme } from '@mui/material'
import AsideNavbar from './aside-navbar'
import { checkAuthThunk } from '../../reducers/auth-reducer/auth-thunks'
import Toast from './toasts/toast'

const FlexContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    height: 'calc(100vh - 66px)',
    [theme.breakpoints.down('sm')]: {
        display: 'block'
    }
}))


type Props = {
    children: any
}

export default function Layout({ children }: Props) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const isSidebarOpen = useAppSelector((state) => state.MainReducer.isSidebarOpen)
    const [isRouteChange, setRouteChange] = React.useState<boolean>(false)
    const theme = useTheme()
    const isMobile = useMediaQuery('(max-width:600px)')
    const checkAuth = React.useCallback(async () =>
        dispatch(checkAuthThunk()),
        [router.pathname])


    React.useEffect(() => {
        localStorage.removeItem('redirectFlag')
        checkAuth()
        if (isMobile) {
            dispatch(mainActions.setIsSideBarOpen(false))
        }
    }, [router.pathname])


    React.useEffect(() => {
        router.events.on('routeChangeStart', routeChangeStart)
        router.events.on('routeChangeComplete', routeChangeComplete)
        router.events.on('routeChangeError', routeChangeError)

        return () => {
            router.events.off('routeChangeStart', routeChangeStart)
            router.events.off('routeChangeComplete', routeChangeComplete)
            router.events.off('routeChangeError', routeChangeError)
        }
    }, [])


    function routeChangeStart() {
        setRouteChange(true)
    }
    function routeChangeComplete() {
        setRouteChange(false)
    }
    function routeChangeError() {
        router.reload()
    }


    return (
        <Box>
            <Box sx={{ width: '100%', position: 'absolute', top: 0, zIndex: 9999 }}>
                {isRouteChange && <LinearProgress />}
            </Box>
            <NavBar />
            <Toast />
            <FlexContainer>
                <Box
                    sx={{
                        transition: '0.3s all',
                        flexBasis: isSidebarOpen ? '5%' : '20%',
                        [theme.breakpoints.down('sm')]: {
                            display: 'none'
                        },
                        [theme.breakpoints.up('xl')]: {
                            flexBasis: isSidebarOpen ? '5%' : '15%',
                        }
                    }}>

                    <AsideNavbar />

                </Box>

                <Box
                    sx={{ flexBasis: isSidebarOpen ? '95%' : '90%', transition: '0.3s all' }}
                    className="sideBarAnimated">
                    {children}
                </Box>
            </FlexContainer>
            <ReusablePopper />
            <SideBar />
        </Box>
    )
}