import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./pages/AppLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./pages/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import { Toaster } from "react-hot-toast";
import DevelopersList from "./pages/DevelopersList";
import AreasList from "./pages/AreasList";
import Staff from "./pages/admin/Staff";
import Integrations from "./pages/admin/Integrations";
import PortalCalls from "./pages/leads/PortalCalls";
import WhatsappLeads from "./pages/leads/WhatsappLeads";
import WhatsappLogs from "./pages/WhatsappLogs";
import AddLead from "./pages/leads/AddLead";
import EditLead from "./pages/leads/EditLead";
import LeadDetails from "./pages/leads/LeadDetails";
import NewRentProperty from "./pages/properties/rent/NewRentProperty";
import NewSellProperty from "./pages/properties/sell/NewSellProperty";
import LeadsBase from "./pages/leads/LeadsBase";
import NewPropertiesList from "./pages/properties/NewPropertiesList";
import AddProperty from "./pages/properties/AddProperty";
import EditProperty from "./pages/properties/EditProperty";
import AddNewProject from "./pages/newProjects/AddNewProject";
import NewProjectList from "./pages/newProjects/NewProjectList";
import NewProject from "./pages/newProjects/NewProject";
import EditNewProject from "./pages/newProjects/EditNewProject";
import ShareNewSellProperty from "./pages/properties/sell/ShareNewSellProperty";
import ShareNewRentProperty from "./pages/properties/rent/ShareNewRentProperty";
import PropertyViewing from "./pages/properties/PropertyViewing";
import ShareProject from "./pages/newProjects/ShareProject";
import BayutLeadPortalCalls from "./pages/BayutLeads/BayutLeadPortalCalls";
import BayutLeadsLeads from "./pages/BayutLeads/BayutLeadsLeads";
import BayutWhatsappLeads from "./pages/BayutLeads/BayutWhatsappLeads";
import Teams from "./pages/admin/Teams";
import TeamsTree from "./pages/admin/TeamsTree";
import AffiliateTree from "./pages/AffiliateTree";
import AffiliateWallet from "./pages/AffiliateWallet";
import Calendar from "./pages/calendar/Calendar";
import Watermark from "./pages/admin/Watermark";
import Notifications from "./pages/Notifications";
import DataImport from "./pages/admin/DataImport";
import Profile from "./pages/Profile";
import Packages from "./pages/Packages";
import Requirements from "./pages/requirements/Requirements";
import RequirementForm from "./pages/requirements/RequirementForm";
import RequirementDetail from "./pages/requirements/RequirementDetail";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";
import Overview from "./PrivacyPolicy/PrivacyComponent/Overview/Overview";
import TermsAndCondition from "./PrivacyPolicy/PrivacyComponent/TermsAndCondition/TermsAndCondition";
import Privacy from "./PrivacyPolicy/PrivacyComponent/PrivacyPolicy/PrivacyPolicy";
import Cancellation from "./PrivacyPolicy/PrivacyComponent/CancellationANdRefund/CancellationRefund";
import CustSupport from "./PrivacyPolicy/PrivacyComponent/CustSupport/CustSupport";
import About from "./PrivacyPolicy/PrivacyComponent/AboutUs/PAboutUs";
import Pricing from "./PrivacyPolicy/PrivacyComponent/PricingDetails/PricingDetails";
import MapPage from "./ui/MapPage";
import RentProperty from "./features/properties/RentProperty";
import Locations from "./pages/Locations";
import SubscriptionCheck from "./pages/SubscriptionCheck";
import General from "./pages/general/General";
import ManageAreas from "./pages/general/ManageAreas";
import ManageDevelopers from "./pages/general/ManageDevelopers";
import ManageCompany from "./pages/general/ManageCompany";
import ManageCalls from "./pages/general/ManageCalls";
import Subscription from "./pages/general/Subscription";
import OrganisationWallet from "./pages/general/OrganisationWallet";
import XMLFeeds from "./pages/general/XMLFeeds";
import Onboarding from "./pages/Onboarding";
import { SelectedPropertiesProvider } from "./context/SelectedPropertiesContext";
import SmtpSetting from "./pages/general/SmtpSetting";
import Audience from "./pages/Audience";
import FusionMails from "./pages/FusionMails";
import Blog from "./pages/Blog";
import ListTenents from "./pages/Tenents/ListTenents";
import AddTenends from "./pages/Tenents/AddTenends";
import TenancyContract from "./pages/Contract/TenancyContracts";
import Contract from "./pages/Contract/Contract";
import Request from "./pages/admin/Request";
import Support from "./pages/general/Support";
import RequestForFeature from "./pages/general/RequestForFeature";
import RaiseIssue from "./pages/general/RaiseIssue";
import ResolveRequest from "./pages/general/ResolveRequest";
import AgentRegistration from "./pages/AgentRegistration/AgentRegistration";
import OwnerRegistration from "./pages/OwnerRegistration/OwnerRegistration";
import TenantRegistration from "./pages/TenantRegistration/TenantRegistration";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import ClientRegistrationForm from "./components/ClientRegistrationForm";

