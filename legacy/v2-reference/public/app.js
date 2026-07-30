/* CSER Workspace — independent candidate concept, fictional data. Built 2026-07-29T22:16:38.075Z */
"use strict";
const { useEffect, useMemo, useRef, useState, useCallback } = React;
const ROLE_LABELS = {
    SECURITY_ANALYST: 'Security Analyst', CLOUD_OPERATIONS: 'Cloud Operations', SECURITY_MANAGER: 'Security Manager', READ_ONLY_AUDITOR: 'Read-only Auditor', PLATFORM_ADMIN: 'Platform Admin'
};
const PROVIDER_ICON = { AZURE: '◫', AWS: '◒', GCP: '◇' };
const STATUS_LABEL = { OPEN: 'Open', TRIAGED: 'Triaged', ASSIGNED: 'Assigned', IN_PROGRESS: 'In progress', READY_FOR_REVIEW: 'Ready for review', VERIFIED: 'Verified', RESOLVED: 'Resolved', ACCEPTED_RISK: 'Accepted risk', DEFERRED: 'Deferred', FALSE_POSITIVE: 'False positive' };
function cx(...names) { return names.filter(Boolean).join(' '); }
function money(value) { return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value || 0); }
function date(value) { if (!value)
    return '—'; return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)); }
function relative(value) { if (!value)
    return 'Never'; const hours = Math.round((Date.now() - new Date(value).getTime()) / 3600000); return hours < 1 ? 'Just now' : hours < 24 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`; }
function newId(prefix = 'id') { return `${prefix}-${Math.random().toString(36).slice(2)}-${Date.now()}`; }
function hashRoute(path) { location.hash = path.startsWith('#') ? path : `#${path}`; }
function getRoute() { const raw = location.hash.replace(/^#/, '') || '/overview'; const [path, query = ''] = raw.split('?'); return { path, query: new URLSearchParams(query) }; }
function has(session, permission) { return !!session?.permissions.includes(permission); }
async function request(path, options = {}, session) {
    const headers = { 'content-type': 'application/json', 'x-correlation-id': newId('cor'), ...(options.headers || {}) };
    if (options.method && options.method !== 'GET' && options.method !== 'HEAD') {
        if (session?.csrfToken)
            headers['x-csrf-token'] = session.csrfToken;
        headers['idempotency-key'] = options.idempotencyKey || newId('idem');
        if (options.version != null)
            headers['if-match'] = `W/\"${options.version}\"`;
    }
    const res = await fetch(path, { ...options, headers, body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body });
    const data = await res.json().catch(() => ({ title: 'Unexpected response', detail: `HTTP ${res.status}` }));
    if (!res.ok) {
        const err = new Error(data.detail || data.title || 'Request failed');
        err.status = res.status;
        err.code = data.code;
        err.data = data;
        throw err;
    }
    return { data, etag: res.headers.get('etag') };
}
function useAsync(loader, deps) {
    const [state, setState] = useState({ loading: true, data: null, error: null });
    const reload = useCallback(() => { let active = true; setState(s => ({ ...s, loading: true, error: null })); loader().then(data => active && setState({ loading: false, data, error: null })).catch(error => active && setState(s => ({ ...s, loading: false, error }))); return () => { active = false; }; }, deps);
    useEffect(() => reload(), [reload]);
    return { ...state, reload };
}
function Icon({ name, size = 18 }) {
    const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
    const paths = {
        overview: React.createElement(React.Fragment, null,
            React.createElement("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }),
            React.createElement("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }),
            React.createElement("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }),
            React.createElement("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" })),
        workloads: React.createElement(React.Fragment, null,
            React.createElement("rect", { x: "3", y: "4", width: "18", height: "6", rx: "2" }),
            React.createElement("rect", { x: "3", y: "14", width: "18", height: "6", rx: "2" }),
            React.createElement("path", { d: "M7 7h.01M7 17h.01M11 7h6M11 17h6" })),
        findings: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M12 3 2.8 19a1.2 1.2 0 0 0 1 1.8h16.4a1.2 1.2 0 0 0 1-1.8Z" }),
            React.createElement("path", { d: "M12 9v4M12 17h.01" })),
        remediation: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "m14.7 6.3 3-3 3 3-3 3M17.7 3.3v8.4a5 5 0 0 1-5 5H3" }),
            React.createElement("path", { d: "m9.3 17.7-3 3-3-3" })),
        enablement: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M4 17 14 7l3 3L7 20H4z" }),
            React.createElement("path", { d: "m13 8 3-3 3 3-3 3M5 3v4M3 5h4M19 16v5M16.5 18.5h5" })),
        integrations: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M7 7h4v4H7zM13 13h4v4h-4z" }),
            React.createElement("path", { d: "M11 9h3a2 2 0 0 1 2 2v2M13 15h-3a2 2 0 0 1-2-2v-2" })),
        permissions: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" }),
            React.createElement("path", { d: "m9 12 2 2 4-4" })),
        analytics: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M4 19V9M10 19V5M16 19v-7M22 19V3" })),
        audit: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M12 8v4l3 2" }),
            React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
            React.createElement("path", { d: "M3 12H1M23 12h-2" })),
        search: React.createElement(React.Fragment, null,
            React.createElement("circle", { cx: "11", cy: "11", r: "7" }),
            React.createElement("path", { d: "m20 20-4-4" })),
        bell: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" })),
        menu: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M4 6h16M4 12h16M4 18h16" })),
        logout: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6" })),
        refresh: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M20 7v5h-5M4 17v-5h5" }),
            React.createElement("path", { d: "M18 12a6 6 0 0 0-10-4L5 12M6 12a6 6 0 0 0 10 4l3-4" })),
        arrow: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "m9 18 6-6-6-6" })),
        close: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "m6 6 12 12M18 6 6 18" })),
        check: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "m5 12 4 4L19 6" })),
        cloud: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M17.5 19H6a4 4 0 0 1-.4-8 6.5 6.5 0 0 1 12.5-1.5A4.8 4.8 0 0 1 17.5 19Z" })),
        shield: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" })),
        plus: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M12 5v14M5 12h14" })),
        filter: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M4 5h16M7 12h10M10 19h4" })),
        dots: React.createElement(React.Fragment, null,
            React.createElement("circle", { cx: "5", cy: "12", r: "1", fill: "currentColor" }),
            React.createElement("circle", { cx: "12", cy: "12", r: "1", fill: "currentColor" }),
            React.createElement("circle", { cx: "19", cy: "12", r: "1", fill: "currentColor" }))
    };
    return React.createElement("svg", { ...common }, paths[name] || paths.dots);
}
function Badge({ type, value }) {
    const slug = value.toLowerCase().replace(/_/g, '-');
    return React.createElement("span", { className: cx(type === 'status' ? 'status-pill' : type === 'severity' ? 'severity-pill' : 'provider-pill', `${type}-${slug}`) },
        type === 'provider' && PROVIDER_ICON[value],
        " ",
        type === 'status' ? (STATUS_LABEL[value] || value) : value);
}
function Button({ children, className = '', onClick, disabled = false, type = 'button', title }) { return React.createElement("button", { type: type, title: title, disabled: disabled, onClick: onClick, className: cx('btn', className) }, children); }
function Panel({ children, className = '', ...rest }) { return React.createElement("section", { className: cx('panel', className), ...rest }, children); }
function PanelHeader({ title, subtitle, action }) { return React.createElement("div", { className: "panel-header" },
    React.createElement("div", null,
        React.createElement("h2", null, title),
        subtitle && React.createElement("small", null, subtitle)),
    action); }
function ErrorState({ error, onRetry }) { return React.createElement("div", { className: "error-state", role: "alert" },
    React.createElement("strong", null, error?.data?.title || 'The data could not be loaded'),
    React.createElement("span", null, error?.message || 'Try the operation again.'),
    onRetry && React.createElement("div", { style: { marginTop: 12 } },
        React.createElement(Button, { className: "small", onClick: onRetry },
            React.createElement(Icon, { name: "refresh", size: 14 }),
            " Retry"))); }
function Loading({ rows = 5 }) { return React.createElement("div", { className: "loading-lines", "aria-label": "Loading" }, Array.from({ length: rows }, (_, i) => React.createElement("div", { className: "loading-line", key: i }))); }
function Empty({ title = 'No results', message = 'Try changing your filters.' }) { return React.createElement("div", { className: "empty-state" },
    React.createElement("strong", null, title),
    React.createElement("span", null, message)); }
function ConceptBanner() { return React.createElement("div", { className: "concept-banner" },
    React.createElement("span", null, "\u24D8"),
    React.createElement("strong", null, "Independent candidate concept"),
    React.createElement("span", null, "Fictional data. Not an official ESET product. No internal systems or APIs are used.")); }
function PageHeader({ title, description, actions }) { return React.createElement("div", { className: "page-header" },
    React.createElement("div", null,
        React.createElement("h1", null, title),
        React.createElement("p", null, description)),
    actions && React.createElement("div", { className: "header-actions" }, actions)); }
function Sparkline({ values, color = '#4d78ff' }) {
    const max = Math.max(...values), min = Math.min(...values), w = 120, h = 28;
    const pts = values.map((v, i) => `${i / (values.length - 1) * w},${h - (v - min) / (max - min || 1) * (h - 4) - 2}`).join(' ');
    return React.createElement("div", { className: "mini-spark" },
        React.createElement("svg", { viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: "none" },
            React.createElement("polyline", { points: pts, fill: "none", stroke: color, strokeWidth: "2" }),
            React.createElement("polygon", { points: `0,${h} ${pts} ${w},${h}`, fill: color, opacity: ".08" })));
}
function MetricCard({ label, value, trend, color = '#4d78ff', values, onClick }) { const activate = (event) => { if (onClick && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    onClick();
} }; return React.createElement("article", { className: "metric-card", style: { '--metric-glow': color }, onClick: onClick, onKeyDown: activate, role: onClick ? 'button' : undefined, tabIndex: onClick ? 0 : undefined, "aria-label": onClick ? `${label}: ${value}. Open filtered results.` : undefined },
    React.createElement("div", { className: "metric-label" },
        React.createElement("span", null, label),
        React.createElement("span", { "aria-hidden": "true" }, "\u2197")),
    React.createElement("div", { className: "metric-value" }, value),
    React.createElement("div", { className: "metric-trend" }, trend),
    React.createElement(Sparkline, { values: values, color: color })); }
