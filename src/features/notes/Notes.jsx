/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form';
import Modal from '../../ui/Modal';
import styles from './Notes.module.css';
import useUpdateLead from '../leads/useUpdateLead';

function Notes({ type, targetId, maxWidth = null, data }) {


    return (
        <div style={{ maxWidth }} className={`sectionDiv ${styles.notes}`}>
            <div className={styles.notesTop} >
                <h3>
                    <img src="/icons/description.svg" alt="" />
                    <span>Notes</span>
                </h3>
                <Modal>
                    <Modal.Open openWindowName="addNotes">
                        <button className={styles.btnAddNote}>
                            <img src="/icons/add.svg" />
                            <span>{data?.notes ? 'Edit' : 'Add'}</span>
                        </button>
                    </Modal.Open>
                    <Modal.Window name="addNotes">
                        <AddNoteForm type={type} targetId={targetId} data={data} />
                    </Modal.Window>
                </Modal>
            </div>

            <div className={styles.notesContent}>
                <p>{data?.notes}</p>
            </div>

        </div>
    );
}

export default Notes;

function AddNoteForm({ type, targetId, onCloseModal, data }) {
    const isEdit= Boolean(data?.notes)
    const { changeLead, isPending } = useUpdateLead()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            note: isEdit ? data?.notes : '',
        },
    });

    const onSubmit = (Formdata) => {
        changeLead({
            id: targetId,
            payload: { ...data, notes: Formdata.note }
        }, { onSettled: onCloseModal });
    };

    return (
        <div className={styles.notesForm}>
            <h3>Notes Form</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formFieldGroup}>
                    <label htmlFor="note">Note</label>
                    <input
                        id="note"
                        type="text"
                        {...register('note', { required: 'This field is required' })}
                    />
                    {errors.note && <p>{errors.note.message}</p>}
                </div>

                <button className={"btnSubmit"} type="submit">{isPending ? 'Saving...' : 'Save'}</button>
            </form>
        </div>
    );

}