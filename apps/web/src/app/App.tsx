import {Navigate,Route,Routes} from 'react-router-dom';
import {useSession} from '../session';
import {Loading} from '../ui';
import {LandingPage} from '../features/landing/LandingPage';
import {LoginPage} from '../features/auth/LoginPage';
import {AppShell} from './AppShell';
import {OverviewPage} from '../features/overview/OverviewPage';
import {WorkloadsPage,WorkloadDetailPage} from '../features/workloads/WorkloadsPage';
import {FindingsPage,FindingDetailPage} from '../features/findings/FindingsPage';
import {RemediationPage} from '../features/remediation/RemediationPage';
import {EnablementPage} from '../features/enablement/EnablementPage';
import {IntegrationsPage} from '../features/integrations/IntegrationsPage';
import {PermissionsPage} from '../features/permissions/PermissionsPage';
import {ImpactPage} from '../features/analytics/ImpactPage';
import {AuditPage} from '../features/audit/AuditPage';
import {NotificationsPage} from '../features/notifications/NotificationsPage';
import {SavedViewsPage} from '../features/saved-views/SavedViewsPage';
function Guard({children}:{children:React.ReactNode}){const{session,loading}=useSession();if(loading)return <Loading label="Restoring secure demo session"/>;return session?<>{children}</>:<Navigate to="/login" replace/>}
export function App(){return <Routes><Route path="/" element={<LandingPage/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/app" element={<Guard><AppShell/></Guard>}><Route index element={<Navigate to="overview" replace/>}/><Route path="overview" element={<OverviewPage/>}/><Route path="workloads" element={<WorkloadsPage/>}/><Route path="workloads/:workloadId" element={<WorkloadDetailPage/>}/><Route path="findings" element={<FindingsPage/>}/><Route path="findings/:findingId" element={<FindingDetailPage/>}/><Route path="remediation" element={<RemediationPage/>}/><Route path="enablement" element={<EnablementPage/>}/><Route path="enablement/new" element={<EnablementPage/>}/><Route path="integrations" element={<IntegrationsPage/>}/><Route path="permissions" element={<PermissionsPage/>}/><Route path="analytics/impact" element={<ImpactPage/>}/><Route path="audit" element={<AuditPage/>}/><Route path="notifications" element={<NotificationsPage/>}/><Route path="settings/saved-views" element={<SavedViewsPage/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