function LoginModal({ identities, onSelect, loading }) {
    return React.createElement("div", { className: "modal-backdrop" },
        React.createElement("div", { className: "modal", role: "dialog", "aria-modal": "true" },
            React.createElement("div", { style: { display: 'flex', gap: 15, alignItems: 'center' } },
                React.createElement("span", { className: "brand-mark" },
                    React.createElement("span", null)),
                React.createElement("div", null,
                    React.createElement("h2", null, "Enter the CSER Workspace"),
                    React.createElement("p", { style: { margin: 0 } }, "Choose a fictional demo identity. Permissions are enforced by the API for every action."))),
            React.createElement("div", { className: "concept-banner", style: { marginTop: 20 } },
                React.createElement("span", null, "\u24D8"),
                React.createElement("span", null, "Independent candidate concept built from public information and fictional data. It is not an official ESET product.")),
            React.createElement("div", { className: "identity-grid" }, identities.map(x => React.createElement("button", { className: "identity-card", key: `${x.userId}-${x.tenantId}`, onClick: () => onSelect(x), disabled: loading },
                React.createElement("strong", null, x.displayName),
                React.createElement("small", null, x.tenantName),
                React.createElement("span", { className: "identity-role" }, ROLE_LABELS[x.role]))))));
}
function Shell({ session, setSession, notify }) {
    const [route, setRoute] = useState(getRoute());
    const [menu, setMenu] = useState(false);
    const [identityOpen, setIdentityOpen] = useState(false);
    const [identities, setIdentities] = useState([]);
    const [notifications, setNotifications] = useState({ items: [], unread: 0 });
    useEffect(() => { const f = () => setRoute(getRoute()); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []);
    useEffect(() => { request('/api/notifications', {}, session).then(r => setNotifications(r.data)).catch(() => { }); }, [session.user.id]);
    const nav = [['/overview', 'overview', 'Overview'], ['/workloads', 'workloads', 'Workloads'], ['/findings', 'findings', 'Findings'], ['/remediation', 'remediation', 'Remediation'], ['/enablement', 'enablement', 'Enablement'], ['/integrations', 'integrations', 'Integrations'], ['/permissions', 'permissions', 'Permissions'], ['/analytics', 'analytics', 'Business impact'], ['/audit', 'audit', 'Audit explorer']];
    async function logout() { await request('/api/logout', { method: 'POST' }, session).catch(() => { }); setSession(null); }
    async function openIdentity() { const r = await request('/api/demo/identities'); setIdentities(r.data.identities); setIdentityOpen(true); }
    async function switchIdentity(x) { await request('/api/demo/switch-identity', { method: 'POST', body: x }); const me = await request('/api/me'); setSession(me.data); setIdentityOpen(false); notify({ type: 'success', title: 'Identity switched', message: `Now acting as ${x.displayName}.` }); }
    return React.createElement("div", { className: "app-root" },
        React.createElement("header", { className: "app-topbar" },
            React.createElement("button", { className: "icon-button mobile-menu", onClick: () => setMenu(!menu), "aria-label": "Open navigation" },
                React.createElement(Icon, { name: "menu" })),
            React.createElement("a", { className: "brand", href: "/" },
                React.createElement("span", { className: "brand-mark" },
                    React.createElement("span", null)),
                React.createElement("span", null,
                    React.createElement("strong", null, "CSER"),
                    " Workspace")),
            React.createElement("div", { className: "global-search" },
                React.createElement(Icon, { name: "search", size: 17 }),
                React.createElement("input", { "aria-label": "Global search", placeholder: "Search workloads, findings, owners\u2026", onKeyDown: (e) => { if (e.key === 'Enter' && e.currentTarget.value)
                        hashRoute(`/findings?search=${encodeURIComponent(e.currentTarget.value)}`); } })),
            React.createElement("div", { className: "topbar-actions" },
                React.createElement("button", { className: "icon-button", "aria-label": "Notifications", onClick: () => hashRoute('/notifications') },
                    React.createElement(Icon, { name: "bell" }),
                    React.createElement("span", { className: "notification-dot" }, notifications.unread)),
                React.createElement("button", { className: "icon-button", title: "Switch demo identity", onClick: openIdentity },
                    React.createElement(Icon, { name: "permissions" })),
                React.createElement("button", { className: "icon-button", title: "Log out", onClick: logout },
                    React.createElement(Icon, { name: "logout" })),
                React.createElement("button", { className: "user-menu", onClick: openIdentity, style: { background: 'transparent', border: 0, color: 'inherit' } },
                    React.createElement("span", { className: "avatar" }, session.user.displayName.split(' ').map((s) => s[0]).join('').slice(0, 2)),
                    React.createElement("div", null,
                        React.createElement("strong", null, session.user.displayName),
                        React.createElement("small", null, ROLE_LABELS[session.role]))))),
        React.createElement("aside", { className: cx('app-sidebar', menu && 'open') },
            React.createElement("div", { className: "tenant-card" },
                React.createElement("small", null, "Active tenant"),
                React.createElement("strong", null, session.tenant.name)),
            React.createElement("nav", { className: "side-nav" }, nav.map(([path, icon, label]) => React.createElement("button", { key: path, className: route.path.startsWith(path) ? 'active' : '', onClick: () => { hashRoute(path); setMenu(false); } },
                React.createElement("span", { className: "nav-icon" },
                    React.createElement(Icon, { name: icon })),
                label))),
            React.createElement("div", { className: "nav-group-label" }, "Candidate demo"),
            React.createElement("nav", { className: "side-nav" },
                React.createElement("button", { onClick: openIdentity },
                    React.createElement("span", { className: "nav-icon" },
                        React.createElement(Icon, { name: "permissions" })),
                    "Demo identities"),
                React.createElement("button", { onClick: () => hashRoute('/about') },
                    React.createElement("span", { className: "nav-icon" },
                        React.createElement(Icon, { name: "shield" })),
                    "About & boundaries")),
            React.createElement("div", { className: "sidebar-bottom" },
                React.createElement("div", { className: "concept-card" },
                    React.createElement("strong", null, "Independent concept"),
                    "Built from public information and fictional data. No real cloud scan or internal ESET connection."))),
        React.createElement("main", { className: "app-main" },
            React.createElement("div", { className: "content" },
                React.createElement(ConceptBanner, null),
                React.createElement(Router, { route: route, session: session, notify: notify }))),
        identityOpen && React.createElement(LoginModal, { identities: identities, loading: false, onSelect: switchIdentity }));
}
function Router({ route, session, notify }) {
    const props = { session, notify, query: route.query };
    if (route.path === '/overview')
        return React.createElement(OverviewPage, { ...props });
    if (route.path === '/workloads')
        return React.createElement(WorkloadsPage, { ...props });
    if (route.path.startsWith('/workloads/'))
        return React.createElement(WorkloadDetailPage, { ...props, id: route.path.split('/')[2] });
    if (route.path === '/findings')
        return React.createElement(FindingsPage, { ...props });
    if (route.path.startsWith('/findings/'))
        return React.createElement(FindingDetailPage, { ...props, id: route.path.split('/')[2] });
    if (route.path === '/remediation')
        return React.createElement(RemediationPage, { ...props });
    if (route.path === '/enablement')
        return React.createElement(EnablementPage, { ...props });
    if (route.path === '/integrations')
        return React.createElement(IntegrationsPage, { ...props });
    if (route.path === '/permissions')
        return React.createElement(PermissionsPage, { ...props });
    if (route.path === '/analytics')
        return React.createElement(AnalyticsPage, { ...props });
    if (route.path === '/audit')
        return React.createElement(AuditPage, { ...props });
    if (route.path === '/notifications')
        return React.createElement(NotificationsPage, { ...props });
    if (route.path === '/about')
        return React.createElement(AboutPage, null);
    return React.createElement(Empty, { title: "Page not found", message: "Choose a module from the navigation." });
}
function OverviewPage({ session }) {
    const state = useAsync(async () => (await request('/api/overview', {}, session)).data, [session.user.id, session.tenant.id]);
    if (state.loading && !state.data)
        return React.createElement(Loading, { rows: 7 });
    if (state.error)
        return React.createElement(ErrorState, { error: state.error, onRetry: state.reload });
    const d = state.data;
    const metricValues = [60, 62, 61, 66, 64, 69, 73, 72];
    return React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: "Security overview", description: "Protection coverage, critical exposure, remediation performance, and provider health across the fictional multi-cloud estate.", actions: React.createElement(React.Fragment, null,
                React.createElement(Button, { className: "ghost" },
                    React.createElement(Icon, { name: "filter", size: 15 }),
                    " Last 7 days"),
                React.createElement(Button, { className: "primary", onClick: () => hashRoute('/findings?status=OPEN') },
                    React.createElement(Icon, { name: "findings", size: 15 }),
                    " Review findings")) }),
        React.createElement("div", { className: "metric-grid" },
            React.createElement(MetricCard, { label: "Protected workloads", value: d.totals.protected.toLocaleString(), trend: `${d.coverage}% coverage`, color: "#36d59c", values: d.coverageTrend, onClick: () => hashRoute('/workloads?protectionStatus=PROTECTED') }),
            React.createElement(MetricCard, { label: "Unprotected workloads", value: d.totals.unprotected.toLocaleString(), trend: "Needs activation", color: "#ffb45e", values: [420, 395, 380, 362, 350, 334, 320, 312], onClick: () => hashRoute('/workloads?protectionStatus=UNPROTECTED') }),
            React.createElement(MetricCard, { label: "Critical findings", value: d.findings.critical, trend: `${d.findings.overdue} SLA overdue`, color: "#ff5d72", values: [160, 154, 151, 147, 140, 136, 131, 128], onClick: () => hashRoute('/findings?severity=CRITICAL') }),
            React.createElement(MetricCard, { label: "Mean time to remediate", value: `${d.mttrHours}h`, trend: "\u2193 21% in scenario", color: "#a77cff", values: [7.1, 6.6, 6.2, 6.0, 5.5, 5.2, 4.9, 4.7] }),
            React.createElement(MetricCard, { label: "Integration health", value: `${Math.round(d.providers.filter((x) => x.status === 'HEALTHY').length / d.providers.length * 100)}%`, trend: "Across provider scopes", color: "#4d78ff", values: metricValues })),
        React.createElement("div", { className: "dashboard-grid" },
            React.createElement(Panel, null,
                React.createElement(PanelHeader, { title: "Highest-priority findings", subtitle: "Risk score combines severity, exposure, environment, and protection status.", action: React.createElement("button", { className: "panel-link", onClick: () => hashRoute('/findings') }, "View all \u2192") }),
                React.createElement("div", { className: "action-list" }, d.topFindings.map((f) => React.createElement("div", { className: "action-row", key: f.id, onClick: () => hashRoute(`/findings/${f.id}`), onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        hashRoute(`/findings/${f.id}`);
                    } }, role: "link", tabIndex: 0, style: { cursor: 'pointer' } },
                    React.createElement("div", { className: "action-icon" },
                        React.createElement(Icon, { name: "findings", size: 16 })),
                    React.createElement("div", null,
                        React.createElement("strong", null, f.title),
                        React.createElement("small", null,
                            f.id,
                            " \u00B7 ",
                            f.workload)),
                    React.createElement("div", { style: { display: 'flex', gap: 7, alignItems: 'center' } },
                        React.createElement(Badge, { type: "severity", value: f.severity }),
                        React.createElement("span", { className: cx('risk-score', f.risk_score >= 85 ? 'critical' : f.risk_score >= 65 ? 'high' : 'medium') }, f.risk_score)))))),
            React.createElement("div", { style: { display: 'grid', gap: 15 } },
                React.createElement(Panel, null,
                    React.createElement(PanelHeader, { title: "My action queue", subtitle: ROLE_LABELS[session.role] }),
                    React.createElement("div", { className: "action-list" }, d.myActions.length ? d.myActions.map((f) => React.createElement("div", { className: "action-row", key: f.id, onClick: () => hashRoute(`/findings/${f.id}`), onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            hashRoute(`/findings/${f.id}`);
                        } }, role: "link", tabIndex: 0, style: { cursor: 'pointer' } },
                        React.createElement("div", { className: "action-icon" },
                            React.createElement(Icon, { name: "check", size: 16 })),
                        React.createElement("div", null,
                            React.createElement("strong", null, f.title),
                            React.createElement("small", null,
                                f.workload,
                                " \u00B7 due ",
                                date(f.due_at))),
                        React.createElement(Badge, { type: "status", value: f.status }))) : React.createElement(Empty, { title: "No immediate action", message: "The current role has no queued item." }))),
                React.createElement(Panel, null,
                    React.createElement(PanelHeader, { title: "Provider health", subtitle: "Latest normalized projection" }),
                    React.createElement("div", { className: "integration-list" }, d.providers.slice(0, 5).map((c) => React.createElement("div", { className: "integration-card", key: `${c.provider}-${c.object_count}` },
                        React.createElement("span", { className: cx('health-dot', c.status.toLowerCase().replace('_', '-')) }),
                        React.createElement("div", null,
                            React.createElement("strong", null,
                                c.provider,
                                " \u00B7 ",
                                c.object_count.toLocaleString(),
                                " objects"),
                            React.createElement("small", null, c.status)),
                        React.createElement("div", { className: "freshness" },
                            React.createElement("small", null, relative(c.last_successful_sync_at))))))))));
}
function WorkloadsPage({ session, query }) {
    const [filters, setFilters] = useState({ search: query.get('search') || '', provider: query.get('provider') || '', environment: query.get('environment') || '', protectionStatus: query.get('protectionStatus') || '', severity: query.get('severity') || '', riskMin: query.get('riskMin') || '', page: Number(query.get('page') || 1) });
    const queryString = useMemo(() => { const p = new URLSearchParams(); Object.entries(filters).forEach(([k, v]) => v && p.set(k, String(v))); p.set('limit', '25'); p.set('sort', 'risk'); return p.toString(); }, [filters]);
    const state = useAsync(async () => (await request(`/api/workloads?${queryString}`, {}, session)).data, [queryString, session.tenant.id]);
    function update(k, v) { setFilters(s => ({ ...s, [k]: v, page: k === 'page' ? v : 1 })); }
    useEffect(() => { const p = new URLSearchParams(); Object.entries(filters).forEach(([k, v]) => v && p.set(k, String(v))); history.replaceState(null, '', `#/${'workloads'}?${p}`); }, [filters]);
    return React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: "Workload inventory", description: "A normalized, tenant-scoped inventory of fictional Azure, AWS, and GCP compute workloads.", actions: React.createElement(Button, { className: "primary", onClick: () => hashRoute('/enablement') },
                React.createElement(Icon, { name: "plus", size: 15 }),
                " Create enablement plan") }),
        React.createElement("div", { className: "data-toolbar" },
            React.createElement("div", { className: "field grow" },
                React.createElement("label", null, "Search"),
                React.createElement("input", { className: "input", value: filters.search, onChange: (e) => update('search', e.target.value), placeholder: "Workload, external ID, or owner\u2026" })),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Provider"),
                React.createElement("select", { className: "select", value: filters.provider, onChange: (e) => update('provider', e.target.value) },
                    React.createElement("option", { value: "" }, "All providers"),
                    React.createElement("option", null, "AZURE"),
                    React.createElement("option", null, "AWS"),
                    React.createElement("option", null, "GCP"))),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Environment"),
                React.createElement("select", { className: "select", value: filters.environment, onChange: (e) => update('environment', e.target.value) },
                    React.createElement("option", { value: "" }, "All environments"),
                    React.createElement("option", null, "PRODUCTION"),
                    React.createElement("option", null, "STAGING"),
                    React.createElement("option", null, "DEVELOPMENT"),
                    React.createElement("option", null, "SANDBOX"))),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Protection"),
                React.createElement("select", { className: "select", value: filters.protectionStatus, onChange: (e) => update('protectionStatus', e.target.value) },
                    React.createElement("option", { value: "" }, "All states"),
                    React.createElement("option", null, "PROTECTED"),
                    React.createElement("option", null, "UNPROTECTED"),
                    React.createElement("option", null, "PENDING"),
                    React.createElement("option", null, "UNSUPPORTED"))),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Minimum risk"),
                React.createElement("select", { className: "select", value: filters.riskMin, onChange: (e) => update('riskMin', e.target.value) },
                    React.createElement("option", { value: "" }, "Any risk"),
                    React.createElement("option", { value: "50" }, "50+"),
                    React.createElement("option", { value: "70" }, "70+"),
                    React.createElement("option", { value: "85" }, "85+")))),
        state.error ? React.createElement(ErrorState, { error: state.error, onRetry: state.reload }) : React.createElement("div", { className: "table-shell" }, state.loading && !state.data ? React.createElement(Loading, { rows: 10 }) : state.data?.items.length ? React.createElement(React.Fragment, null,
            React.createElement("table", { className: "data-table" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Workload"),
                        React.createElement("th", null, "Provider"),
                        React.createElement("th", null, "Environment"),
                        React.createElement("th", null, "Protection"),
                        React.createElement("th", null, "Findings"),
                        React.createElement("th", null, "Owner"),
                        React.createElement("th", null, "Risk"),
                        React.createElement("th", null, "Last seen"))),
                React.createElement("tbody", null, state.data.items.map((w) => React.createElement("tr", { key: w.id, onClick: () => hashRoute(`/workloads/${w.id}`), style: { cursor: 'pointer' } },
                    React.createElement("td", { className: "primary-cell" },
                        React.createElement("strong", null, w.name),
                        React.createElement("small", null,
                            w.id,
                            " \u00B7 ",
                            w.region)),
                    React.createElement("td", null,
                        React.createElement(Badge, { type: "provider", value: w.provider })),
                    React.createElement("td", null, w.environment),
                    React.createElement("td", null,
                        React.createElement(Badge, { type: "status", value: w.protection_status === 'PROTECTED' ? 'RESOLVED' : w.protection_status === 'UNPROTECTED' ? 'OPEN' : 'TRIAGED' })),
                    React.createElement("td", null,
                        w.finding_count,
                        " \u00B7 ",
                        w.highest_severity),
                    React.createElement("td", null, w.owner_team || 'Unassigned'),
                    React.createElement("td", null,
                        React.createElement("span", { className: cx('risk-score', w.risk_score >= 85 ? 'critical' : w.risk_score >= 65 ? 'high' : 'medium') }, w.risk_score)),
                    React.createElement("td", null, relative(w.last_seen_at)))))),
            React.createElement("div", { className: "pagination" },
                React.createElement("span", null,
                    state.data.total.toLocaleString(),
                    " workloads \u00B7 page ",
                    state.data.page,
                    " of ",
                    state.data.pages),
                React.createElement("div", { className: "pagination-controls" },
                    React.createElement(Button, { className: "small", disabled: filters.page <= 1, onClick: () => update('page', filters.page - 1) }, "Previous"),
                    React.createElement(Button, { className: "small", disabled: filters.page >= state.data.pages, onClick: () => update('page', filters.page + 1) }, "Next")))) : React.createElement(Empty, { title: "No workloads match" })));
}
function WorkloadDetailPage({ session, id }) {
    const state = useAsync(async () => (await request(`/api/workloads/${id}`, {}, session)).data, [id, session.tenant.id]);
    if (state.loading)
        return React.createElement(Loading, { rows: 7 });
    if (state.error)
        return React.createElement(ErrorState, { error: state.error, onRetry: state.reload });
    const w = state.data;
    return React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: w.name, description: `${w.provider} workload · ${w.environment} · ${w.region}`, actions: React.createElement(React.Fragment, null,
                React.createElement(Button, { onClick: () => history.back() }, "\u2190 Back"),
                w.eligibility === 'ELIGIBLE' && w.protection_status === 'UNPROTECTED' && React.createElement(Button, { className: "primary", onClick: () => hashRoute(`/enablement?workload=${w.id}&connection=${w.connection_id}`) }, "Plan protection")) }),
        React.createElement("div", { className: "detail-layout" },
            React.createElement(Panel, null,
                React.createElement("div", { className: "detail-hero" },
                    React.createElement("div", { className: "detail-title" },
                        React.createElement("div", { className: "action-icon" },
                            React.createElement(Icon, { name: "cloud" })),
                        React.createElement("div", null,
                            React.createElement("h1", null, w.name),
                            React.createElement("p", null, w.external_id),
                            React.createElement("div", { className: "detail-meta" },
                                React.createElement(Badge, { type: "provider", value: w.provider }),
                                React.createElement(Badge, { type: "status", value: w.protection_status === 'PROTECTED' ? 'RESOLVED' : w.protection_status === 'UNPROTECTED' ? 'OPEN' : 'TRIAGED' }),
                                React.createElement("span", { className: "status-pill" }, w.environment)))),
                    React.createElement("span", { className: cx('risk-score', w.risk_score >= 85 ? 'critical' : w.risk_score >= 65 ? 'high' : 'medium') }, w.risk_score)),
                React.createElement("div", { className: "definition-grid", style: { marginTop: 20 } },
                    React.createElement("div", { className: "definition" },
                        React.createElement("small", null, "Scope"),
                        React.createElement("strong", null, w.scope_alias)),
                    React.createElement("div", { className: "definition" },
                        React.createElement("small", null, "Operating system"),
                        React.createElement("strong", null,
                            w.os_family,
                            " \u00B7 ",
                            w.os_version)),
                    React.createElement("div", { className: "definition" },
                        React.createElement("small", null, "Owner"),
                        React.createElement("strong", null, w.owner_team || 'Unassigned')),
                    React.createElement("div", { className: "definition" },
                        React.createElement("small", null, "Internet exposure"),
                        React.createElement("strong", null, w.internet_exposure ? 'Detected in fictional context' : 'Not detected')),
                    React.createElement("div", { className: "definition" },
                        React.createElement("small", null, "Eligibility"),
                        React.createElement("strong", null, w.eligibility)),
                    React.createElement("div", { className: "definition" },
                        React.createElement("small", null, "Last provider projection"),
                        React.createElement("strong", null, relative(w.last_seen_at)))),
                React.createElement("div", { className: "panel-header", style: { marginTop: 24 } },
                    React.createElement("h2", null, "Related findings")),
                React.createElement("div", { className: "action-list" }, w.findings.map((f) => React.createElement("div", { className: "action-row", key: f.id, onClick: () => hashRoute(`/findings/${f.id}`), onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        hashRoute(`/findings/${f.id}`);
                    } }, role: "link", tabIndex: 0, style: { cursor: 'pointer' } },
                    React.createElement("div", { className: "action-icon" },
                        React.createElement(Icon, { name: "findings", size: 15 })),
                    React.createElement("div", null,
                        React.createElement("strong", null, f.title),
                        React.createElement("small", null,
                            f.id,
                            " \u00B7 due ",
                            date(f.due_at))),
                    React.createElement("div", { style: { display: 'flex', gap: 7 } },
                        React.createElement(Badge, { type: "severity", value: f.severity }),
                        React.createElement(Badge, { type: "status", value: f.status })))))),
            React.createElement("div", { style: { display: 'grid', gap: 15 } },
                React.createElement(Panel, null,
                    React.createElement(PanelHeader, { title: "Tags" }),
                    React.createElement("div", { className: "detail-meta" }, w.tags.map((t) => React.createElement("span", { className: "status-pill", key: t }, t)))),
                React.createElement(Panel, null,
                    React.createElement(PanelHeader, { title: "Data boundary" }),
                    React.createElement("p", { style: { color: '#8297b7', lineHeight: 1.6 } }, "This asset is generated by a deterministic provider mock. It does not represent a real cloud resource or a real security assessment.")))));
}
function FindingsPage({ session, query }) {
    const [filters, setFilters] = useState({ search: query.get('search') || '', severity: query.get('severity') || '', status: query.get('status') || '', provider: query.get('provider') || '', page: Number(query.get('page') || 1) });
    const qs = useMemo(() => { const p = new URLSearchParams(); Object.entries(filters).forEach(([k, v]) => v && p.set(k, String(v))); p.set('limit', '25'); return p.toString(); }, [filters]);
    const state = useAsync(async () => (await request(`/api/findings?${qs}`, {}, session)).data, [qs, session.tenant.id]);
    function update(k, v) { setFilters(s => ({ ...s, [k]: v, page: k === 'page' ? v : 1 })); }
    useEffect(() => { const p = new URLSearchParams(); Object.entries(filters).forEach(([k, v]) => v && p.set(k, String(v))); history.replaceState(null, '', `#/findings?${p}`); }, [filters]);
    return React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: "Findings explorer", description: "Prioritize fictional exposures using transparent risk context, ownership, SLA, and workflow status." }),
        React.createElement("div", { className: "data-toolbar" },
            React.createElement("div", { className: "field grow" },
                React.createElement("label", null, "Search"),
                React.createElement("input", { className: "input", value: filters.search, onChange: (e) => update('search', e.target.value), placeholder: "Finding, ID, or workload\u2026" })),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Severity"),
                React.createElement("select", { className: "select", value: filters.severity, onChange: (e) => update('severity', e.target.value) },
                    React.createElement("option", { value: "" }, "All severities"),
                    React.createElement("option", null, "CRITICAL"),
                    React.createElement("option", null, "HIGH"),
                    React.createElement("option", null, "MEDIUM"),
                    React.createElement("option", null, "LOW"))),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Status"),
                React.createElement("select", { className: "select", value: filters.status, onChange: (e) => update('status', e.target.value) },
                    React.createElement("option", { value: "" }, "All statuses"),
                    Object.keys(STATUS_LABEL).map(s => React.createElement("option", { key: s }, s)))),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Provider"),
                React.createElement("select", { className: "select", value: filters.provider, onChange: (e) => update('provider', e.target.value) },
                    React.createElement("option", { value: "" }, "All providers"),
                    React.createElement("option", null, "AZURE"),
                    React.createElement("option", null, "AWS"),
                    React.createElement("option", null, "GCP")))),
        state.error ? React.createElement(ErrorState, { error: state.error, onRetry: state.reload }) : React.createElement("div", { className: "table-shell" }, state.loading && !state.data ? React.createElement(Loading, { rows: 10 }) : state.data?.items.length ? React.createElement(React.Fragment, null,
            React.createElement("table", { className: "data-table" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Finding"),
                        React.createElement("th", null, "Severity"),
                        React.createElement("th", null, "Provider"),
                        React.createElement("th", null, "Status"),
                        React.createElement("th", null, "Assignee"),
                        React.createElement("th", null, "SLA"),
                        React.createElement("th", null, "Risk"))),
                React.createElement("tbody", null, state.data.items.map((f) => React.createElement("tr", { key: f.id, onClick: () => hashRoute(`/findings/${f.id}`), style: { cursor: 'pointer' } },
                    React.createElement("td", { className: "primary-cell" },
                        React.createElement("strong", null, f.title),
                        React.createElement("small", null,
                            f.id,
                            " \u00B7 ",
                            f.workload_name)),
                    React.createElement("td", null,
                        React.createElement(Badge, { type: "severity", value: f.severity })),
                    React.createElement("td", null,
                        React.createElement(Badge, { type: "provider", value: f.provider })),
                    React.createElement("td", null,
                        React.createElement(Badge, { type: "status", value: f.status })),
                    React.createElement("td", null, f.assignee_team || 'Unassigned'),
                    React.createElement("td", null, date(f.due_at)),
                    React.createElement("td", null,
                        React.createElement("span", { className: cx('risk-score', f.risk_score >= 85 ? 'critical' : f.risk_score >= 65 ? 'high' : 'medium') }, f.risk_score)))))),
            React.createElement("div", { className: "pagination" },
                React.createElement("span", null,
                    state.data.total.toLocaleString(),
                    " findings \u00B7 page ",
                    state.data.page,
                    " of ",
                    state.data.pages),
                React.createElement("div", { className: "pagination-controls" },
                    React.createElement(Button, { className: "small", disabled: filters.page <= 1, onClick: () => update('page', filters.page - 1) }, "Previous"),
                    React.createElement(Button, { className: "small", disabled: filters.page >= state.data.pages, onClick: () => update('page', filters.page + 1) }, "Next")))) : React.createElement(Empty, { title: "No findings match" })));
}
function FindingDetailPage({ session, id, notify }) {
    const state = useAsync(async () => (await request(`/api/findings/${id}`, {}, session)).data, [id, session.user.id]);
    const [tab, setTab] = useState('overview');
    const [dialog, setDialog] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    if (state.loading && !state.data)
        return React.createElement(Loading, { rows: 8 });
    if (state.error)
        return React.createElement(ErrorState, { error: state.error, onRetry: state.reload });
    const f = state.data;
    async function mutate(action, body) { setSaving(true); try {
        await request(`/api/findings/${f.id}/${action}`, { method: 'POST', body, version: f.version }, session);
        notify({ type: 'success', title: 'Workflow updated', message: `${f.id} was updated successfully.` });
        setDialog(null);
        setForm({});
        state.reload();
    }
    catch (error) {
        notify({ type: 'error', title: error.data?.title || 'Action failed', message: error.message });
    }
    finally {
        setSaving(false);
    } }
    const canAssign = has(session, 'finding:assign') && ['OPEN', 'TRIAGED', 'ASSIGNED'].includes(f.status);
    const canWork = has(session, 'finding:transition') && f.status === 'ASSIGNED' && (session.role !== 'CLOUD_OPERATIONS' || f.assignee_user_id === session.user.id);
    const canReview = has(session, 'finding:verify') && f.status === 'READY_FOR_REVIEW';
    const canResolve = has(session, 'finding:transition') && f.status === 'VERIFIED';
    return React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: f.title, description: `${f.id} · ${f.workload_name} · ${f.provider}`, actions: React.createElement(React.Fragment, null,
                React.createElement(Button, { onClick: () => history.back() }, "\u2190 Back"),
                canAssign && React.createElement(Button, { className: "primary", onClick: () => setDialog('assign') }, "Assign & set SLA"),
                canWork && React.createElement(Button, { className: "primary", onClick: () => mutate('transition', { targetStatus: 'IN_PROGRESS' }) }, "Start remediation"),
                f.status === 'IN_PROGRESS' && has(session, 'evidence:create') && React.createElement(Button, { className: "primary", onClick: () => setDialog('evidence') }, "Add evidence"),
                canReview && React.createElement(Button, { className: "success", onClick: () => setDialog('verify') }, "Verify remediation"),
                canResolve && React.createElement(Button, { className: "success", onClick: () => mutate('transition', { targetStatus: 'RESOLVED' }) }, "Resolve finding")) }),
        React.createElement("div", { className: "detail-layout" },
            React.createElement(Panel, null,
                React.createElement("div", { className: "detail-hero" },
                    React.createElement("div", { className: "detail-title" },
                        React.createElement("div", { className: "action-icon" },
                            React.createElement(Icon, { name: "findings" })),
                        React.createElement("div", null,
                            React.createElement("h1", null, f.title),
                            React.createElement("p", null, f.rule_key),
                            React.createElement("div", { className: "detail-meta" },
                                React.createElement(Badge, { type: "severity", value: f.severity }),
                                React.createElement(Badge, { type: "status", value: f.status }),
                                React.createElement(Badge, { type: "provider", value: f.provider }),
                                React.createElement("span", { className: "status-pill" }, f.environment)))),
                    React.createElement("span", { className: cx('risk-score', f.risk_score >= 85 ? 'critical' : f.risk_score >= 65 ? 'high' : 'medium') }, f.risk_score)),
                React.createElement("div", { className: "tab-bar" }, ['overview', 'remediation', 'evidence', 'verification', 'audit'].map(t => React.createElement("button", { key: t, className: tab === t ? 'active' : '', onClick: () => setTab(t) }, t[0].toUpperCase() + t.slice(1)))),
                tab === 'overview' && React.createElement("div", null,
                    React.createElement("p", { style: { color: '#a7b6cb', lineHeight: 1.7 } }, f.description),
                    React.createElement("div", { className: "definition-grid" },
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "Affected workload"),
                            React.createElement("strong", null, f.workload_name)),
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "Protection status"),
                            React.createElement("strong", null, f.protection_status)),
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "Current configuration"),
                            React.createElement("strong", null, f.internet_exposure ? 'Fictional public exposure detected' : 'Configuration signal detected')),
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "Recommended configuration"),
                            React.createElement("strong", null, "Restrict access and re-check the normalized indicator.")),
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "Owner"),
                            React.createElement("strong", null, f.assignee_team || 'Not assigned')),
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "SLA due"),
                            React.createElement("strong", null, date(f.due_at)))),
                    React.createElement("h3", { style: { marginTop: 24 } }, "Risk score explanation"),
                    React.createElement("div", { className: "risk-explanation" }, f.risk_explanation.map((r, i) => React.createElement("div", { className: "risk-factor", key: i },
                        React.createElement("span", null, r.label),
                        React.createElement("strong", null,
                            "+",
                            r.points))))),
                tab === 'remediation' && React.createElement("div", null, f.task ? React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "definition-grid" },
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "Task state"),
                            React.createElement("strong", null, f.task.state)),
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "Owner team"),
                            React.createElement("strong", null, f.task.owner_team)),
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "Due date"),
                            React.createElement("strong", null, date(f.task.due_at))),
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "Version"),
                            React.createElement("strong", null, f.task.version))),
                    React.createElement("h3", { style: { marginTop: 22 } }, f.task.summary),
                    React.createElement("div", { className: "check-list" }, f.task.checklist.map((c) => React.createElement("div", { className: "check-row", key: c.id },
                        React.createElement("input", { type: "checkbox", checked: c.done, readOnly: true }),
                        React.createElement("span", null, c.label)))),
                    f.status === 'IN_PROGRESS' && React.createElement("div", { style: { marginTop: 16 } },
                        React.createElement(Button, { className: "primary", onClick: () => setDialog('evidence') }, "Add evidence"))) : React.createElement(Empty, { title: "No remediation task", message: "Assign this finding to create a task." })),
                tab === 'evidence' && React.createElement("div", null,
                    f.evidence.length ? f.evidence.map((e) => React.createElement("div", { className: "evidence-card", key: e.id },
                        React.createElement("strong", null,
                            e.type,
                            " \u00B7 ",
                            e.status),
                        React.createElement("p", null, e.structured_note),
                        React.createElement("small", null,
                            "Added by ",
                            e.uploaded_by,
                            " \u00B7 ",
                            relative(e.created_at),
                            " \u00B7 SHA-256 ",
                            String(e.sha256).slice(0, 14),
                            "\u2026"))) : React.createElement(Empty, { title: "No evidence yet" }),
                    f.comments.map((c) => React.createElement("div", { className: "comment", key: c.id },
                        React.createElement("div", { className: "comment-header" },
                            React.createElement("strong", null, c.author_name),
                            React.createElement("span", null, relative(c.created_at))),
                        React.createElement("p", null, c.body)))),
                tab === 'verification' && React.createElement("div", null,
                    f.verification ? React.createElement("div", { className: "evidence-card" },
                        React.createElement("strong", null, f.verification.result),
                        React.createElement("p", null, f.verification.notes),
                        React.createElement("small", null,
                            "Verified by ",
                            f.verification.verifier_name,
                            " \u00B7 ",
                            date(f.verification.verified_at))) : React.createElement(Empty, { title: "Not independently verified", message: "A Security Analyst must review evidence before a critical finding can be resolved." }),
                    React.createElement("div", { className: "permission-callout" }, "Separation of duties: the author of remediation evidence cannot be the sole verifier for a critical finding.")),
                tab === 'audit' && React.createElement("div", { className: "timeline" }, f.audit.map((a) => React.createElement("div", { className: "timeline-item", key: a.id },
                    React.createElement("strong", null, a.action),
                    React.createElement("small", null,
                        a.actor_role || 'System',
                        " \u00B7 ",
                        date(a.created_at),
                        " \u00B7 ",
                        a.correlation_id))))),
            React.createElement("div", { style: { display: 'grid', gap: 15 } },
                React.createElement(Panel, null,
                    React.createElement(PanelHeader, { title: "Workflow state" }),
                    React.createElement("div", { className: "timeline" }, ['OPEN', 'TRIAGED', 'ASSIGNED', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'VERIFIED', 'RESOLVED'].map((s, i, arr) => { const current = arr.indexOf(f.status), done = i <= current && current >= 0; return React.createElement("div", { className: "timeline-item", key: s, style: { opacity: done ? 1 : .4 } },
                        React.createElement("strong", null, STATUS_LABEL[s]),
                        React.createElement("small", null, done ? 'Reached or current' : 'Pending guard rules')); }))),
                React.createElement(Panel, null,
                    React.createElement(PanelHeader, { title: "Available permissions" }),
                    React.createElement("div", { className: "detail-meta" }, session.permissions.filter(p => p.startsWith('finding') || p.startsWith('evidence')).map(p => React.createElement("span", { className: "status-pill", key: p }, p))),
                    session.role === 'CLOUD_OPERATIONS' && React.createElement("div", { className: "permission-callout", style: { marginTop: 12 } }, "Cloud Operations can add evidence, but cannot independently verify critical work.")))),
        dialog && React.createElement(ActionDialog, { kind: dialog, finding: f, form: form, setForm: setForm, saving: saving, onClose: () => setDialog(null), onSubmit: mutate, session: session }));
}
function ActionDialog({ kind, finding, form, setForm, saving, onClose, onSubmit, session }) {
    let title = 'Update finding';
    let body = null;
    let action = kind;
    if (kind === 'assign') {
        title = 'Assign remediation and SLA';
        body = React.createElement(React.Fragment, null,
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Cloud Operations user"),
                React.createElement("select", { className: "select", value: form.assigneeUserId || 'usr-lukas', onChange: (e) => setForm({ ...form, assigneeUserId: e.target.value }) },
                    React.createElement("option", { value: "usr-lukas" }, "Lukas Novak \u00B7 Cloud Operations"))),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Due date"),
                React.createElement("input", { className: "input", type: "datetime-local", value: form.dueAtLocal || '2026-08-02T15:00', onChange: (e) => setForm({ ...form, dueAtLocal: e.target.value }) })),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Task summary"),
                React.createElement("textarea", { className: "textarea", value: form.summary || '', onChange: (e) => setForm({ ...form, summary: e.target.value }), placeholder: "Apply the approved fictional remediation and provide evidence." })));
    }
    if (kind === 'evidence') {
        title = 'Add structured remediation evidence';
        body = React.createElement(React.Fragment, null,
            React.createElement("div", { className: "permission-callout" }, "Demo evidence is a structured note. No real cloud configuration or sensitive file is uploaded."),
            React.createElement("div", { className: "field", style: { marginTop: 14 } },
                React.createElement("label", null, "Evidence note"),
                React.createElement("textarea", { className: "textarea", value: form.note || '', onChange: (e) => setForm({ ...form, note: e.target.value }), placeholder: "Describe the fictional change, affected control, and what the reviewer should verify." })));
    }
    if (kind === 'verify') {
        title = 'Independent verification';
        body = React.createElement(React.Fragment, null,
            React.createElement("div", { className: "permission-callout" }, "The API enforces separation of duties for critical findings."),
            React.createElement("div", { className: "field", style: { marginTop: 14 } },
                React.createElement("label", null, "Verification result"),
                React.createElement("select", { className: "select", value: form.result || 'PASSED', onChange: (e) => setForm({ ...form, result: e.target.value }) },
                    React.createElement("option", null, "PASSED"),
                    React.createElement("option", null, "CHANGES_REQUIRED"))),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Method"),
                React.createElement("select", { className: "select", value: form.method || 'CONTROL_RECHECK', onChange: (e) => setForm({ ...form, method: e.target.value }) },
                    React.createElement("option", null, "CONTROL_RECHECK"),
                    React.createElement("option", null, "CONFIGURATION_REVIEW"),
                    React.createElement("option", null, "EVIDENCE_REVIEW"))),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Verification notes"),
                React.createElement("textarea", { className: "textarea", value: form.notes || '', onChange: (e) => setForm({ ...form, notes: e.target.value }), placeholder: "Explain what was independently reviewed and why the result passed or needs changes." })));
    }
    function submit() { if (kind === 'assign')
        onSubmit(action, { assigneeUserId: form.assigneeUserId || 'usr-lukas', dueAt: new Date(form.dueAtLocal || '2026-08-02T15:00').toISOString(), summary: form.summary });
    else
        onSubmit(action, form); }
    return React.createElement("div", { className: "modal-backdrop" },
        React.createElement("div", { className: "modal", style: { maxWidth: 620 } },
            React.createElement("div", { className: "page-header" },
                React.createElement("div", null,
                    React.createElement("h2", null, title),
                    React.createElement("p", null,
                        finding.id,
                        " \u00B7 ",
                        finding.title)),
                React.createElement("button", { className: "icon-button", onClick: onClose },
                    React.createElement(Icon, { name: "close" }))),
            React.createElement("div", { style: { display: 'grid', gap: 13 } }, body),
            React.createElement("div", { className: "wizard-footer" },
                React.createElement(Button, { onClick: onClose }, "Cancel"),
                React.createElement(Button, { className: "primary", disabled: saving, onClick: submit }, saving ? 'Saving…' : 'Confirm action'))));
}
function RemediationPage({ session }) {
    const state = useAsync(async () => (await request('/api/remediation/tasks', {}, session)).data, [session.user.id]);
    if (state.error)
        return React.createElement(ErrorState, { error: state.error, onRetry: state.reload });
    const items = state.data?.items || [];
    const columns = [['TODO', 'Queued'], ['IN_PROGRESS', 'In progress'], ['REVIEW_REQUESTED', 'Review requested'], ['DONE', 'Completed']];
    return React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: "Remediation board", description: "Assigned work from finding triage through evidence-backed review." }),
        React.createElement("div", { className: "kanban" }, columns.map(([status, label]) => React.createElement("section", { className: "kanban-column", key: status },
            React.createElement("h3", null,
                label,
                React.createElement("span", null, items.filter((x) => x.state === status).length)),
            state.loading ? React.createElement(Loading, { rows: 3 }) : items.filter((x) => x.state === status).slice(0, 20).map((t) => React.createElement("article", { className: "task-card", key: t.id, onClick: () => hashRoute(`/findings/${t.finding_id}`), style: { cursor: 'pointer' } },
                React.createElement(Badge, { type: "severity", value: t.severity }),
                React.createElement("strong", { style: { display: 'block', marginTop: 9 } }, t.title),
                React.createElement("small", null, t.workload_name),
                React.createElement("div", { className: "task-footer" },
                    React.createElement("span", null, date(t.due_at)),
                    React.createElement("span", { className: "assignee-dot" }, t.owner_user_id?.includes('lukas') ? 'LN' : 'CO'))))))));
}
function EnablementPage({ session, query, notify }) {
    const integrations = useAsync(async () => (await request('/api/integrations', {}, session)).data.items, [session.tenant.id]);
    const plans = useAsync(async () => (await request('/api/enablement-plans', {}, session)).data.items, [session.user.id]);
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ provider: 'AZURE', connectionId: query.get('connection') || '', environment: 'PRODUCTION', targets: query.get('workload') ? [query.get('workload')] : ['WLD-AZ-PROD-0007'], exclusions: [], autoEnableNew: true, autoEnableExisting: true });
    const [created, setCreated] = useState(null);
    const [saving, setSaving] = useState(false);
    const steps = ['Provider', 'Scope', 'Permissions', 'Targets', 'Preview', 'Execute'];
    const available = (integrations.data || []).filter((c) => c.provider === form.provider);
    useEffect(() => { if (!form.connectionId && available[0])
        setForm((x) => ({ ...x, connectionId: available[0].id })); }, [form.provider, integrations.data]);
    async function createPlan() { setSaving(true); try {
        const r = await request('/api/enablement-plans', { method: 'POST', body: { connectionId: form.connectionId, scope: { environment: form.environment }, targets: form.targets, exclusions: form.exclusions, autoEnableNew: form.autoEnableNew, autoEnableExisting: form.autoEnableExisting } }, session);
        setCreated(r.data);
        setStep(5);
        notify({ type: 'success', title: 'Enablement plan ready', message: 'The validated fictional plan can now be executed.' });
        plans.reload();
    }
    catch (e) {
        notify({ type: 'error', title: 'Plan validation failed', message: e.message });
    }
    finally {
        setSaving(false);
    } }
    async function execute() { if (!created)
        return; setSaving(true); try {
        const r = await request(`/api/enablement-plans/${created.planId}/execute`, { method: 'POST', body: {}, version: created.version }, session);
        setCreated({ ...created, version: r.data.version, execution: r.data });
        notify({ type: r.data.state === 'SUCCEEDED' ? 'success' : 'info', title: `Execution ${r.data.state.toLowerCase()}`, message: `${r.data.succeeded} succeeded and ${r.data.failed} failed in the provider mock.` });
        plans.reload();
    }
    catch (e) {
        notify({ type: 'error', title: 'Execution failed', message: e.status === 412 ? 'The plan changed in another session. Reload and review it before retrying.' : e.message });
    }
    finally {
        setSaving(false);
    } }
    return React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: "Protection enablement", description: "A recoverable, permission-aware wizard for simulated cloud workload protection activation." }),
        React.createElement("div", { className: "wizard-shell" },
            React.createElement("div", { className: "wizard-progress" }, steps.map((s, i) => React.createElement("div", { key: s, className: cx('wizard-step', i === step && 'active', i < step && 'done') },
                i + 1,
                ". ",
                s))),
            React.createElement(Panel, { className: "wizard-content" },
                step === 0 && React.createElement(React.Fragment, null,
                    React.createElement(PanelHeader, { title: "Choose cloud provider", subtitle: "Provider adapters normalize different fixture shapes." }),
                    React.createElement("div", { className: "choice-grid" }, ['AZURE', 'AWS', 'GCP'].map(p => React.createElement("button", { className: cx('choice-card', form.provider === p && 'selected'), onClick: () => setForm({ ...form, provider: p, connectionId: '' }), key: p },
                        React.createElement("strong", null,
                            PROVIDER_ICON[p],
                            " ",
                            p),
                        React.createElement("small", null,
                            "Use the deterministic ",
                            p,
                            " provider adapter."))))),
                step === 1 && React.createElement(React.Fragment, null,
                    React.createElement(PanelHeader, { title: "Choose scope", subtitle: "No real cloud account is connected." }),
                    React.createElement("div", { className: "field" },
                        React.createElement("label", null, "Connection"),
                        React.createElement("select", { className: "select", value: form.connectionId, onChange: (e) => setForm({ ...form, connectionId: e.target.value }) }, available.map((c) => React.createElement("option", { key: c.id, value: c.id },
                            c.alias,
                            " \u00B7 ",
                            c.status)))),
                    React.createElement("div", { className: "field", style: { marginTop: 12 } },
                        React.createElement("label", null, "Environment"),
                        React.createElement("select", { className: "select", value: form.environment, onChange: (e) => setForm({ ...form, environment: e.target.value }) },
                            React.createElement("option", null, "PRODUCTION"),
                            React.createElement("option", null, "STAGING"),
                            React.createElement("option", null, "DEVELOPMENT")))),
                step === 2 && React.createElement(React.Fragment, null,
                    React.createElement(PanelHeader, { title: "Permission precheck", subtitle: "Explain problems before execution." }),
                    React.createElement("div", { className: "check-list" },
                        React.createElement("div", { className: "check-row" },
                            React.createElement(Icon, { name: "check" }),
                            React.createElement("span", null,
                                "Current role includes ",
                                React.createElement("code", null, "enablement:plan"))),
                        React.createElement("div", { className: "check-row" },
                            React.createElement(Icon, { name: "check" }),
                            React.createElement("span", null,
                                "Current role includes ",
                                React.createElement("code", null, "enablement:execute"))),
                        React.createElement("div", { className: "check-row" },
                            React.createElement("span", { className: cx('health-dot', (available.find((x) => x.id === form.connectionId)?.status || 'OFFLINE').toLowerCase().replace('_', '-')) }),
                            React.createElement("span", null,
                                "Provider connection: ",
                                available.find((x) => x.id === form.connectionId)?.status || 'Unknown'))),
                    React.createElement("div", { className: "permission-callout", style: { marginTop: 15 } }, "The execute endpoint repeats all permission and plan-validity checks. A disabled button is never the security boundary.")),
                step === 3 && React.createElement(React.Fragment, null,
                    React.createElement(PanelHeader, { title: "Select targets and behavior", subtitle: "The candidate demo uses a compact deterministic target set." }),
                    React.createElement("div", { className: "check-list" },
                        React.createElement("label", { className: "check-row" },
                            React.createElement("input", { type: "checkbox", checked: form.targets.includes('WLD-AZ-PROD-0007'), onChange: (e) => setForm({ ...form, targets: e.target.checked ? ['WLD-AZ-PROD-0007'] : [] }) }),
                            React.createElement("span", null,
                                React.createElement("strong", null, "azure-prod-api-07"),
                                React.createElement("small", { style: { display: 'block', color: '#7288a8' } }, "Eligible \u00B7 production \u00B7 unprotected"))),
                        React.createElement("label", { className: "check-row" },
                            React.createElement("input", { type: "checkbox", checked: form.autoEnableNew, onChange: (e) => setForm({ ...form, autoEnableNew: e.target.checked }) }),
                            React.createElement("span", null, "Automatically include future eligible workloads in this fictional scope")),
                        React.createElement("label", { className: "check-row" },
                            React.createElement("input", { type: "checkbox", checked: form.autoEnableExisting, onChange: (e) => setForm({ ...form, autoEnableExisting: e.target.checked }) }),
                            React.createElement("span", null, "Enable protection for selected existing workloads")))),
                step === 4 && React.createElement(React.Fragment, null,
                    React.createElement(PanelHeader, { title: "Review and validate", subtitle: "The backend creates a persisted, idempotent plan." }),
                    React.createElement("div", { className: "definition-grid" },
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "Provider"),
                            React.createElement("strong", null, form.provider)),
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "Connection"),
                            React.createElement("strong", null, available.find((x) => x.id === form.connectionId)?.alias)),
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "Environment"),
                            React.createElement("strong", null, form.environment)),
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "Targets"),
                            React.createElement("strong", null, form.targets.length)),
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "Auto-enable new"),
                            React.createElement("strong", null, form.autoEnableNew ? 'Enabled' : 'Disabled')),
                        React.createElement("div", { className: "definition" },
                            React.createElement("small", null, "Auto-enable existing"),
                            React.createElement("strong", null, form.autoEnableExisting ? 'Enabled' : 'Disabled'))),
                    React.createElement("div", { style: { marginTop: 18 } },
                        React.createElement(Button, { className: "primary", disabled: saving || !form.connectionId || !form.targets.length, onClick: createPlan }, saving ? 'Validating…' : 'Validate and create plan'))),
                step === 5 && React.createElement(React.Fragment, null,
                    React.createElement(PanelHeader, { title: "Execute provider mock operation", subtitle: "Execution is persisted and protected by an idempotency key." }),
                    created ? React.createElement(React.Fragment, null,
                        React.createElement("div", { className: "definition-grid" },
                            React.createElement("div", { className: "definition" },
                                React.createElement("small", null, "Plan ID"),
                                React.createElement("strong", null, created.planId)),
                            React.createElement("div", { className: "definition" },
                                React.createElement("small", null, "Eligible targets"),
                                React.createElement("strong", null, created.preview.eligible)),
                            React.createElement("div", { className: "definition" },
                                React.createElement("small", null, "Estimated duration"),
                                React.createElement("strong", null,
                                    created.preview.estimatedMinutes,
                                    " minutes")),
                            React.createElement("div", { className: "definition" },
                                React.createElement("small", null, "Warnings"),
                                React.createElement("strong", null, created.preview.warnings.length))),
                        created.execution ? React.createElement("div", { style: { marginTop: 20 } },
                            React.createElement("div", { className: "progress-track" },
                                React.createElement("div", { className: "progress-fill", style: { width: '100%' } })),
                            React.createElement("div", { className: "evidence-card", style: { marginTop: 15 } },
                                React.createElement("strong", null, created.execution.state),
                                React.createElement("p", null,
                                    created.execution.succeeded,
                                    " succeeded \u00B7 ",
                                    created.execution.failed,
                                    " failed"),
                                React.createElement("small", null, "This is a deterministic provider-adapter simulation."))) : React.createElement("div", { style: { marginTop: 18 } },
                            React.createElement(Button, { className: "primary", disabled: saving, onClick: execute }, saving ? 'Executing…' : 'Execute simulated enablement'))) : React.createElement(Empty, { title: "No plan created", message: "Return to the preview step and validate a plan." })),
                step < 4 && React.createElement("div", { className: "wizard-footer" },
                    React.createElement(Button, { disabled: step === 0, onClick: () => setStep(Math.max(0, step - 1)) }, "Back"),
                    React.createElement(Button, { className: "primary", disabled: (step === 1 && !form.connectionId) || (step === 3 && !form.targets.length), onClick: () => setStep(Math.min(4, step + 1)) }, "Continue"))),
            React.createElement(Panel, { style: { marginTop: 15 } },
                React.createElement(PanelHeader, { title: "Recent enablement plans" }),
                plans.loading ? React.createElement(Loading, { rows: 3 }) : React.createElement("div", { className: "action-list" }, (plans.data || []).slice(0, 6).map((p) => React.createElement("div", { className: "action-row", key: p.id },
                    React.createElement("div", { className: "action-icon" },
                        React.createElement(Icon, { name: "enablement", size: 15 })),
                    React.createElement("div", null,
                        React.createElement("strong", null,
                            p.provider,
                            " \u00B7 ",
                            p.connection_alias),
                        React.createElement("small", null,
                            p.id,
                            " \u00B7 ",
                            relative(p.updated_at))),
                    React.createElement(Badge, { type: "status", value: p.state === 'SUCCEEDED' ? 'RESOLVED' : p.state === 'PARTIALLY_SUCCEEDED' ? 'DEFERRED' : 'TRIAGED' })))))));
}
function IntegrationsPage({ session, notify }) {
    const state = useAsync(async () => (await request('/api/integrations', {}, session)).data, [session.tenant.id]);
    const [busy, setBusy] = useState(null);
    async function sync(connection) { setBusy(connection.id); try {
        const r = await request(`/api/integrations/${connection.id}/sync`, { method: 'POST', body: {}, version: connection.version }, session);
        notify({ type: r.data.status === 'HEALTHY' ? 'success' : 'info', title: 'Synchronization completed', message: `Provider result: ${r.data.status}.` });
        state.reload();
    }
    catch (e) {
        notify({ type: 'error', title: 'Synchronization failed', message: e.status === 412 ? 'The connection changed. Reload the latest state and retry.' : e.message });
    }
    finally {
        setBusy(null);
    } }
    return React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: "Integration health", description: "Provider connection status, data freshness, circuit state, and safe retry behavior." }),
        state.error ? React.createElement(ErrorState, { error: state.error, onRetry: state.reload }) : React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 14 } }, state.loading ? React.createElement(Loading, { rows: 6 }) : state.data.items.map((c) => React.createElement(Panel, { key: c.id },
            React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start' } },
                React.createElement("div", { style: { display: 'flex', gap: 12 } },
                    React.createElement("span", { className: cx('health-dot', c.status.toLowerCase().replace('_', '-')), style: { marginTop: 5 } }),
                    React.createElement("div", null,
                        React.createElement("h3", { style: { margin: 0 } }, c.alias),
                        React.createElement("p", { style: { color: '#7187a7', margin: '5px 0' } },
                            c.provider,
                            " \u00B7 ",
                            c.external_scope_id))),
                React.createElement(Badge, { type: "provider", value: c.provider })),
            React.createElement("div", { className: "definition-grid", style: { marginTop: 16 } },
                React.createElement("div", { className: "definition" },
                    React.createElement("small", null, "Status"),
                    React.createElement("strong", null, c.status)),
                React.createElement("div", { className: "definition" },
                    React.createElement("small", null, "Freshness"),
                    React.createElement("strong", null, c.freshness_status)),
                React.createElement("div", { className: "definition" },
                    React.createElement("small", null, "Objects"),
                    React.createElement("strong", null, c.object_count.toLocaleString())),
                React.createElement("div", { className: "definition" },
                    React.createElement("small", null, "Last success"),
                    React.createElement("strong", null, relative(c.last_successful_sync_at))),
                React.createElement("div", { className: "definition" },
                    React.createElement("small", null, "Circuit"),
                    React.createElement("strong", null, c.circuit_state)),
                React.createElement("div", { className: "definition" },
                    React.createElement("small", null, "Mode"),
                    React.createElement("strong", null, c.mode))),
            c.error_code && React.createElement("div", { className: "error-state", style: { marginTop: 14 } },
                React.createElement("strong", null, c.error_code),
                React.createElement("span", null, "The fictional adapter exposes this state for recovery UX testing.")),
            React.createElement("div", { style: { marginTop: 15 } },
                React.createElement(Button, { className: "small", disabled: !has(session, 'integration:sync') || busy === c.id, onClick: () => sync(c), title: !has(session, 'integration:sync') ? 'Missing integration:sync permission' : undefined },
                    React.createElement(Icon, { name: "refresh", size: 14 }),
                    " ",
                    busy === c.id ? 'Syncing…' : 'Trigger sync'))))));
}
function PermissionsPage({ session }) {
    const state = useAsync(async () => (await request('/api/permissions/effective', {}, session)).data, [session.user.id]);
    return React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: "Permissions inspector", description: "Explain effective access, tenant scope, and why actions are enabled or denied." }),
        state.loading ? React.createElement(Loading, { rows: 5 }) : state.error ? React.createElement(ErrorState, { error: state.error, onRetry: state.reload }) : React.createElement("div", { className: "detail-layout" },
            React.createElement(Panel, null,
                React.createElement(PanelHeader, { title: `Effective permissions · ${ROLE_LABELS[state.data.role]}`, subtitle: state.data.tenant.name }),
                React.createElement("div", { className: "detail-meta" }, state.data.permissions.map((p) => React.createElement("span", { className: "status-pill", key: p },
                    "\u2713 ",
                    p))),
                React.createElement("div", { className: "permission-callout", style: { marginTop: 18 } }, "The server evaluates authenticated identity, active membership, tenant context, fine-grained permission, object ownership, state guards, separation of duties, optimistic version, and idempotency status.")),
            React.createElement(Panel, null,
                React.createElement(PanelHeader, { title: "Role comparison" }),
                React.createElement("div", { className: "action-list" }, Object.entries(state.data.explanations).map(([role, permissions]) => React.createElement("div", { className: "action-row", key: role },
                    React.createElement("div", { className: "action-icon" },
                        React.createElement(Icon, { name: "permissions", size: 15 })),
                    React.createElement("div", null,
                        React.createElement("strong", null, ROLE_LABELS[role]),
                        React.createElement("small", null,
                            permissions.length,
                            " effective permissions")),
                    React.createElement("span", { className: "status-pill" }, role === state.data.role ? 'Current' : 'Demo')))))));
}
function AnalyticsPage({ session }) {
    const state = useAsync(async () => (await request('/api/analytics/impact', {}, session)).data, [session.tenant.id]);
    const [selected, setSelected] = useState(1);
    const [values, setValues] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    useEffect(() => { if (state.data?.scenarios?.[selected])
        setValues({ ...state.data.scenarios[selected].values }); }, [state.data, selected]);
    const calc = values ? calculateLocal(values) : null;
    if (state.loading)
        return React.createElement(Loading, { rows: 8 });
    if (state.error)
        return React.createElement(ErrorState, { error: state.error, onRetry: state.reload });
    const scenarios = state.data.scenarios;
    const max = Math.max(...scenarios.map((s) => s.calculation.gross));
    async function saveScenario() { const scenario = scenarios[selected]; if (!values || !scenario)
        return; setSaving(true); setSaveMessage(''); try {
        await request(`/api/analytics/impact/scenarios/${scenario.id}`, { method: 'PUT', body: { values }, version: scenario.version }, session);
        setSaveMessage('Scenario assumptions saved and audited.');
        state.reload();
    }
    catch (e) {
        setSaveMessage(e.status === 412 ? 'The scenario changed in another session. Reload before saving.' : e.message);
    }
    finally {
        setSaving(false);
    } }
    return React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: "Business impact & adoption", description: "Transparent, editable scenario modelling. Values are illustrative and do not represent ESET internal data." }),
        React.createElement("div", { className: "concept-banner", style: { borderColor: '#74591f', background: '#2f2510' } },
            React.createElement("span", null, "\u26A0"),
            React.createElement("strong", null, "Financial discipline"),
            React.createElement("span", null, state.data.disclaimer)),
        React.createElement("div", { className: "roi-grid" },
            React.createElement(Panel, null,
                React.createElement(PanelHeader, { title: "Scenario assumptions", action: React.createElement("select", { className: "select", style: { width: 160 }, value: selected, onChange: (e) => setSelected(Number(e.target.value)) }, scenarios.map((s, i) => React.createElement("option", { value: i, key: s.id }, s.name))) }),
                values && React.createElement("div", { className: "assumption-grid" }, Object.entries(values).map(([k, v]) => React.createElement("div", { className: "field", key: k },
                    React.createElement("label", null, humanize(k)),
                    React.createElement("input", { className: "input", type: "number", step: k.includes('Rate') ? '.01' : '1', value: v, disabled: !has(session, 'analytics:assumptions:write'), onChange: (e) => setValues({ ...values, [k]: Number(e.target.value) }) })))),
                " ",
                !has(session, 'analytics:assumptions:write') && React.createElement("div", { className: "permission-callout", style: { marginTop: 15 } }, "Only Security Manager and authorized administrators may edit model assumptions."),
                has(session, 'analytics:assumptions:write') && React.createElement("div", { style: { marginTop: 15, display: 'flex', gap: 12, alignItems: 'center' } },
                    React.createElement(Button, { className: "primary", disabled: saving, onClick: saveScenario }, saving ? 'Saving…' : 'Save audited assumptions'),
                    React.createElement("span", { "aria-live": "polite", style: { color: '#8fa3bf', fontSize: 13 } }, saveMessage))),
            React.createElement("div", { style: { display: 'grid', gap: 15 } },
                React.createElement(Panel, null,
                    React.createElement(PanelHeader, { title: "Modelled annual vendor value", subtitle: "Gross value before annual operating cost" }),
                    React.createElement("div", { className: "bar-chart" }, scenarios.map((s, i) => React.createElement("div", { className: "bar-column", key: s.id },
                        React.createElement("div", { className: "bar", style: { height: `${Math.max(10, s.calculation.gross / max * 200)}px` } }),
                        React.createElement("small", null,
                            s.scenario,
                            React.createElement("br", null),
                            React.createElement("strong", null, money(s.calculation.gross))))))),
                calc && React.createElement(Panel, null,
                    React.createElement(PanelHeader, { title: "Selected scenario result" }),
                    React.createElement("div", { className: "result-grid" },
                        React.createElement("div", { className: "result-card" },
                            React.createElement("small", null, "Support saving"),
                            React.createElement("strong", null, money(calc.supportSaving))),
                        React.createElement("div", { className: "result-card" },
                            React.createElement("small", null, "Onboarding saving"),
                            React.createElement("strong", null, money(calc.onboardingSaving))),
                        React.createElement("div", { className: "result-card" },
                            React.createElement("small", null, "Expansion contribution"),
                            React.createElement("strong", null, money(calc.expansionContribution))),
                        React.createElement("div", { className: "result-card" },
                            React.createElement("small", null, "Retention contribution"),
                            React.createElement("strong", null, money(calc.retentionContribution))),
                        React.createElement("div", { className: "result-card" },
                            React.createElement("small", null, "Gross annual value"),
                            React.createElement("strong", null, money(calc.gross))),
                        React.createElement("div", { className: "result-card" },
                            React.createElement("small", null, "Simple payback"),
                            React.createElement("strong", null, calc.paybackMonths ? `${calc.paybackMonths.toFixed(1)} mo.` : 'n/a')))))));
}
function calculateLocal(v) { const supportSaving = v.activeOrganizations * v.supportContactsPerOrg * v.deflectionRate * v.averageContactHours * v.loadedSupportHourValue; const onboardingSaving = v.onboardingsPerYear * v.savedHoursPerOnboarding * v.technicalHourValue; const expansionContribution = v.qualifiedExpansionEvents * v.contributionPerExpansion; const retentionContribution = v.retainedCustomers * v.annualContributionPerRetainedCustomer; const gross = supportSaving + onboardingSaving + expansionContribution + retentionContribution; const net = gross - v.annualOperatingCost; return { supportSaving, onboardingSaving, expansionContribution, retentionContribution, gross, net, paybackMonths: net > 0 ? v.initialInvestment / (net / 12) : null }; }
function humanize(s) { return s.replace(/([A-Z])/g, ' $1').replace(/^./, x => x.toUpperCase()).replace('Org', 'organization'); }
function AuditPage({ session }) {
    const state = useAsync(async () => (await request('/api/audit?limit=80', {}, session)).data, [session.tenant.id]);
    return React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: "Audit explorer", description: "Append-only evidence of sensitive workflow, permission, integration, and identity events." }),
        state.loading ? React.createElement(Loading, { rows: 9 }) : state.error ? React.createElement(ErrorState, { error: state.error, onRetry: state.reload }) : React.createElement("div", { className: "table-shell", style: { overflow: 'auto' } },
            React.createElement("div", { className: "audit-row header" },
                React.createElement("span", null, "Time"),
                React.createElement("span", null, "Actor"),
                React.createElement("span", null, "Action"),
                React.createElement("span", null, "Entity"),
                React.createElement("span", null, "Correlation ID")),
            state.data.items.map((a) => React.createElement("div", { className: "audit-row", key: a.id },
                React.createElement("span", null,
                    date(a.created_at),
                    React.createElement("br", null),
                    React.createElement("small", null, new Date(a.created_at).toLocaleTimeString())),
                React.createElement("span", null,
                    a.actor_name || 'System',
                    React.createElement("br", null),
                    React.createElement("small", null, a.actor_role)),
                React.createElement("strong", null, a.action),
                React.createElement("span", null,
                    a.entity_type,
                    React.createElement("br", null),
                    React.createElement("code", null, a.entity_id)),
                React.createElement("code", null, a.correlation_id)))));
}
function NotificationsPage({ session }) { const state = useAsync(async () => (await request('/api/notifications', {}, session)).data, [session.user.id]); return React.createElement(React.Fragment, null,
    React.createElement(PageHeader, { title: "Notifications", description: "Role-specific demo events and provider warnings." }),
    state.loading ? React.createElement(Loading, { rows: 6 }) : state.error ? React.createElement(ErrorState, { error: state.error }) : React.createElement(Panel, null,
        React.createElement("div", { className: "action-list" }, state.data.items.map((n) => React.createElement("div", { className: "action-row", key: n.id },
            React.createElement("div", { className: "action-icon" },
                React.createElement(Icon, { name: "bell", size: 15 })),
            React.createElement("div", null,
                React.createElement("strong", null, n.title),
                React.createElement("small", null,
                    n.body,
                    " \u00B7 ",
                    relative(n.created_at))),
            React.createElement("span", { className: cx('status-pill', n.severity === 'CRITICAL' ? 'status-open' : n.severity === 'WARNING' ? 'status-deferred' : 'status-assigned') }, n.severity)))))); }