import Updates from "./pages/general/Updates";
import WebApis from "./pages/general/WebApis";
import MobileApps from "./pages/general/MobileApps";
import ReadBlogPage from "./features/Blog/ReadblogPage";
import AddPortalLead from "./pages/leads/AddPortalLead";
import { ManageLeadsInterfaces } from "./pages/general/ManageLeadsInterfaces";
import LeaseContract from "./pages/Contract/LeaseContract";
import PropertyView from "./pages/Contract/PropertyView";
import Owner from "./pages/Contract/Owner";
import EditTenant from "./pages/Tenents/EditTenant";
import DataBase from "./pages/database/DataBase";
import CustomerList from "./pages/database/CustomerList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import GCalendar from "./pages/calendar/GCalendar";
import AgreementTable from "./pages/Contract/AgreementTable";
import AgentContract from "./pages/Contract/AgentContract";
import HrCalendar from "./pages/calendar/HrCalander";
// import AutoPopup from "./components/AutoPopup";

// Games imports
import {
    GamesHub,
    SnakeGame,
    MemoryGame,
    TicTacToe,
    BreakoutGame,
    SlidingPuzzle,
    MonopolyGame,
} from "./pages/Games";
import DubaiMonopolyGame from "./pages/Games/DubaiMonopolyGame";
import DesignSystem from "./pages/DesignSystem";
import AgentFeed from "./features/feed/AgentFeed";
import PhoneView from "./pages/leads/Phone/PhoneView";
import SmsView from "./pages/leads/Phone/SmsView";
import WhatAppView from "./pages/leads/Phone/WhatAppView";
import Building from "./pages/building/Building";
import AddNewbuilding from "./pages/building/AddNewBuilding";
import BuildingDetail from "./pages/building/DetailPage";
import Watchmen from "./pages/watchmen/Watchmen";
import TenantDetails from "./pages/Tenents/TenantDetails";
import ListRentalAgreements from "./pages/rental-agreement/ListRentalAgreements";
import RentalAgreementDetails from "./pages/rental-agreement/RentalAgreementDetails";
import Whatsapp from "./pages/Whatsapp";
import Transactions from "./pages/Transactions";
import EditNewBuilding from "./pages/building/EditNewBuilding";
import PremiumShareProperty from "./pages/properties/share-premium/PremiumShareProperty";
import BulkSharePremium from "./pages/properties/bulk-share-premium/BulkSharePremium";
import PropertyGalleryDemo from "./pages/PropertyGalleryDemo";
import UserManual from "./pages/UserManual/UserManual";
import UserManualIndex from "./pages/UserManual/UserManualIndex";
import WatchmenDetails from "./pages/watchmen/watchmenDetails";
import AddNewVehicle from "./features/vehicles/AddNewVehicle";
import VehiclesList from "./pages/vehicles/Vehicles";
import NewVehicleDetails from "./pages/vehicles/NewVehicleDetails";
import OwnerDetails from "./features/Owner/OwnerDetails";
import EdiNewVehicle from "./features/vehicles/EditNewVehicle";
import VehicleReport from "./pages/vehicles/VehicleReport";
import ListReportRentalAgreement from "./pages/rental-agreement/ListReportRentalAgreement";
import Contacts from "./pages/Contacts";
import DatabaseNames from "./pages/database/DatabaseNames";
import ManufacturerList from "./pages/ManufacturerList";
import ManageManufacturers from "./pages/general/ManageManufacturers";
import ListBuildingReports from "./pages/building/ListBuildingReports";
import AgentLeads from "./pages/AgentLeads";
import AgentProperties from "./pages/AgentProperties";
import NewProjectsReport from "./pages/NewProjectsReport";
import StaffDetails from "./pages/admin/StaffDetails";
import DeveloperDocuments from "./pages/DeveloperDocuments";
import ViewingsList from "./pages/viewings/ViewingsList";
import ViewingDetails from "./pages/viewings/ViewingDetails";
import KpiSubmissions from "./pages/KpiSubmissions";
import NewOwnersList from "./pages/owners/NewOwnersList";
import DeveloperDetails from "./pages/DeveloperDetails";
import GeminiChat from "./pages/GeminiChat";
import FAQ from "./components/FAQ/FAQ";
import "./i18n/i18n";
import PropertiesMapView from "./pages/PropertiesMapView";
import LinkTree from "./pages/LinkTree";
import SubCommunityList from "./pages/SubCommunityList";
import PropertiesInSubCommunity from "./pages/PropertiesInSubCommunity";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import NewTenentsList from "./pages/newTenentsList/NewTenentsList";
import UpcomingFollowups from "./pages/leads/UpcomingFollowups";
import FollowUpReport from "./pages/followup/FollowUpReport";
import GoogleEarthDemo from "./pages/GoogleEarthDemo";
import TwoGisDemo from "./pages/TwoGisDemo";
import Portfolio from "./pages/Portfolio";
import WaterMarkQr from "./pages/admin/WaterMarkQr";
import ManageRolesPermissions from "./pages/general/ManageRolesPermissions";
import CustomMapView from "./pages/CustomMapView";
import OffplanProjectsMap from "./pages/OffplanProjectsMap";
import FbIntegration from "./features/admin/integrations/fbIntegration";
import IntegrationContainer from "./features/admin/integrations/IntegrationContainer";
import PremiumShareProject from "./pages/newProjects/PremiumShareProject";
import LeadRotation from "./pages/general/LeadRotation";
import CurrencyConverter from "./pages/admin/general/CurrencyConverter";
import ManageMetaAds from "./pages/general/ManageMetaAds";
import EditMetaAds from "./pages/general/EditMetaAds";
import AddMetaAds from "./pages/general/AddMetaAds";
import ListRentalAgreementPaymentReports from "./pages/rental-agreement/ListRentalAgreementPaymentReports";
import BillingSuccess from "./pages/BillingSuccess";
import BillingCancel from "./pages/BillingCancel";
import PreopertyGallery from "./pages/properties/preopertyGallery/preopertyGallery";
import ProjectGallery from "./pages/newProjects/showGallary/showGallary";
import Jobs from "./pages/jobs";
import AddJob from "./pages/jobs/add";
import EditJob from "./pages/jobs/edit";
import ViewJob from "./pages/jobs/view";
import Applications from "./pages/carrier/Applications";
import Affiliate from "./pages/affiliate";
import Wallet from "./pages/wallet";
import Ledger from "./pages/ledger";
import PayoutList from "./pages/payoutList";
import AllAgentWallet from "./pages/allAgentWallet";
import Alltransaction from "./pages/Alltransaction";
import BlogFormPage from "./pages/BlogFormPage";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchOnReconnect: true,
            keepPreviousData: true,
            retry: 1,
        },
    },
});
function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <QueryClientProvider client={queryClient}>
                <SelectedPropertiesProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                    <BrowserRouter
                        future={{
                            v7_startTransition: true,
                            v7_relativeSplatPath: true,
                        }}
                    >
                        <Routes>
                            <Route path="/onboard" element={<Register />} />
                            <Route
                                path="/agent-registration"
                                element={<AgentRegistration />}
                            />
                            <Route
                                path="/owner-registration"
                                element={<OwnerRegistration />}
                            />
                            <Route
                                path="/tenant-registration"
                                element={<TenantRegistration />}
                            />
                            <Route
                                path="/registration-form"
                                element={<ClientRegistrationForm />}
                            />
                            <Route
                                path="/password-reset/request"
                                element={<ForgetPassword />}
                            />
                            <Route
                                path="/password-reset/verify"
                                element={<ResetPassword />}
                            />
                            
                            {/* Public Link Tree Routes */}
                            <Route path="/links" element={<LinkTree />} />
                            <Route path="/linktree" element={<LinkTree />} />
                            
                            <Route element={<AuthProvider />}>
                                <Route path="/login" element={<Login />} />
                                <Route element={<SubscriptionCheck />}>
                                    <Route path="/" element={<AppLayout />}>
                                        <Route
                                            path="/sub-communities"
                                            element={<SubCommunityList />}
                                        />
                                        <Route
                                            path="/properties-in-subcommunity"
                                            element={
                                                <PropertiesInSubCommunity />
                                            }
                                        />
                                        <Route
                                            path="/rental-agreement-payment-report"
                                            element={
                                                <ListRentalAgreementPaymentReports />
                                            }
                                        />
                                        <Route
                                            path="/admin/general/manage-meta-ads"
                                            element={<ManageMetaAds />}
                                        />
                                        <Route
                                            path="/meta-ads/add"
                                            element={<AddMetaAds />}
                                        />
                                        <Route
                                            path="/meta-ads/edit/:formId"
                                            element={<EditMetaAds />}
                                        />
                                        <Route
                                            path="/contacts"
                                            element={<Contacts />}
                                        />
                                        <Route
                                            path="/properties/map"
                                            element={<PropertiesMapView />}
                                        />

                                        <Route
                                            path="/agent-leads"
                                            element={<AgentLeads />}
                                        />
                                        <Route
                                            path="/agent-properties"
                                            element={<AgentProperties />}
                                        />
                                        <Route
                                            path="/new-projects-report"
                                            element={<NewProjectsReport />}
                                        />
                                        <Route
                                            path="/locations"
                                            element={<Locations />}
                                        />
                                        <Route
                                            index
                                            element={
                                                <Navigate
                                                    replace
                                                    to="/dashboard"
                                                />
                                            }
                                        />

                                        <Route
                                            path="/dashboard"
                                            element={<Dashboard />}
                                        />
                                        <Route
                                            path="/support"
                                            element={<RaiseIssue />}
                                        />
                                        <Route
                                            path="terms-and-conditions"
                                            element={<TermsAndCondition />}
                                        />
                                        <Route
                                            path="privacy-policy"
                                            element={<Privacy />}
                                        />
                                        <Route
                                            path="about-us"
                                            element={<About />}
                                        />
                                        <Route
                                            path="/user-manual"
                                            element={<UserManual />}
                                        />
                                        <Route
                                            path="/transactions"
                                            element={<Transactions />}
                                        />

                                        <Route path="/developers">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="list"
                                                element={
                                                    <RoleGuard
                                                        permissions={[
                                                            "view_developers",
                                                            "manage_developers",
                                                        ]}
                                                    >
                                                        <DevelopersList />
                                                    </RoleGuard>
                                                }
                                            />
                                            <Route
                                                path=":developerId"
                                                element={
                                                    <RoleGuard
                                                        permissions={[
                                                            "view_developers",
                                                        ]}
                                                    >
                                                        <DeveloperDetails />
                                                    </RoleGuard>
                                                }
                                            />
                                            <Route
                                                path=":developerId/documents"
                                                element={
                                                    <RoleGuard
                                                        permissions={[
                                                            "view_developers",
                                                        ]}
                                                    >
                                                        <DeveloperDocuments />
                                                    </RoleGuard>
                                                }
                                            />
                                        </Route>
                                        <Route path="/areas">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="list"
                                                element={
                                                    <RoleGuard
                                                        permissions={[
                                                            "view_areas",
                                                            "manage_areas",
                                                        ]}
                                                    >
                                                        <AreasList />
                                                    </RoleGuard>
                                                }
                                            />
                                        </Route>

                                        <Route path="/manufacturers">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="list"
                                                element={<ManufacturerList />}
                                            />
                                        </Route>
                                        <Route path="/new-projects">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="list"
                                                element={<NewProjectList />}
                                            />
                                            <Route
                                                path="list/:projectId"
                                                element={<NewProject />}
                                            />
                                            <Route
                                                path="add"
                                                element={<AddNewProject />}
                                            />
                                            <Route
                                                path="edit/:projectId"
                                                element={<EditNewProject />}
                                            />
                                        </Route>

                                        <Route path="/new-building">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="list"
                                                element={<Building />}
                                            />
                                            <Route
                                                path="list-report"
                                                element={
                                                    <ListBuildingReports />
                                                }
                                            />
                                            <Route
                                                path="add"
                                                element={<AddNewbuilding />}
                                            />
                                            <Route
                                                path="list/:id"
                                                element={<BuildingDetail />}
                                            />
                                            <Route
                                                path="edit/:id"
                                                element={<EditNewBuilding />}
                                            />
                                        </Route>

                                        <Route path="/new-watchmen">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="list"
                                                element={<Watchmen />}
                                            />
                                            <Route
                                                path="details/:watchmanId"
                                                element={<WatchmenDetails />}
                                            />
                                        </Route>
                                        <Route path="/for-sell">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="new-list"
                                                    />
                                                }
                                            />
                                            {/* <Route
                                        path="list"
                                        element={
                                            <PropertiesList listingType="SELL" /> 
                                        }
                                    />
                                    <Route
                                        path="list/:propertyId"
                                        element={<SellProperty />}
                                    /> */}
                                            <Route
                                                path="new-list"
                                                element={
                                                    <NewPropertiesList listingType="SELL" />
                                                }
                                            />
                                            <Route
                                                path="new-list/:propertyId"
                                                element={<NewSellProperty />}
                                            />
                                            <Route
                                                path="add"
                                                element={
                                                    <AddProperty listingType="SELL" />
                                                }
                                            />
                                            <Route
                                                path="edit/:propertyId"
                                                element={
                                                    <EditProperty listingType="SELL" />
                                                }
                                            />
                                        </Route>
                                        <Route path="/rental-agreement">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="list"
                                                element={
                                                    <ListRentalAgreements />
                                                }
                                            />
                                            <Route
                                                path="list-report"
                                                element={
                                                    <ListReportRentalAgreement />
                                                }
                                            />
                                            <Route
                                                path="list/:id"
                                                element={
                                                    <RentalAgreementDetails />
                                                }
                                            />
                                        </Route>
                                        {/*  Owner Routes */}

                                        <Route path="/for-owner">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="new-list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="new-list"
                                                element={<NewOwnersList />}
                                            />
                                            <Route
                                                path="details/:ownerId"
                                                element={<OwnerDetails />}
                                            />
                                        </Route>

                                        <Route path="/for-tenants">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="new-list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="details/:tenantId"
                                                element={<TenantDetails />}
                                            />

                                            <Route
                                                path="new-list"
                                                element={<ListTenents />}
                                            />
                                            <Route
                                                path="new-list-tenants"
                                                element={<NewTenentsList />}
                                            />
                                            <Route
                                                path="new-list/:propertyId"
                                                element={<NewSellProperty />}
                                            />
                                            <Route
                                                path="add"
                                                element={<AddTenends />}
                                            />
                                            <Route
                                                path="edit/:propertyId"
                                                element={
                                                    <EditProperty listingType="SELL" />
                                                }
                                            />
                                        </Route>

                                        {/* Customer Routes */}
                                        <Route path="/database">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="list"
                                                element={<DataBase />}
                                            />
                                            <Route
                                                path="list/names"
                                                element={<DatabaseNames />}
                                            />
                                            <Route
                                                path="list/customers"
                                                element={<CustomerList />}
                                            />
                                        </Route>

                                        <Route path="/contract">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="new-contract"
                                                    />
                                                }
                                            />

                                            <Route
                                                path="new-contract"
                                                element={<Contract />}
                                            />
                                            <Route
                                                path="dubai-TenantForm"
                                                element={<TenancyContract />}
                                            />
                                            <Route
                                                path="lease-contract"
                                                element={<LeaseContract />}
                                            />
                                            <Route
                                                path="property-view-contract"
                                                element={<PropertyView />}
                                            />
                                            <Route
                                                path="owner-and-broker"
                                                element={<Owner />}
                                            />
                                            <Route
                                                path="agent-contract"
                                                element={<AgentContract />}
                                            />
                                            <Route
                                                path="agrement-table"
                                                element={<AgreementTable />}
                                            />
                                        </Route>

                                        <Route
                                            path="/vehicles/for-sell"
                                            element={
                                                <VehiclesList listingType="SELL" />
                                            }
                                        />
                                        <Route
                                            path="/vehicles/for-rent"
                                            element={
                                                <VehiclesList listingType="RENT" />
                                            }
                                        />
                                        <Route
                                            path="/vehicles/:vehicleId"
                                            element={<NewVehicleDetails />}
                                        />
                                        <Route
                                            path="/vehicles/report/:vehicleId"
                                            element={<VehicleReport />}
                                        />
                                        <Route
                                            path="/vehicles/for-sell/add"
                                            element={
                                                <AddNewVehicle listingType="SELL" />
                                            }
                                        />
                                        <Route
                                            path="/vehicles/for-rent/add"
                                            element={
                                                <AddNewVehicle listingType="RENT" />
                                            }
                                        />
                                        <Route
                                            path="/vehicles/for-sell/edit/:vehicleId"
                                            element={
                                                <EdiNewVehicle listingType="SELL" />
                                            }
                                        />
                                        <Route
                                            path="/vehicles/for-rent/edit/:vehicleId"
                                            element={
                                                <EdiNewVehicle listingType="RENT" />
                                            }
                                        />
                                        <Route
                                            path="/propfusion-policies"
                                            element={<PrivacyPolicy />}
                                        >
                                            {/* <Route  element={<PrivacyPolicy/>}/>  */}
                                            <Route
                                                index
                                                element={<Overview />}
                                            />

                                            <Route
                                                path="cancellation-and-refund-policy"
                                                element={<Cancellation />}
                                            />
                                            <Route
                                                path="customer-support"
                                                element={<CustSupport />}
                                            />

                                            <Route
                                                path="pricing-details"
                                                element={<Pricing />}
                                            />
                                        </Route>
                                        <Route path="/followup-report">
                                            <Route
                                                index
                                                element={<FollowUpReport />}
                                            />
                                        </Route>
                                        <Route path="/for-rent">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="new-list"
                                                    />
                                                }
                                            />
                                            {/* <Route
                                        path="list"
                                        element={
                                            <PropertiesList listingType="RENT" />
                                        }
                                    /> */}
                                            <Route
                                                path="list/:propertyId"
                                                element={<RentProperty />}
                                            />
                                            <Route
                                                path="new-list"
                                                element={
                                                    <NewPropertiesList listingType="RENT" />
                                                }
                                            />
                                            <Route
                                                path="new-list/:propertyId"
                                                element={<NewRentProperty />}
                                            />
                                            <Route
                                                path="add"
                                                element={
                                                    <AddProperty listingType="RENT" />
                                                }
                                            />
                                            <Route
                                                path="edit/:propertyId"
                                                element={
                                                    <EditProperty listingType="RENT" />
                                                }
                                            />
                                        </Route>
                                        <Route path="/leads">
                                            <Route
                                                index
                                                element={<LeadsBase />}
                                            />

                                            <Route
                                                path="sell"
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="/leads"
                                                    />
                                                }
                                            />

                                            <Route
                                                path="rent"
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="/leads"
                                                    />
                                                }
                                            />

                                            <Route
                                                path="undefined"
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="/leads"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="enquiry"
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="/leads"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="portal-calls"
                                                element={
                                                    <RoleGuard
                                                        permissions={[
                                                            "view_leads",
                                                            "basic_affiliate",
                                                        ]}
                                                    >
                                                        <PortalCalls />
                                                    </RoleGuard>
                                                }
                                            />
                                            <Route
                                                path="whatsapp-leads"
                                                element={<WhatsappLeads />}
                                            />
                                            <Route
                                                path="phone-view"
                                                element={<PhoneView />}
                                            />
                                            <Route
                                                path="sms-view"
                                                element={<SmsView />}
                                            />
                                            <Route
                                                path="whatsapp-view"
                                                element={<WhatAppView />}
                                            />
                                            <Route
                                                path="details/:leadId"
                                                element={<LeadDetails />}
                                            />
                                            <Route
                                                path="add"
                                                element={<AddLead />}
                                            />
                                            <Route
                                                path="add-portal-lead"
                                                element={<AddPortalLead />}
                                            />
                                            <Route
                                                path="edit/:leadId"
                                                element={<EditLead />}
                                            />
                                        </Route>
                                        <Route path="/bayut-leads">
                                            <Route
                                                path="portal-calls"
                                                element={
                                                    <BayutLeadPortalCalls />
                                                }
                                            />
                                            <Route
                                                path="leads"
                                                element={<BayutLeadsLeads />}
                                            />
                                            <Route
                                                path="whatsapp-leads"
                                                element={<BayutWhatsappLeads />}
                                            />
                                        </Route>
                                        <Route
                                            path="/calendar"
                                            element={<Calendar />}
                                        ></Route>
                                        <Route
                                            path="/gcalendar"
                                            element={<GCalendar />}
                                        ></Route>
                                        <Route
                                            path="/hrcalendar"
                                            element={<HrCalendar />}
                                        ></Route>
                                        <Route path="/carrier">
                                            <Route index element={<Jobs />} />
                                            <Route
                                                path="applications"
                                                element={<Applications />}
                                            />
                                        </Route>
                                        <Route path="/jobs">
                                            <Route index element={<Jobs />} />
                                            <Route
                                                path="add"
                                                element={<AddJob />}
                                            />
                                            <Route
                                                path="edit/:id"
                                                element={<EditJob />}
                                            />
                                            <Route
                                                path="view/:id"
                                                element={<ViewJob />}
                                            />
                                        </Route>
                                        <Route
                                            path="/notifications"
                                            element={<Notifications />}
                                        ></Route>
                                        <Route
                                            path="/profile"
                                            element={<Profile />}
                                        ></Route>
                                        <Route
                                            path="/packages"
                                            element={<Packages />}
                                        ></Route>
                                        <Route
                                            path="/wallet"
                                            element={<Wallet />}
                                        ></Route>
                                        {/* Requirements Routes */}
                                        <Route
                                            path="/requirements"
                                            element={<Requirements />}
                                        />
                                        <Route
                                            path="/requirements/add"
                                            element={<RequirementForm />}
                                        />
                                        <Route
                                            path="/requirements/:id"
                                            element={<RequirementDetail />}
                                        />
                                        <Route
                                            path="/requirements/:id/edit"
                                            element={<RequirementForm />}
                                        />

                                        <Route element={<ProtectedRoute />}>
                                            <Route path="/admin">
                                                <Route
                                                    index
                                                    element={
                                                        <Navigate
                                                            replace
                                                            to="staff"
                                                        />
                                                    }
                                                />
                                                <Route
                                                    path="staff"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "view_users",
                                                                "manage_users",
                                                            ]}
                                                        >
                                                            <Staff />
                                                        </RoleGuard>
                                                    }
                                                />
                                                <Route
                                                    path="staff/:staffId"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "view_users",
                                                            ]}
                                                        >
                                                            <StaffDetails />
                                                        </RoleGuard>
                                                    }
                                                />
                                                <Route
                                                    path="requests"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "manage_support",
                                                            ]}
                                                        >
                                                            <Request />
                                                        </RoleGuard>
                                                    }
                                                />
                                                <Route
                                                    path="teams"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "view_teams",
                                                                "manage_teams",
                                                            ]}
                                                        >
                                                            <Teams />
                                                        </RoleGuard>
                                                    }
                                                />
                                                <Route
                                                    path="teams-tree"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "view_teams",
                                                            ]}
                                                        >
                                                            <TeamsTree />
                                                        </RoleGuard>
                                                    }
                                                />
                                                <Route
                                                    path="affiliate-tree"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "manage_agent",
                                                                "basic_affiliate",
                                                            ]}
                                                        >
                                                            <AffiliateTree />
                                                        </RoleGuard>
                                                    }
                                                />
                                                <Route
                                                    path="affiliate-wallet"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "manage_agent",
                                                                "basic_affiliate",
                                                            ]}
                                                        >
                                                            <AffiliateWallet />
                                                        </RoleGuard>
                                                    }
                                                />
                                                <Route
                                                    path="affiliate"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "manage_agent",
                                                                "basic_affiliate",
                                                            ]}
                                                        >
                                                            <Affiliate />
                                                        </RoleGuard>
                                                    }
                                                />
                                                <Route
                                                    path="watermark"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "manage_settings",
                                                            ]}
                                                        >
                                                            <Watermark />
                                                        </RoleGuard>
                                                    }
                                                />
                                                <Route
                                                    path="watermark-qr"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "manage_settings",
                                                            ]}
                                                        >
                                                            <WaterMarkQr />
                                                        </RoleGuard>
                                                    }
                                                />
                                                <Route
                                                    path="Map/:id"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "view_analytics",
                                                            ]}
                                                        >
                                                            <MapPage />
                                                        </RoleGuard>
                                                    }
                                                ></Route>
                                                <Route
                                                    path="audience"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "manage_customers",
                                                            ]}
                                                        >
                                                            <Audience />
                                                        </RoleGuard>
                                                    }
                                                ></Route>
                                                <Route
                                                    path="fusionmails"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "manage_emails",
                                                            ]}
                                                        >
                                                            <FusionMails />
                                                        </RoleGuard>
                                                    }
                                                ></Route>
                                                <Route
                                                    path="blog"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "view_blogs",
                                                                "manage_blogs",
                                                            ]}
                                                        >
                                                            <Blog />
                                                        </RoleGuard>
                                                    }
                                                ></Route>
                                                <Route
                                                    path="blog/add"
                                                    element={<BlogFormPage />}
                                                ></Route>
                                                <Route
                                                    path="blog/:id/edit"
                                                    element={<BlogFormPage />}
                                                ></Route>
                                                <Route
                                                    path="blog/:id"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "view_blogs",
                                                            ]}
                                                        >
                                                            <ReadBlogPage />
                                                        </RoleGuard>
                                                    }
                                                ></Route>
                                                <Route
                                                    path="integrations"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "view_integrations",
                                                                "manage_integrations",
                                                            ]}
                                                        >
                                                            <Integrations />
                                                        </RoleGuard>
                                                    }
                                                />
                                                <Route
                                                    path="data-import"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "manage_system",
                                                            ]}
                                                        >
                                                            <DataImport />
                                                        </RoleGuard>
                                                    }
                                                />
                                                <Route
                                                    path="integration"
                                                    element={
                                                        <RoleGuard
                                                            permissions={[
                                                                "manage_integrations",
                                                            ]}
                                                        >
                                                            <IntegrationContainer />
                                                        </RoleGuard>
                                                    }
                                                />
                                                <Route path="general">
                                                    <Route
                                                        index
                                                        element={<General />}
                                                    />
                                                    <Route
                                                        path="roles-permissions"
                                                        element={
                                                            <ManageRolesPermissions />
                                                        }
                                                    />
                                                    <Route
                                                        path="manage-leads-interfaces"
                                                        element={
                                                            <ManageLeadsInterfaces />
                                                        }
                                                    />
                                                    <Route
                                                        path="manage-areas"
                                                        element={
                                                            <ManageAreas />
                                                        }
                                                    />
                                                    <Route
                                                        path="manage-manufacturers"
                                                        element={
                                                            <ManageManufacturers />
                                                        }
                                                    />
                                                    <Route
                                                        path="manage-developers"
                                                        element={
                                                            <ManageDevelopers />
                                                        }
                                                    />
                                                    <Route
                                                        path="manage-company"
                                                        element={
                                                            <ManageCompany />
                                                        }
                                                    />
                                                    <Route
                                                        path="manage-calls"
                                                        element={
                                                            <ManageCalls />
                                                        }
                                                    />
                                                    <Route
                                                        path="xml-feeds"
                                                        element={<XMLFeeds />}
                                                    />
                                                    <Route
                                                        path="smtp-setting"
                                                        element={
                                                            <SmtpSetting />
                                                        }
                                                    />
                                                    <Route
                                                        path="lead-rotation"
                                                        element={
                                                            <LeadRotation />
                                                        }
                                                    />
                                                    <Route
                                                        path="web-apis"
                                                        element={<WebApis />}
                                                    />
                                                    <Route
                                                        path="mobile-apps"
                                                        element={<MobileApps />}
                                                    />
                                                    <Route
                                                        path="updates"
                                                        element={<Updates />}
                                                    />

                                                    <Route
                                                        path="request-feature"
                                                        element={
                                                            <RequestForFeature />
                                                        }
                                                    />
                                                    {/* <Route
                                                        path="support"
                                                        element={<Support />}
                                                    /> */}
                                                    <Route
                                                        path="resolve-request"
                                                        element={
                                                            <ResolveRequest />
                                                        }
                                                    />
                                                    <Route
                                                        path="subscription"
                                                        element={
                                                            <Subscription />
                                                        }
                                                    />
                                                    <Route
                                                        path="organisation-wallet"
                                                        element={
                                                            <OrganisationWallet />
                                                        }
                                                    />
                                                    <Route
                                                        path="currency-converter"
                                                        element={
                                                            <CurrencyConverter />
                                                        }
                                                    />
                                                </Route>
                                            </Route>
                                        </Route>
                                        <Route
                                            path="/feed"
                                            element={<AgentFeed />}
                                        />
                                        <Route
                                            path="/whatsapp-logs"
                                            element={<WhatsappLogs />}
                                        />
                                        <Route
                                            path="/whatsapp"
                                            element={<Whatsapp />}
                                        />
                                        <Route
                                            path="/viewings"
                                            element={<ViewingsList />}
                                        />
                                        <Route
                                            path="/viewings/:viewingId"
                                            element={<ViewingDetails />}
                                        />
                                        <Route
                                            path="/kpi-submissions"
                                            element={<KpiSubmissions />}
                                        />
                                        <Route
                                            path="/ledger"
                                            element={<Ledger />}
                                        />
                                        <Route
                                            path="/payout-list"
                                            element={<PayoutList />}
                                        />
                                        <Route
                                            path="/all-transactions"
                                            element={<Alltransaction />}
                                        />
                                        <Route
                                            path="/all-agent-wallet"
                                            element={<AllAgentWallet />}
                                        />
                                        <Route
                                            path="/followup-report"
                                            element={<UpcomingFollowups />}
                                        />
                                        <Route
                                            path="/google-earth-demo"
                                            element={<GoogleEarthDemo />}
                                        />
                                        <Route
                                            path="/2gis-demo"
                                            element={<TwoGisDemo />}
                                        />
                                        <Route
                                            path="/custom-map"
                                            element={<CustomMapView />}
                                        />
                                        <Route
                                            path="/offplan-map"
                                            element={<OffplanProjectsMap />}
                                        />
                                    </Route>
                                </Route>
                                <Route
                                    path="/onboarding"
                                    element={<Onboarding />}
                                />
                                <Route
                                    path="/portfolio/:agentId"
                                    element={<Portfolio />}
                                />
                                <Route
                                    path="/billing/success"
                                    element={<BillingSuccess />}
                                />
                                <Route
                                    path="/billing/error"
                                    element={<BillingCancel />}
                                />
                            </Route>

                            <Route
                                path="/share-project/:projectId"
                                element={<ShareProject />}
                            />
                            <Route
                                path="/share-premium/project/:projectId"
                                element={<PremiumShareProject />}
                            />
                            {/* <Route
                        path="/share-property/sell/:propertyId"
                        element={<ShareSellProperty />}
                    />
                    <Route
                        path="/share-property/rent/:propertyId"
                        element={<ShareRentProperty />}
                    /> */}

                            <Route
                                path="/share-new-property/sell/:propertyId"
                                element={<ShareNewSellProperty />}
                            />
                            <Route
                                path="/share-new-property/rent/:propertyId"
                                element={<ShareNewRentProperty />}
                            />
                            <Route
                                path="/viewing-property/:listingType/:propertyId"
                                element={<PropertyViewing />}
                            />
                            <Route
                                path="/share-premium/:listingType/:propertyId"
                                element={<PremiumShareProperty />}
                            />

                            <Route
                                path="/bulk-share-premium"
                                element={<BulkSharePremium />}
                            />
                            <Route
                                path="/property-gallery"
                                element={<PropertyGalleryDemo />}
                            />

                            <Route
                                path="/user-manual-index"
                                element={<UserManualIndex />}
                            />

                            <Route
                                path="/tenants/:tenantId/edit"
                                element={<EditTenant />}
                            />

                            <Route
                                path="/transactions"
                                element={<Transactions />}
                            />

                            <Route
                                path="/gemini-chat"
                                element={<GeminiChat />}
                            />
                            <Route
                                path="/PreopertyGallery/:listType"
                                element={<PreopertyGallery />}
                            />
                            <Route
                                path="/projectGarrery"
                                element={<ProjectGallery />}
                            />

                            <Route path="/faq" element={<FAQ />} />

                            {/* Games Routes */}
                            <Route path="/games" element={<GamesHub />} />
                            <Route
                                path="/games/snake"
                                element={<SnakeGame />}
                            />
                            <Route
                                path="/games/memory"
                                element={<MemoryGame />}
                            />
                            <Route
                                path="/games/tictactoe"
                                element={<TicTacToe />}
                            />
                            <Route
                                path="/games/breakout"
                                element={<BreakoutGame />}
                            />
                            <Route
                                path="/games/puzzle"
                                element={<SlidingPuzzle />}
                            />
                            <Route
                                path="/games/monopoly"
                                element={<MonopolyGame />}
                            />
                            <Route
                                path="/games/dubai-monopoly"
                                element={<DubaiMonopolyGame />}
                            />
                            <Route
                                path="/design-system"
                                element={<DesignSystem />}
                            />

                            <Route path="*" element={<PageNotFound />} />
                        </Routes>
                    </BrowserRouter>

                    <Toaster
                        position="top-center"
                        gutter={12}
                        containerStyle={{ margin: "8px" }}
                        toastOptions={{
                            success: {
                                duration: 3000,
                            },
                            error: {
                                duration: 5000,
                            },
                            style: {
                                fontSize: "18px",
                                padding: "14px 24px",
                                backgroundColor: "var(--clr-neutral-50)",
                                color: "var(--clr-neutral-500)",
                            },
                        }}
                    />
                    {/* <AutoPopup /> */}
                </SelectedPropertiesProvider>
            </QueryClientProvider>
        </DndProvider>
    );
}

export default App;
