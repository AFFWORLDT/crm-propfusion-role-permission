import {
    useUpdateContact,
    useDeleteContact,
    useCreateContact,
    useBulkImportContacts,
    useInfiniteContacts,
} from "./useContacts";
import styles from "./ContactList.module.css";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import useAllDetails from "../all-details/useAllDetails";

function getInitials(name = "") {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function EditContactModal({ contact, onClose, onSave }) {
    const [form, setForm] = useState({
        name: contact.name || "",
        phone: contact.phone || "",
        email: contact.email || "",
        tags: contact.tags || [],
        additional_info: contact.additional_info || {},
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const { data: allDetails } = useAllDetails();
    const backgroundColor =
        allDetails?.company_settings?.sidebar_color_code || "#020079";

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            await onSave(form);
        } catch (err) {
            setError(
                err?.response?.data?.detail || err.message || "Unknown error"
            );
        }
        setSaving(false);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3 className={styles.modalTitle}>Edit Contact</h3>
                <div className={styles.formGroup}>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className={styles.input}
                    />
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className={styles.input}
                    />
                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className={styles.input}
                    />
                    <input
                        name="tags"
                        value={form.tags.join(", ")}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                tags: e.target.value
                                    .split(",")
                                    .map((t) => t.trim())
                                    .filter(Boolean),
                            }))
                        }
                        placeholder="Tags (comma separated)"
                        className={styles.input}
                    />
                    <input
                        name="company"
                        value={form.additional_info.company || ""}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                additional_info: {
                                    ...f.additional_info,
                                    company: e.target.value,
                                },
                            }))
                        }
                        placeholder="Company"
                        className={styles.input}
                    />
                    <input
                        name="position"
                        value={form.additional_info.position || ""}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                additional_info: {
                                    ...f.additional_info,
                                    position: e.target.value,
                                },
                            }))
                        }
                        placeholder="Position"
                        className={styles.input}
                    />
                </div>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <div className={styles.modalActions}>
                    <button
                    
                    style={{
                        border: `1px solid ${backgroundColor}`,
                        color: backgroundColor
                    }}
                    onClick={onClose} className={styles.buttonCancel}>
                        Cancel
                    </button>
                    <button
                    style={{
                        backgroundColor
                    }}
                        onClick={handleSave}
                        disabled={saving}
                        className={`${styles.button} ${styles.buttonPrimary}`}
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function AddContactModal({ onClose, onSave }) {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        tags: [],
        additional_info: { company: "", position: "" },
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const { data: allDetails } = useAllDetails();
    const backgroundColor =
        allDetails?.company_settings?.sidebar_color_code || "#020079";

    const handleChange = (e) => {
        if (e.target.name === "company" || e.target.name === "position") {
            setForm((f) => ({
                ...f,
                additional_info: {
                    ...f.additional_info,
                    [e.target.name]: e.target.value,
                },
            }));
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            await onSave({
                ...form,
                tags:
                    typeof form.tags === "string"
                        ? form.tags
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean)
                        : form.tags,
            });
        } catch (err) {
            setError(
                err?.response?.data?.detail || err.message || "Unknown error"
            );
        }
        setSaving(false);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3 className={styles.modalTitle}>Add Contact</h3>
                <div className={styles.formGroup}>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className={styles.input}
                    />
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className={styles.input}
                    />
                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className={styles.input}
                    />
                    <input
                        name="tags"
                        value={
                            typeof form.tags === "string"
                                ? form.tags
                                : form.tags.join(", ")
                        }
                        onChange={handleChange}
                        placeholder="Tags (comma separated)"
                        className={styles.input}
                    />
                    <input
                        name="company"
                        value={form.additional_info.company || ""}
                        onChange={handleChange}
                        placeholder="Company"
                        className={styles.input}
                    />
                    <input
                        name="position"
                        value={form.additional_info.position || ""}
                        onChange={handleChange}
                        placeholder="Position"
                        className={styles.input}
                    />
                </div>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <div className={styles.modalActions}>
                    <button
                    
                    style={{
                        border :`1px solid ${backgroundColor}`,
                        color:backgroundColor
                    }}
                    onClick={onClose} className={styles.buttonCancel}>
                        Cancel
                    </button>
                    <button

                    style={{
                        backgroundColor:backgroundColor
                    }}
                        onClick={handleSave}
                        disabled={saving}
                        className={`${styles.button} ${styles.buttonPrimary}`}
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function BulkImportModal({ onClose, onImport }) {
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const { data: allDetails } = useAllDetails();
    const backgroundColor =
        allDetails?.company_settings?.sidebar_color_code || "#020079";
    const handleImport = async () => {
        if (!file) {
            setError("Please select a file");
            return;
        }
        setSaving(true);
        setError("");
        try {
            await onImport(file);
        } catch (err) {
            setError(
                err?.response?.data?.detail || err.message || "Unknown error"
            );
        }
        setSaving(false);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3 className={styles.modalTitle}>Bulk Import Contacts</h3>
                <div className={styles.formGroup}>
                    <input
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={(e) => setFile(e.target.files[0])}
                        className={styles.input}
                    />
                </div>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <div className={styles.modalActions}>
                    <button
                     style={{
                        border :`1px solid ${backgroundColor}`,
                        color:backgroundColor
                    }}
                    onClick={onClose} className={styles.buttonCancel}>
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={saving}
                        className={`${styles.button} `}
                        style={{
                            border :`1px solid ${backgroundColor}`,
                            color:backgroundColor
                        }}
                    >
                        {saving ? "Importing..." : "Import"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function DeleteConfirmModal({ contact, onClose, onConfirm }) {
    const { data: allDetails } = useAllDetails();
    const backgroundColor = allDetails?.company_settings?.sidebar_color_code || "#020079";

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3 className={styles.modalTitle}>Delete Contact</h3>
                <p className={styles.modalText}>
                    Are you sure you want to delete contact: <strong>{contact.name}</strong>?
                </p>
                <div className={styles.modalActions}>
                    <button
                        style={{
                            border: `1px solid ${backgroundColor}`,
                            color: backgroundColor
                        }}
                        onClick={onClose}
                        className={styles.buttonCancel}
                    >
                        Cancel
                    </button>
                    <button
                        style={{
                            backgroundColor: backgroundColor,
                            color: "white"
                        }}
                        onClick={onConfirm}
                        className={`${styles.button} ${styles.buttonPrimary}`}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function ContactList() {
    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteContacts();
    const [editContact, setEditContact] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [showBulk, setShowBulk] = useState(false);
    const createContact = useCreateContact();
    const updateContact = useUpdateContact();
    const deleteContact = useDeleteContact();
    const bulkImportContacts = useBulkImportContacts();
    const { data: allDetails } = useAllDetails();
    const backgroundColor =
        allDetails?.company_settings?.sidebar_color_code || "#020079";
    const [deleteContactToConfirm, setDeleteContactToConfirm] = useState(null);

    if (isLoading) return <div className={styles.contactCard}>Loading...</div>;
    if (error)
        return (
            <div className={styles.contactCard}>
                Something went wrong: {error.message}
            </div>
        );

    const contacts = data?.pages?.flatMap((page) => page.contacts) || [];
    
    if (contacts.length === 0) {
        return (
            <div>
                <div className={styles.contactCard}>
                    <div className={styles.noData}>
                        <p>No contacts found</p>
                        <button
                            onClick={() => setShowAdd(true)}
                            style={{
                                backgroundColor: backgroundColor,
                                color: "white",
                            }}
                            className={`${styles.button} ${styles.buttonPrimary}`}
                        >
                            + Add Contact
                        </button>
                    </div>
                </div>
                {showAdd && (
                    <AddContactModal
                        onClose={() => setShowAdd(false)}
                        onSave={async (form) => {
                            await createContact(form);
                            setShowAdd(false);
                        }}
                    />
                )}
            </div>
        );
    }

    async function handleDelete(contact) {
        setDeleteContactToConfirm(contact);
    }

    async function confirmDelete(contact) {
        setDeletingId(contact._id);
        await deleteContact(contact._id);
        setDeletingId(null);
        setDeleteContactToConfirm(null);
    }

    return (
        <div>
            <div className={styles.buttonGroup}>
                <button
                    onClick={() => setShowBulk(true)}
                    style={{
                        border:`1px solid ${backgroundColor}`,
                        color:backgroundColor
                    }}
                    className={`${styles.button} ` }
                >
                    Bulk Import
                </button>
                <button
                    onClick={() => setShowAdd(true)}
                    style={{
                        backgroundColor: backgroundColor,
                        color: "white",
                    }}
                    className={`${styles.button} ${styles.buttonPrimary}`}
                >
                    + Add Contact
                </button>
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.contactTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Company</th>
                            <th>Position</th>
                            <th>Tags</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((c) => (
                            <tr key={c._id}>
                                <td>
                                    <span className={styles.avatar} >
                                        {getInitials(c.name)}
                                    </span>
                                    {c.name}
                                </td>
                                <td>
                                    <a
                                        href={`tel:${c.phone}`}
                                        className={styles.tableLink}
                                    >
                                        {c.phone}
                                    </a>
                                </td>
                                <td>
                                    {c.email ? (
                                        <a
                                            href={`mailto:${c.email}`}
                                            className={styles.tableLink}
                                        >
                                            {c.email}
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td>{c.additional_info?.company || "-"}</td>
                                <td>{c.additional_info?.position || "-"}</td>
                                <td>{c.tags?.join(", ") || "-"}</td>
                                <td>
                                    <button
                                        onClick={() => setEditContact(c)}
                                        className={styles.actionButton}
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(c)}
                                        disabled={deletingId === c._id}
                                        className={styles.actionButton}
                                    >
                                        {deletingId === c._id ? (
                                            "Deleting..."
                                        ) : (
                                            <Trash2 size={16} />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {hasNextPage && (
                <div className={styles.loadMoreButton}>
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}
            {editContact && (
                <EditContactModal
                    contact={editContact}
                    onClose={() => setEditContact(null)}
                    onSave={async (form) => {
                        await updateContact(editContact._id, form);
                        setEditContact(null);
                    }}
                />
            )}
            {showAdd && (
                <AddContactModal
                    onClose={() => setShowAdd(false)}
                    onSave={async (form) => {
                        await createContact(form);
                        setShowAdd(false);
                    }}
                />
            )}
            {showBulk && (
                <BulkImportModal
                    onClose={() => setShowBulk(false)}
                    onImport={async (file) => {
                        await bulkImportContacts(file);
                        setShowBulk(false);
                    }}
                />
            )}
            {deleteContactToConfirm && (
                <DeleteConfirmModal
                    contact={deleteContactToConfirm}
                    onClose={() => setDeleteContactToConfirm(null)}
                    onConfirm={() => confirmDelete(deleteContactToConfirm)}
                />
            )}
        </div>
    );
}

export default ContactList;
