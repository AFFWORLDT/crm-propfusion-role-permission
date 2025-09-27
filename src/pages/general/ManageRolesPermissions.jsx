import PermissionList from "../../features/admin/roles/PermissionList";
import SectionTop from "../../ui/SectionTop";

function ManageRolesPermissions() {
    return (
        <div className={"sectionContainer"}>
            <SectionTop heading={"Manage Roles & Permissions"} />
            <section className={"sectionStyles"}>
                <PermissionList />
            </section>
        </div>
    );
}

export default ManageRolesPermissions;
