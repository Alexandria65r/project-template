import React, { useState } from 'react'
import { Box, TextField, colors, styled } from '@mui/material'
import { CSS_PROPERTIES } from '../../reusable'
import { ContinueWith, ContinueWithOverlayText, FormLogo } from '../../reusable/styles'
import AuthAPI from '../../api-services/auth'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { authActions } from '../../../reducers/auth-reducer/auth-reducer'
import { useAppSelector } from '../../../store/hooks'
import { ThemedText, colorScheme } from '../../theme'
import { StudentInfo } from '../../reusable/schemas'
import Layout from '../../components/layout'
import { AppSpinner } from '../../components/activity-indicators'

const Container = styled(Box)(({ theme }) => ({
  width: '80%',
  margin: '100px auto',
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.down("sm")]: {
    height: 'calc(100vh - 60px)',
    margin: '1px auto',
    alignItems: 'center',
    width: '100%',
  }
}))

export const ServicesCol = styled(Box)(({ theme }) => ({
  position: 'relative',
  flexBasis: '50%',
  padding: 20,
  height: 200,
  backgroundColor: colorScheme(theme).secondaryColor,
  borderRadius: CSS_PROPERTIES.radius10,
  boxShadow: `0 1px 3px 0 ${colorScheme(theme).chatBoarderColor}`,
  [theme.breakpoints.down("sm")]: {
    flexBasis: '96%'
  }
}))
export const FormCol = styled(Box)(({ theme }) => ({
  position: 'relative',
  flexBasis: '45%',
  padding: 20,
  backgroundColor: colorScheme(theme).secondaryColor,
  borderRadius: CSS_PROPERTIES.radius10,
  boxShadow: `0 1px 3px 0 ${colorScheme(theme).chatBoarderColor}`,
  [theme.breakpoints.down("sm")]: {
    flexBasis: '96%'
  },
  [theme.breakpoints.up("xl")]: {
    flexBasis: '30%'
  }
}))


const ChooseAccountType = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: 10,
  margin: '20px 0'
}))


const AccountTypeCard = styled(Box)(({ theme }) => ({
  userSelect: 'none',
  flex: 1,
  cursor: 'pointer',
  border: '1px solid',
  borderBottomWidth: 3,
  borderRadius: 10
}))


const AccountTypeHead = styled(Box)(({ theme }) => ({
  position: 'relative',
  //padding: 10
}))


type UserTtype = {
  name: 'creator' | 'fan';
  description: string;
  accent: string
}

type Props = {}

export default function TutorForm({ }: Props) {
  const router = useRouter()
  const signUpData = useAppSelector((state) => state.AuthReducer.user)
  const [loading, setLoading] = useState<string>('')
  const fullname = `${signUpData.firstName} ${signUpData.lastName}`

  const accountTypes: UserTtype[] = [
    {
      name: 'creator',
      description: 'Invite fans and connect with them directly for free.Create premium content for your fans',
      accent: colors.amber[500]
    },
    {
      name: 'fan',
      description: 'Easly connect with your creators you love and have access to exclusive/premium content.',
      accent: colors.green[500]
    }
  ]

  async function updateUserAccountType(role: 'creator' | 'fan') {
    setLoading(role)
    const { data } = await AuthAPI.update(signUpData._id ?? '', {
      role,
    })
    if (data.success) {
      setLoading('')
      if (role === 'creator') {
        router.push('/page/setup')
      } else {
        router.push('/find-creators/q=nothing')
      }
    }
  }

  return (
    <Layout>
      <Container>
        <FormCol>
          <FormLogo></FormLogo>
          <ThemedText sx={{ fontSize: 24, mt: 2, fontWeight: 600, textAlign: 'center', textTransform: 'capitalize' }}>
            Welcome {fullname}
          </ThemedText>
          <ThemedText mt={1} >
            Welcome to the place where content creators love.
            as a creator you can recieve support from your fans while
            you give exclusive content to your fans.
          </ThemedText>
          <ContinueWith sx={{ my: 2 }}>
            <ContinueWithOverlayText sx={{ fontWeight: 600 }}>Register as a</ContinueWithOverlayText>
          </ContinueWith>
          <ChooseAccountType>
            {accountTypes.map((item, index) => (
              <AccountTypeCard
                onClick={() => updateUserAccountType(item.name)}
                key={index}
                sx={{
                  borderColor: item.accent,
                  borderLeftWidth: index === 0 ? '3px' : 1,
                  borderRightWidth: index === 1 ? '3px' : 1
                }}>
                <AccountTypeHead>
                  <Box sx={{ position: 'absolute', top: 8, right: 2 }}>
                    <AppSpinner visible={item.name === loading} />
                  </Box>
                  <ThemedText sx={{ textAlign: 'center', textTransform: 'capitalize', fontSize: 20, fontWeight: 600 }}>
                    {item.name}
                  </ThemedText>
                </AccountTypeHead>
                <Box sx={{ p: 1, }}>
                  <ThemedText sx={{ lineHeight: 1.2, fontSize: 14, textAlign: 'center', }}>
                    {item.description}
                  </ThemedText>
                </Box>
              </AccountTypeCard>
            ))}
          </ChooseAccountType>
        </FormCol>
      </Container>
    </Layout>
  )
}