function AboutPage() { return React.createElement(React.Fragment, null,
    React.createElement(PageHeader, { title: "About this candidate concept", description: "Product boundaries, technical purpose, and an honest statement of implementation scope." }),
    React.createElement("div", { className: "detail-layout" },
        React.createElement(Panel, null,
            React.createElement(PanelHeader, { title: "What this project demonstrates" }),
            React.createElement("p", { style: { lineHeight: 1.7, color: '#a7b6cb' } }, "CSER Workspace is an independently branded cloud-security operations console designed to demonstrate React, TypeScript, data-heavy enterprise UX, API workflow, tenant-scoped authorization, audit, remediation state machines, provider-adapter error states, and transparent product-value modelling."),
            React.createElement("div", { className: "definition-grid" },
                React.createElement("div", { className: "definition" },
                    React.createElement("small", null, "Workflow"),
                    React.createElement("strong", null, "Discover \u2192 Prioritize \u2192 Assign \u2192 Remediate \u2192 Verify \u2192 Learn")),
                React.createElement("div", { className: "definition" },
                    React.createElement("small", null, "Data"),
                    React.createElement("strong", null, "Deterministic and fictional")),
                React.createElement("div", { className: "definition" },
                    React.createElement("small", null, "Cloud providers"),
                    React.createElement("strong", null, "Azure, AWS, GCP mock adapters")),
                React.createElement("div", { className: "definition" },
                    React.createElement("small", null, "Affiliation"),
                    React.createElement("strong", null, "No official ESET affiliation")))),
        React.createElement(Panel, null,
            React.createElement(PanelHeader, { title: "Explicit non-goals" }),
            React.createElement("div", { className: "check-list" },
                React.createElement("div", { className: "check-row" }, "\u00D7 No real cloud scanning"),
                React.createElement("div", { className: "check-row" }, "\u00D7 No internal ESET API"),
                React.createElement("div", { className: "check-row" }, "\u00D7 No malware engine"),
                React.createElement("div", { className: "check-row" }, "\u00D7 No guaranteed security or financial result"),
                React.createElement("div", { className: "check-row" }, "\u00D7 No copied ESET product UI"))))); }
