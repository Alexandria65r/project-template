import { Modal, Box } from '@mui/material'
import React from 'react'
import { useAppSelector } from '../../../store/hooks'
import PageMoreOptionsMenu from '../creator-page/page-more-options-menu'

type Props = {}

export default function ReusableModal({ }: Props) {
    const modal = useAppSelector((state) => state.MainReducer.modal)
    const open = Boolean(modal.component)
    if (!modal.component) return null
    return (
        <Modal open={open} >
            <Box>
                {modal.component === 'page-more-options-menu' && <PageMoreOptionsMenu />}
            </Box>
        </Modal>
    )
}