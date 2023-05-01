import * as React from 'react';
import Modal from '@mui/material/Modal';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { mainActions } from '../../../reducers';
import ReusableAlert from '../reusable-alert';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import { duplicateTestThunk } from '../../../reducers/thunks';
import { testDataSchema } from '../../reusable/schemas';
import { Box, Typography, colors, styled } from '@mui/material';
import { CSS_PROPERTIES } from '../../reusable';
import { colorScheme } from '../../theme';
import { forumActions } from '../../../reducers/forum-reducer';
import { Badge, ButtonIcon, CartAndWishListModalContainer, StyledButton } from '../../reusable/styles';

import { useRouter } from 'next/router';
import { deleteCartItemThunk, fetchCartItemsThunk } from '../../../reducers/cart-reducer/cart-thunks';
import CartItem from '../../components/cart-item'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { wishListActions } from '../../../reducers/wishlist-reducer';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { deleteWishListThunk } from '../../../reducers/wishlist-reducer/wishlist-thunks';
import EmptyCartAndWishlist from '../empty-cart-wishlist';
import ForumPostForm from '../forum-form/forum-post-form';
import HeaderTabs from '../forum-form/header';




export const ModalContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '55%',
    minHeight: '500px',
    transform: 'translate(-50%, -50%)',
    borderRadius: CSS_PROPERTIES.radius10,
    backgroundColor: colorScheme(theme).secondaryColor,
    [theme.breakpoints.down("sm")]: {
        position: 'absolute',
        left: 0,
        width: '100%',
        transform: 'none',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        top: 'unset',
        bottom: 0
    }
}))


const CartHead = styled(Box)(() => ({
    height: 60,
    display: 'flex',
    alignItems: 'center',
    padding: '0 15px'
}))
const CartBody = styled(Box)(({ theme }) => ({
    padding: '0 15px',
    overflow: 'auto',
    minHeight: 142,
    maxHeight: 500,
    [theme.breakpoints.down("sm")]: {
        padding: '0 10px',
        minHeight: 142,
        maxHeight: 500
    }

}))

const FormControl = styled(Box)(({ theme }) => ({
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '20px auto',
    padding:'0 10px',
    [theme.breakpoints.down('sm')]:{
        width: '95%',
        margin: '16px auto',
    }
}))


const Cartooter = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    height: 60,
    //backgroundColor:'red',
    justifyContent: 'center',
    borderTop: `1px solid solid ${theme.palette.mode === 'light' ? colors.grey[200] : colorScheme(theme).primaryColor}`
}))


export default function ForumPostFormModal() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const isOpen = useAppSelector((state) => state.ForumReducer.isOpen)
    const owner = useAppSelector((state) => state.AuthReducer.user._id)
    const cartItems = useAppSelector((state) => state.CartReducer.cartItems)
    const wishListItems = useAppSelector((state) => state.WishListReducer.wishListItems)

    const fetchCartItems = React.useCallback(() => {
        dispatch(fetchCartItemsThunk(owner ?? ''))
    }, [dispatch, owner])

    React.useEffect(() => {
        fetchCartItems()
    }, [dispatch, owner])


    function handleClose() {
        dispatch(forumActions.toggleForumFormModal(false))
    }




    return (
        <div>
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <ModalContainer className="modalMb">
                    <Typography sx={(theme) => ({
                        fontSize: 20,
                        m: 2,
                        color: colorScheme(theme).TextColor,
                        fontWeight: 600,
                        [theme.breakpoints.down('sm')]: {
                            fontSize: 20,
                        }
                    })}>New Post</Typography>
                    <HeaderTabs />
                    <ForumPostForm mode="post" submitHandler={() => { }} />
                    <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
                        <FormControl  sx={{ justifyContent: 'flex-end' }}>
                            <StyledButton sx={{width:'30%', borderBottom:4, borderColor:colors.teal[300]}}>
                                Post
                            </StyledButton>
                        </FormControl>
                    </Box>
                </ModalContainer>

            </Modal>
        </div>
    );
}