function App() {
    const [session, setSession] = useState(null);
    const [identities, setIdentities] = useState([]);
    const [checking, setChecking] = useState(true);
    const [loginBusy, setLoginBusy] = useState(false);
    const [toasts, setToasts] = useState([]);
    const notify = (input) => { const toast = { id: newId('toast'), type: input.type || 'info', title: input.title, message: input.message }; setToasts(x => [...x, toast]); setTimeout(() => setToasts(x => x.filter(t => t.id !== toast.id)), 5000); };
    useEffect(() => { Promise.all([request('/api/me').catch(() => null), request('/api/demo/identities')]).then(([me, ids]) => { if (me)
        setSession(me.data); setIdentities(ids.data.identities); }).finally(() => setChecking(false)); }, []);
    async function selectIdentity(x) { setLoginBusy(true); try {
        await request('/api/demo/switch-identity', { method: 'POST', body: x });
        const me = await request('/api/me');
        setSession(me.data);
        if (!location.hash)
            hashRoute('/overview');
    }
    catch (e) {
        notify({ type: 'error', title: 'Sign-in failed', message: e.message });
    }
    finally {
        setLoginBusy(false);
    } }
    if (checking)
        return React.createElement("div", { className: "boot-screen" },
            React.createElement("span", { className: "brand-mark" },
                React.createElement("span", null)),
            React.createElement("strong", null, "Loading CSER Workspace\u2026"),
            React.createElement("small", null, "Preparing fictional cloud-security data."));
    return React.createElement(React.Fragment, null,
        session ? React.createElement(Shell, { session: session, setSession: setSession, notify: notify }) : React.createElement(LoginModal, { identities: identities, onSelect: selectIdentity, loading: loginBusy }),
        React.createElement("div", { className: "toast-region", "aria-live": "polite" }, toasts.map(t => React.createElement("div", { className: cx('toast', t.type), key: t.id },
            React.createElement("strong", null, t.title),
            React.createElement("small", null, t.message)))));
}
const rootNode = document.getElementById('root');
const client = window.ReactDOMClient || window.ReactDOM;
if (!client || !rootNode) {
    throw new Error('React runtime could not be initialized.');
}
const root = client.createRoot ? client.createRoot(rootNode) : null;
if (root)
    root.render(React.createElement(App, null));
else
    client.render(React.createElement(App, null), rootNode);
//# sourceMappingURL=app.js.map