import toast from "react-hot-toast";
import { useAllRolesPermissions } from "./useAllRolesPermissions";
import { useEffect, useState, Suspense, lazy } from "react";
import Spinner from "../../../ui/Spinner";
import styles from "./PermissionList.module.css";
import { useForm } from "react-hook-form";
import {
    Users,
    Shield,
    Home,
    UserPlus,
    Eye,
    UserCircle,
    Receipt,
    Users2,
    FileText,
    Bell,
    BarChart2,
    Settings,
    RotateCcw,
} from "lucide-react";

const AddRole = lazy(() => import("./AddRole"));
const RoleList = lazy(() => import("./RoleList"));
const EditRole = lazy(() => import("./EditRole"));

const categoryIcons = {
    "User Management": Users,
    "Role Management": Shield,
    "Property Management": Home,
    "Lead Management": UserPlus,
    "Viewing Management": Eye,
    "Customer Management": UserCircle,
    "Transaction Management": Receipt,
    "Team Management": Users2,
    "Content Management": FileText,
    Communication: Bell,
    "Reports & Analytics": BarChart2,
    "System Administration": Settings,
};

function PermissionList() {
    const { data, isLoading, error } = useAllRolesPermissions();
    const { register, handleSubmit, watch, reset } = useForm();
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    useEffect(() => {
        if (selectedRole && selectedRole?.permissions) {
            const formData = {};
            
            data?.forEach(category => {
                category.permissions.forEach(permission => {
                    formData[permission.value] = false;
                });
            });
            
            selectedRole.permissions.forEach(permission => {
                formData[permission] = true;
            });
            
            reset(formData);
            
            setSelectedPermissions(selectedRole.permissions);
        } else if (!selectedRole) {
            reset({});
            setSelectedPermissions([]);
        }
    }, [selectedRole, data, reset]);

    const onSubmit = (formData) => {
        const selectedPerms = Object.entries(formData)
            .filter(([_, value]) => value === true)
            .map(([key]) => key);

        setSelectedPermissions(selectedPerms);
    };

    // Watch for form changes and update selected permissions
    useEffect(() => {
        const subscription = watch((formData) => {
            const selectedPerms = Object.entries(formData)
                .filter(([_, value]) => value === true)
                .map(([key]) => key);
            setSelectedPermissions(selectedPerms);
        });

        return () => subscription.unsubscribe();
    }, [watch]);

    if (isLoading) {
        return <Spinner type={"fullPage"} />;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.mainContent}>
                <div className={styles.buttonContainer}>
                    <div className={styles.buttonCard}>
                        {selectedRole?.role_id ? (
                            <div>
                                <Suspense fallback={<Spinner />}>
                                    <EditRole
                                        roleDescription={selectedRole?.description}
                                        roleName={selectedRole?.name}
                                        roleId={selectedRole?.role_id}
                                        roles={selectedPermissions}
                                        setSelectedRole={setSelectedRole}
                                        onResetRoles={() => {
                                            reset({});
                                            setSelectedPermissions([]);
                                            setSelectedRole(null);
                                        }}
                                    />
                                </Suspense>
                            </div>
                        ) : (
                            <Suspense fallback={<Spinner />}>
                                <AddRole
                                    roles={selectedPermissions}
                                    onResetRoles={() => {
                                        reset({});
                                        setSelectedPermissions([]);
                                    }}
                                />
                            </Suspense>
                        )}
                        <button
                            className={styles.resetButton}
                            onClick={() => {
                                reset({});
                                setSelectedPermissions([]);
                                setSelectedRole(null);
                            }}
                        >
                            <RotateCcw size={16} />
                            Reset
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {data?.map((category) => {
                        const IconComponent =
                            categoryIcons[category.category] || Shield;
                        return (
                            <div
                                key={category.category}
                                className={styles.categorySection}
                            >
                                <div className={styles.categoryHeader}>
                                    <IconComponent
                                        className={styles.categoryIcon}
                                        color={"#000"}
                                    />
                                    <h2 className={styles.categoryTitle}>
                                        {category.category}
                                    </h2>
                                </div>
                                <div className={styles.permissionGrid}>
                                    {category.permissions.map((permission) => (
                                        <div
                                            key={permission.value}
                                            className={styles.permissionItem}
                                        >
                                            <input
                                                type="checkbox"
                                                id={permission.value}
                                                {...register(permission.value)}
                                                className={styles.checkbox}
                                            />
                                            <label
                                                htmlFor={permission.value}
                                                className={styles.label}
                                            >
                                                {permission.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </form>
            </div>
            <div className={styles.sideContent}>
                <Suspense fallback={<Spinner />}>
                    <RoleList
                        selectedRole={selectedRole}
                        setSelectedRole={setSelectedRole}
                    />
                </Suspense>
            </div>
        </div>
    );
}

export default PermissionList;
