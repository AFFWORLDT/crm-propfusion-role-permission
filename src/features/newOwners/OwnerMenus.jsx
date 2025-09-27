import { useNavigate } from 'react-router-dom';
import Menus from '../../ui/Menus';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import useDeleteOwner from '../Owner/useDelete';
import AddNewOwner from './AddNewOwner';

function OwnerMenus({ ownerId }) {
    const navigate = useNavigate();
    const {deleting, isPending}=useDeleteOwner()

    return (
        <Menus>
            <Modal>
                <Menus.Toggle id={`owner-${ownerId}`} />
                <Menus.List id={`owner-${ownerId}`}>
                    <Menus.Button
                        icon="/icons/info.svg"
                        onClick={() => navigate(`/for-owner/details/${ownerId}`)}
                    >
                        View Details
                    </Menus.Button>
                    <Menus.Button
                        icon="/icons/rent.svg"
                        onClick={() => navigate(`/for-rent/new-list?owner_id=${ownerId}`)}
                    >
                        View Rent 
                    </Menus.Button>
                    <Menus.Button
                        icon="/icons/sell.svg"
                        onClick={() => navigate(`/for-sell/new-list?owner_id=${ownerId}`)}
                    >
                        View Sell 
                    </Menus.Button>

                    <Modal.Open openWindowName={`edit-owner-${ownerId}`}>
                        <Menus.Button icon="/icons/edit.svg">
                            Edit Owner
                        </Menus.Button>
                    </Modal.Open>

                    <Modal.Open openWindowName={`delete-owner-${ownerId}`}>
                        <Menus.Button icon="/icons/delete.svg">
                            Delete Owner
                        </Menus.Button>
                    </Modal.Open>
                </Menus.List>

                <Modal.Window name={`edit-owner-${ownerId}`} overflow={true}>
                   
                   <AddNewOwner ownerId={ownerId} heading="Edit Owner" />
                </Modal.Window>

                <Modal.Window name={`delete-owner-${ownerId}`}>
                    <ConfirmDelete 
                        isDeleting={isPending}
                        resourceName="owner"
                        onConfirm={() =>{
                            deleting(ownerId)
                        }}
                    />
                </Modal.Window>
            </Modal>
        </Menus>
    );
}

export default OwnerMenus; 