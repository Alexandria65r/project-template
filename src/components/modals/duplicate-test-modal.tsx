import * as React from 'react';
import Modal from '@mui/material/Modal';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { mainActions } from '../../../reducers';
import ReusableAlert from '../reusable-alert';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';

export default function DuplicateTestModal() {
    const dispatch = useAppDispatch()
    const duplicateTestModal = useAppSelector((state) => state.MainReducer.duplicateTestModal)

    function handleClose() {
        dispatch(mainActions.setDuplicateTestModal({
            component: 'close'
        }))
    }
    return (
        <div>
            <Modal
                open={duplicateTestModal.component !== 'close'}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ReusableAlert
                    title='Duplicate'
                    cancelHandler={handleClose}
                    procceedAction={() => { }}
                    type='duplicate'
                    proccedIcon={<AddToPhotosOutlinedIcon fontSize='small' sx={{ mr: 1 }} />}
                    message={`
                    This test data will be duplicated. Are you sure you want to create a copy of
                       <b> ${duplicateTestModal.testData?.subjectOrlanguage}</b>?
                    `}
                />

            </Modal>
        </div>
    );
}