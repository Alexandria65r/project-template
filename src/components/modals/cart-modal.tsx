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
import { cartActions } from '../../../reducers/cart-reducer';
import { Badge, ButtonIcon, StyledButton } from '../../reusable/styles';

import { useRouter } from 'next/router';
import { fetchCartItemsThunk } from '../../../reducers/cart-reducer/cart-thunks';
import CartItem from '../../components/cart-item'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { wishListActions } from '../../../reducers/wishlist-reducer';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const Container = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '35%',
    transform: 'translate(-50%, -50%)',
    borderRadius: CSS_PROPERTIES.radius10,
    backgroundColor: colorScheme(theme).secondaryColor,
    [theme.breakpoints.down("sm")]: {
        position: 'relative',
        width: '100%',
        height: '100vh',
        borderRadius: 0,
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
    height: 300,
    overflow: 'auto',
    [theme.breakpoints.down("sm")]: {
        padding: '0 10px',
        height: 'calc(100vh - 118px)',
    }

}))




const Cartooter = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    height: 60,
    //backgroundColor:'red',
    justifyContent: 'center',
    borderTop: `1px solid ${theme.palette.mode === 'light' ? colors.grey[200] : colorScheme(theme).primaryColor}`
}))


export default function CartModal() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const isOpen = useAppSelector((state) => state.CartReducer.isOpen)
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
        dispatch(cartActions.toggleCartModal(false))
    }




    return (
        <div>
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Container>
                    <CartHead>
                        <Typography sx={{ flex: 1, fontWeight: 600, fontSize: 20 }}>Your Cart</Typography>
                        <ButtonIcon onClick={() => {
                            dispatch(cartActions.toggleCartModal(false))
                            dispatch(wishListActions.toggleWishListModal(true))
                        }}>
                            <FavoriteBorderOutlinedIcon />
                            <Badge>{wishListItems.length}</Badge>
                        </ButtonIcon>
                        <ButtonIcon onClick={() => {
                            dispatch(cartActions.toggleCartModal(false))
                        }}
                            sx={(theme) => ({
                                display: 'none',
                              
                                [theme.breakpoints.down("sm")]: {
                                    display: 'flex'
                                }
                            })}
                        >
                            <CloseOutlinedIcon />
                        </ButtonIcon>
                    </CartHead>
                    <CartBody>
                        {cartItems.map((item, index) => (
                            <CartItem key={index} cartItem={item} type="cart" />
                        ))}
                    </CartBody>
                    <Cartooter>
                        <StyledButton onClick={() => {
                            dispatch(cartActions.toggleCartModal(false))
                            router.push('/checkout')
                        }} sx={{ px: 1, width: '80%' }}>
                            Procced to checkout
                        </StyledButton>
                    </Cartooter>
                </Container>

            </Modal>
        </div>
    );
}


