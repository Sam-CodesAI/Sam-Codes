/**
 * Phase 2 Functional Verification Test
 * Tests the entire lifecycle: Auth, Profile Edit, Project Creation/Preview/Publish,
 * Public Visibility, Contact Form Submission & Lead Ingestion, Real Analytics Collection.
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const ADMIN_EMAIL = "samarthknimangre@gmail.com";
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "sc_master_9f83a21bc9e47d12f60a5e840d21e899b1a0e8f731a5c6";

let sessionCookie = "";

async function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${msg}`);
}

async function runTests() {
  console.log(`\n========================================`);
  console.log(`🚀 RUNNING PHASE 2 END-TO-END VERIFICATION`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`========================================\n`);

  // 1. Authenticate
  console.log(`[Step 1] Authenticating as Super Admin...`);
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_SECRET }),
  });
  await assert(loginRes.status === 200, `Login status 200 (got ${loginRes.status})`);
  const rawCookies = loginRes.headers.get("set-cookie") || "";
  const match = rawCookies.match(/sam_codes_cmd_session=([^;]+)/);
  await assert(!!match, "Session token cookie present in response");
  sessionCookie = match ? match[1] : "";

  const authHeaders = {
    Cookie: `sam_codes_cmd_session=${sessionCookie}`,
    "Content-Type": "application/json",
  };

  // 2. Test Editing Profile
  console.log(`\n[Step 2] Testing Profile Edit...`);
  const profileUpdateRes = await fetch(`${BASE_URL}/api/admin/profile`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      availabilityStatus: "Available for Q1 custom builds & automation pipelines",
      heroHeadline: "Building intelligent digital systems with craftsmanship and velocity.",
    }),
  });
  await assert(profileUpdateRes.status === 200, `Profile update returns 200`);
  const profileData = await profileUpdateRes.json();
  await assert(
    profileData.profile?.availabilityStatus === "Available for Q1 custom builds & automation pipelines",
    `Profile availabilityStatus successfully updated`
  );

  // 3. Create a Project (DRAFT)
  console.log(`\n[Step 3] Creating a new project (Draft)...`);
  const testProjectSlug = `automated-lead-qualifier-${Date.now()}`;
  const createProjectRes = await fetch(`${BASE_URL}/api/admin/projects`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      title: "Automated Lead Qualifier & WhatsApp Sync",
      slug: testProjectSlug,
      category: "Workflow Automation",
      status: "DRAFT",
      featured: true,
      shortDescription: "Instant lead qualification and routing via WhatsApp Webhooks to Airtable.",
      fullDescription: "Architected a zero-latency webhook bridge syncing incoming WhatsApp chats into structured CRM leads.",
      problem: "Slow response times lost 35% of inbound qualified leads before human follow-up.",
      approach: "Automated webhook streaming with deterministic intent extraction and instant Telegram alert dispatch.",
      technologies: ["Next.js 16", "TypeScript", "Tailwind CSS", "Webhooks", "PostgreSQL"],
      tools: ["Supabase", "Vercel", "Airtable API"],
      result: "Reduced average first-response latency from 4 hours to sub-15 seconds.",
      lessons: "Edge-based parsing eliminates server spin-up latency during traffic surges.",
      metrics: [
        { label: "Response Latency", value: "< 15s", description: "First-touch automated intake" },
        { label: "Lead Capture Rate", value: "+42%", description: "Verified conversion lift" },
      ],
    }),
  });
  await assert(createProjectRes.status === 200, `Project creation returns 200`);
  const createdProjectJson = await createProjectRes.json();
  const projectId = createdProjectJson.project?.id;
  await assert(!!projectId, `Project created with ID: ${projectId}`);

  // 4. Preview Draft Project via Admin API
  console.log(`\n[Step 4] Previewing draft project...`);
  const previewRes = await fetch(`${BASE_URL}/api/admin/projects?id=${projectId}`, {
    headers: authHeaders,
  });
  await assert(previewRes.status === 200, `Admin preview returns 200`);
  const previewJson = await previewRes.json();
  await assert(previewJson.project?.status === "DRAFT", `Verified project is in DRAFT state`);

  // 5. Verify it DOES NOT appear publicly yet while in DRAFT
  console.log(`\n[Step 5] Verifying DRAFT is NOT visible publicly...`);
  const publicPageDraftCheck = await fetch(`${BASE_URL}/`);
  const publicHtmlDraft = await publicPageDraftCheck.text();
  await assert(
    !publicHtmlDraft.includes(testProjectSlug),
    `Draft project slug does not leak into public page`
  );

  // 6. Publish the Project
  console.log(`\n[Step 6] Publishing project to PUBLISHED status...`);
  const publishRes = await fetch(`${BASE_URL}/api/admin/projects`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      ...createdProjectJson.project,
      status: "PUBLISHED",
    }),
  });
  await assert(publishRes.status === 200, `Project publish returns 200`);

  // 7. Verify it appears PUBLICLY
  console.log(`\n[Step 7] Verifying project appears publicly on homepage...`);
  const publicPageRes = await fetch(`${BASE_URL}/`);
  const publicHtml = await publicPageRes.text();
  await assert(
    publicHtml.includes("Automated Lead Qualifier") || publicHtml.includes(testProjectSlug),
    `Published project is visible in public portfolio HTML`
  );

  // 8. Submit Public Contact Form
  console.log(`\n[Step 8] Submitting public contact inquiry...`);
  const contactRes = await fetch(`${BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Priya Sharma",
      email: "priya@synthetix.in",
      service: "Workflow & Business Automation",
      message: "We need an automated multi-agent lead intake workflow for our team. Looking to deploy this week.",
      website_trap: "", // Honeypot must be empty
    }),
  });
  await assert(contactRes.status === 200, `Contact form returns 200 OK`);
  const contactJson = await contactRes.json();
  await assert(contactJson.success === true, `Contact submission marked as success`);

  // 9. Verify Inquiry Appears in Admin Portal
  console.log(`\n[Step 9] Verifying inquiry in Admin Command Center...`);
  const inquiriesRes = await fetch(`${BASE_URL}/api/admin/inquiries`, {
    headers: authHeaders,
  });
  await assert(inquiriesRes.status === 200, `Inquiries API returns 200`);
  const inquiriesJson = await inquiriesRes.json();
  const foundInquiry = inquiriesJson.inquiries?.find((inq: any) => inq.name === "Priya Sharma");
  await assert(!!foundInquiry, `Verified inquiry from Priya Sharma found in admin pipeline`);

  // 10. Generate Real Analytics Events
  console.log(`\n[Step 10] Generating real analytics telemetry events...`);
  const sessionId = `test-sess-${Date.now()}`;
  const events = [
    { eventName: "page_view", path: "/", sessionId, deviceType: "desktop" },
    { eventName: "section_view", path: "/", section: "the-lab", sessionId, deviceType: "desktop" },
    { eventName: "cta_click", path: "/", section: "hero", sessionId, deviceType: "desktop" },
  ];

  for (const evt of events) {
    const evtRes = await fetch(`${BASE_URL}/api/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evt),
    });
    await assert(evtRes.status === 200, `Event '${evt.eventName}' logged successfully`);
  }

  // 11. Verify Analytics Summary in Admin
  console.log(`\n[Step 11] Verifying Analytics Summary in Admin...`);
  const analyticsRes = await fetch(`${BASE_URL}/api/admin/analytics?range=7`, {
    headers: authHeaders,
  });
  await assert(analyticsRes.status === 200, `Analytics API returns 200`);
  const analyticsJson = await analyticsRes.json();
  await assert(analyticsJson.summary?.totalPageViews >= 1, `Analytics shows at least 1 verified page view`);

  console.log(`\n========================================`);
  console.log(`🎉 ALL 11 VERIFICATION CHECKS PASSED!`);
  console.log(`Phase 2 End-to-End lifecycle is 100% functional.`);
  console.log(`========================================\n`);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
