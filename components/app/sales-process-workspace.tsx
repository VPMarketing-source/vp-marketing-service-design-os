"use client";

import { useMemo, useState } from "react";

import { DashboardHeader } from "@/components/app/dashboard-header";
import { DashboardPanel } from "@/components/app/dashboard-panel";
import { DashboardSidebar, type DashboardSidebarGroup } from "@/components/app/dashboard-sidebar";

type ContentSection = {
  id: string;
  title: string;
  description: string;
};

type DeliverableTask = {
  id: string;
  title: string;
  role: string;
};

type DeliverableItem = {
  id: string;
  title: string;
  tasks: DeliverableTask[];
};

type DeliverableSection = {
  id: string;
  title: string;
  deliverables: DeliverableItem[];
};

type MenuItem = {
  id: string;
  label: string;
  subtitle?: string;
  purpose: string;
  sections: ContentSection[];
  deliverableSections?: DeliverableSection[];
  hideProcessOverview?: boolean;
};

type MenuGroup = {
  id: string;
  label: string;
  tone: "orange" | "blue";
  processItems: MenuItem[];
  serviceItems: MenuItem[];
};

function buildTasks(deliverableId: string, tasks: Array<[string, string]>) {
  return tasks.map(([title, role], index) => ({
    id: `${deliverableId}-${index}`,
    title,
    role
  }));
}

const diagnosticCallSections: ContentSection[] = [
  { id: "pre-call", title: "Pre-Call", description: "Review the business before the call." },
  { id: "on-the-call", title: "On the Call", description: "Understand their goals and problems." },
  { id: "follow-up", title: "Follow-Up", description: "Summarize and move it forward." }
];

const growthAuditSections: ContentSection[] = [
  { id: "setup", title: "Setup", description: "Gather access and review the business." },
  { id: "audit", title: "Audit", description: "Analyze acquisition, conversion, and retention to find issues and opportunities." },
  { id: "roadmap", title: "Roadmap", description: "Prioritize what to fix and outline next steps." },
  { id: "delivery", title: "Delivery", description: "Present findings and align on execution." }
];

const onboardingSections: ContentSection[] = [
  { id: "onboarding", title: "Onboarding", description: "Gather access, align on goals, and prepare systems." }
];

const setupImplementationSections: ContentSection[] = [
  { id: "setup-implementation", title: "Setup & Implementation", description: "Fix tracking, structure accounts, and establish baseline performance." }
];

const foundationDeliverableSections: DeliverableSection[] = [
  {
    id: "acquisition",
    title: "Acquisition",
    deliverables: [
      {
        id: "platform-management",
        title: "Platform Management (Meta or Google)",
        tasks: buildTasks("platform-management", [
          ["Review account daily", "Media Buyer"],
          ["Monitor spend and performance", "Media Buyer"],
          ["Adjust budgets", "Media Buyer"],
          ["Pause weak ads", "Media Buyer"],
          ["Scale stable winners", "Media Buyer"]
        ])
      },
      {
        id: "retargeting",
        title: "Retargeting (1 platform)",
        tasks: buildTasks("retargeting", [
          ["Build retargeting audiences", "Media Buyer"],
          ["Launch retargeting campaigns", "Media Buyer"],
          ["Refresh creatives regularly", "Creative Strategist"],
          ["Optimize exclusions and frequency", "Media Buyer"]
        ])
      },
      {
        id: "campaign-optimization",
        title: "Campaign Optimization",
        tasks: buildTasks("campaign-optimization", [
          ["Review campaign performance weekly", "Media Buyer"],
          ["Improve targeting", "Media Buyer"],
          ["Adjust budget allocation", "Media Buyer"],
          ["Reduce wasted spend", "Media Buyer"]
        ])
      },
      {
        id: "creative-production",
        title: "Creative Production (8-12/mo)",
        tasks: buildTasks("creative-production", [
          ["Plan monthly creative needs", "Creative Strategist"],
          ["Brief new concepts", "Creative Strategist"],
          ["Collect assets", "Creative Strategist"],
          ["Upload new creatives weekly", "Media Buyer"],
          ["Rotate out fatigued ads", "Media Buyer"]
        ])
      },
      {
        id: "testing-framework",
        title: "Testing Framework",
        tasks: buildTasks("testing-framework", [
          ["Set a testing calendar", "Creative Strategist"],
          ["Launch structured tests", "Media Buyer"],
          ["Review results", "Media Buyer"],
          ["Carry learnings into the next round", "Creative Strategist"]
        ])
      }
    ]
  },
  {
    id: "conversion",
    title: "Conversion",
    deliverables: [
      {
        id: "funnel-optimization",
        title: "Funnel Optimization",
        tasks: buildTasks("funnel-optimization", [
          ["Review funnel performance", "CRO Specialist"],
          ["Identify weak stages", "CRO Specialist"],
          ["Improve key pages", "CRO Specialist"],
          ["Fix friction points", "CRO Specialist"]
        ])
      },
      {
        id: "landing-page-optimization",
        title: "Landing Page Optimization",
        tasks: buildTasks("landing-page-optimization", [
          ["Audit landing pages", "CRO Specialist"],
          ["Improve copy, layout, and CTA", "CRO Specialist"],
          ["Test updates", "CRO Specialist"],
          ["Monitor lift in conversion rate", "CRO Specialist"]
        ])
      },
      {
        id: "conversion-improvements",
        title: "Conversion Improvements (targeted)",
        tasks: buildTasks("conversion-improvements", [
          ["Identify highest-impact issues", "CRO Specialist"],
          ["Implement quick CRO fixes", "CRO Specialist"],
          ["Measure performance before and after", "CRO Specialist"]
        ])
      }
    ]
  },
  {
    id: "retention",
    title: "Retention",
    deliverables: [
      {
        id: "lifecycle-setup",
        title: "Lifecycle Setup (welcome, abandon cart)",
        tasks: buildTasks("lifecycle-setup", [
          ["Set up core lifecycle flows", "Email/SMS Specialist"],
          ["Write core messages", "Email/SMS Specialist"],
          ["Connect triggers", "Email/SMS Specialist"],
          ["Test sends", "Email/SMS Specialist"],
          ["Confirm flows are working", "Email/SMS Specialist"]
        ])
      },
      {
        id: "basic-automation",
        title: "Basic Automation",
        tasks: buildTasks("basic-automation", [
          ["Build essential automations", "Email/SMS Specialist"],
          ["Confirm logic and timing", "Email/SMS Specialist"],
          ["Monitor early performance", "Email/SMS Specialist"]
        ])
      }
    ]
  },
  {
    id: "tracking-optimization",
    title: "Tracking & Optimization",
    deliverables: [
      {
        id: "tracking-review",
        title: "Tracking Review",
        tasks: buildTasks("tracking-review", [
          ["Audit pixels and events", "Media Buyer"],
          ["Confirm attribution setup", "Media Buyer"],
          ["Test conversion tracking", "Media Buyer"],
          ["Fix reporting issues", "Media Buyer"]
        ])
      },
      {
        id: "performance-baseline",
        title: "Performance Baseline",
        tasks: buildTasks("performance-baseline", [
          ["Establish baseline KPIs", "Account Manager"],
          ["Document current benchmarks", "Account Manager"],
          ["Set reference point for future improvements", "Account Manager"]
        ])
      }
    ]
  },
  {
    id: "support-communication",
    title: "Support & Communication",
    deliverables: [
      {
        id: "email-support",
        title: "Email Support",
        tasks: buildTasks("email-support", [
          ["Respond to client questions", "Account Manager"],
          ["Give status updates", "Account Manager"],
          ["Flag anything requiring action or approval", "Account Manager"]
        ])
      },
      {
        id: "monthly-strategy-call",
        title: "Monthly Strategy Call",
        tasks: buildTasks("monthly-strategy-call", [
          ["Prepare monthly summary", "Account Manager"],
          ["Review wins and issues", "Account Manager"],
          ["Align on priorities", "Account Manager"],
          ["Confirm next actions", "Account Manager"]
        ])
      }
    ]
  }
];
const growthDeliverableSections: DeliverableSection[] = [
  {
    id: "acquisition",
    title: "Acquisition",
    deliverables: [
      {
        id: "platform-management",
        title: "Platform Management (Meta + Google)",
        tasks: buildTasks("platform-management", [
          ["Manage both channels together", "Media Buyer"],
          ["Compare performance by platform", "Media Buyer"],
          ["Reallocate budget toward strongest opportunities", "Media Buyer"]
        ])
      },
      {
        id: "retargeting",
        title: "Retargeting (multi-platform)",
        tasks: buildTasks("retargeting", [
          ["Run retargeting across platforms", "Media Buyer"],
          ["Segment audiences", "Media Buyer"],
          ["Refresh messaging", "Creative Strategist"],
          ["Optimize sequencing and exclusions", "Media Buyer"]
        ])
      },
      {
        id: "campaign-optimization-scaling",
        title: "Campaign Optimization & Scaling",
        tasks: buildTasks("campaign-optimization-scaling", [
          ["Review campaign performance weekly", "Media Buyer"],
          ["Increase budget into winners", "Media Buyer"],
          ["Improve structure", "Media Buyer"],
          ["Scale proven campaigns", "Media Buyer"]
        ])
      },
      {
        id: "creative-production",
        title: "Creative Production (12-24/mo)",
        tasks: buildTasks("creative-production", [
          ["Run a larger creative calendar", "Creative Strategist"],
          ["Request more variations", "Creative Strategist"],
          ["Upload new ads consistently", "Media Buyer"],
          ["Replace fatigue faster", "Media Buyer"]
        ])
      },
      {
        id: "testing-framework",
        title: "Testing Framework (structured roadmap)",
        tasks: buildTasks("testing-framework", [
          ["Define monthly test priorities", "Creative Strategist"],
          ["Run tests by hypothesis", "Media Buyer"],
          ["Review outcomes", "Media Buyer"],
          ["Update roadmap based on results", "Creative Strategist"]
        ])
      }
    ]
  },
  {
    id: "conversion",
    title: "Conversion",
    deliverables: [
      {
        id: "funnel-optimization",
        title: "Funnel Optimization (ongoing CRO)",
        tasks: buildTasks("funnel-optimization", [
          ["Monitor funnel performance continuously", "CRO Specialist"],
          ["Identify drop-offs", "CRO Specialist"],
          ["Make ongoing optimizations", "CRO Specialist"]
        ])
      },
      {
        id: "landing-page-optimization",
        title: "Landing Page Optimization (testing)",
        tasks: buildTasks("landing-page-optimization", [
          ["Run landing page tests regularly", "CRO Specialist"],
          ["Compare variants", "CRO Specialist"],
          ["Iterate based on performance data", "CRO Specialist"]
        ])
      },
      {
        id: "conversion-improvements",
        title: "Conversion Improvements (continuous)",
        tasks: buildTasks("conversion-improvements", [
          ["Maintain a CRO backlog", "CRO Specialist"],
          ["Ship improvements consistently", "CRO Specialist"],
          ["Measure impact across conversion points", "CRO Specialist"]
        ])
      },
      {
        id: "aov-optimization",
        title: "AOV Optimization",
        tasks: buildTasks("aov-optimization", [
          ["Identify upsell, bundling, and offer opportunities", "CRO Specialist"],
          ["Test changes", "CRO Specialist"],
          ["Improve average order value", "CRO Specialist"]
        ])
      }
    ]
  },
  {
    id: "retention",
    title: "Retention",
    deliverables: [
      {
        id: "lifecycle-optimization",
        title: "Lifecycle Optimization (email/SMS)",
        tasks: buildTasks("lifecycle-optimization", [
          ["Review flow performance monthly", "Email/SMS Specialist"],
          ["Improve messaging", "Email/SMS Specialist"],
          ["Optimize timing", "Email/SMS Specialist"],
          ["Increase lifecycle revenue", "Email/SMS Specialist"]
        ])
      },
      {
        id: "flow-expansion",
        title: "Flow Expansion",
        tasks: buildTasks("flow-expansion", [
          ["Add new flows where gaps exist", "Email/SMS Specialist"],
          ["Launch them", "Email/SMS Specialist"],
          ["Optimize based on performance", "Email/SMS Specialist"]
        ])
      },
      {
        id: "campaign-optimization",
        title: "Campaign Optimization (email/SMS)",
        tasks: buildTasks("campaign-optimization", [
          ["Improve campaign calendar", "Email/SMS Specialist"],
          ["Improve offers and segmentation", "Email/SMS Specialist"],
          ["Improve send strategy", "Email/SMS Specialist"]
        ])
      }
    ]
  },
  {
    id: "tracking-optimization",
    title: "Tracking & Optimization",
    deliverables: [
      {
        id: "tracking-optimization",
        title: "Tracking Optimization (ongoing)",
        tasks: buildTasks("tracking-optimization", [
          ["Check data quality regularly", "Media Buyer"],
          ["Fix event gaps", "Media Buyer"],
          ["Refine attribution visibility", "Media Buyer"]
        ])
      },
      {
        id: "attribution-improvements",
        title: "Attribution Improvements",
        tasks: buildTasks("attribution-improvements", [
          ["Improve how results are measured across touchpoints", "Account Manager"],
          ["Make reporting clearer for decision-making", "Account Manager"]
        ])
      },
      {
        id: "performance-monitoring",
        title: "Performance Monitoring",
        tasks: buildTasks("performance-monitoring", [
          ["Track key metrics weekly", "Media Buyer"],
          ["Flag anomalies early", "Media Buyer"],
          ["Surface issues before they grow", "Media Buyer"]
        ])
      }
    ]
  },
  {
    id: "support-communication",
    title: "Support & Communication",
    deliverables: [
      {
        id: "priority-support",
        title: "Priority Support (Email + Slack/WhatsApp)",
        tasks: buildTasks("priority-support", [
          ["Provide faster communication", "Account Manager"],
          ["Handle questions quickly", "Account Manager"],
          ["Keep execution moving without delay", "Account Manager"]
        ])
      },
      {
        id: "bi-weekly-strategy-calls",
        title: "Bi-weekly Strategy Calls",
        tasks: buildTasks("bi-weekly-strategy-calls", [
          ["Prepare bi-weekly summaries", "Account Manager"],
          ["Discuss performance", "Account Manager"],
          ["Align on priorities", "Account Manager"],
          ["Confirm next actions", "Account Manager"]
        ])
      }
    ]
  },
  {
    id: "strategy-growth",
    title: "Strategy & Growth",
    deliverables: [
      {
        id: "growth-strategy-direction",
        title: "Growth Strategy & Direction",
        tasks: buildTasks("growth-strategy-direction", [
          ["Set growth priorities", "Account Manager"],
          ["Guide channel decisions", "Account Manager"],
          ["Keep execution aligned with business goals", "Account Manager"]
        ])
      },
      {
        id: "creative-strategy-roadmap",
        title: "Creative Strategy & Testing Roadmap",
        tasks: buildTasks("creative-strategy-roadmap", [
          ["Define creative angles to test", "Creative Strategist"],
          ["Prioritize ideas", "Creative Strategist"],
          ["Turn results into the next testing plan", "Creative Strategist"]
        ])
      },
      {
        id: "offer-messaging-optimization",
        title: "Offer & Messaging Optimization",
        tasks: buildTasks("offer-messaging-optimization", [
          ["Review offer positioning", "Creative Strategist"],
          ["Improve messaging", "Creative Strategist"],
          ["Test new angles", "Creative Strategist"],
          ["Refine what resonates", "Creative Strategist"]
        ])
      }
    ]
  }
];
const scaleDeliverableSections: DeliverableSection[] = [
  {
    id: "acquisition",
    title: "Acquisition",
    deliverables: [
      {
        id: "platform-management",
        title: "Platform Management (Meta, Google, TikTok)",
        tasks: buildTasks("platform-management", [
          ["Manage all core paid platforms", "Media Buyer"],
          ["Compare channel efficiency", "Media Buyer"],
          ["Balance budget across strongest opportunities", "Media Buyer"]
        ])
      },
      {
        id: "retargeting",
        title: "Retargeting (advanced segmentation)",
        tasks: buildTasks("retargeting", [
          ["Create advanced audience segments", "Media Buyer"],
          ["Personalize messaging", "Creative Strategist"],
          ["Optimize retargeting by intent and behavior", "Media Buyer"]
        ])
      },
      {
        id: "campaign-optimization-scaling",
        title: "Advanced Campaign Optimization & Scaling",
        tasks: buildTasks("campaign-optimization-scaling", [
          ["Refine structure deeply", "Media Buyer"],
          ["Scale aggressively", "Media Buyer"],
          ["Control efficiency", "Media Buyer"],
          ["Expand spend while protecting profitability", "Media Buyer"]
        ])
      },
      {
        id: "creative-production",
        title: "Creative Production (24-40+/mo)",
        tasks: buildTasks("creative-production", [
          ["Operate a high-volume creative pipeline", "Creative Strategist"],
          ["Source more concepts", "Creative Strategist"],
          ["Launch fresh assets continuously", "Media Buyer"],
          ["Replace fatigue quickly", "Media Buyer"]
        ])
      },
      {
        id: "testing-framework",
        title: "Testing Framework (aggressive roadmap)",
        tasks: buildTasks("testing-framework", [
          ["Run a faster testing cadence", "Creative Strategist"],
          ["Test multiple hypotheses at once", "Media Buyer"],
          ["Feed insights back into scaling decisions", "Creative Strategist"]
        ])
      }
    ]
  },
  {
    id: "conversion",
    title: "Conversion",
    deliverables: [
      {
        id: "continuous-funnel-optimization",
        title: "Continuous Funnel Optimization (sitewide CRO)",
        tasks: buildTasks("continuous-funnel-optimization", [
          ["Monitor sitewide performance", "CRO Specialist"],
          ["Improve major conversion paths", "CRO Specialist"],
          ["Continuously optimize core customer journeys", "CRO Specialist"]
        ])
      },
      {
        id: "funnel-development",
        title: "Funnel Development (pages, upsells, bundles)",
        tasks: buildTasks("funnel-development", [
          ["Build new pages", "CRO Specialist"],
          ["Build upsells and bundles", "CRO Specialist"],
          ["Increase conversion and AOV across the funnel", "CRO Specialist"]
        ])
      },
      {
        id: "conversion-improvements",
        title: "Conversion Improvements (advanced testing)",
        tasks: buildTasks("conversion-improvements", [
          ["Run deeper CRO testing", "CRO Specialist"],
          ["Test offers, layouts, and user journeys", "CRO Specialist"],
          ["Scale what wins", "CRO Specialist"]
        ])
      },
      {
        id: "aov-ltv-optimization",
        title: "AOV & LTV Optimization",
        tasks: buildTasks("aov-ltv-optimization", [
          ["Improve order value", "CRO Specialist"],
          ["Improve customer lifetime value", "CRO Specialist"],
          ["Use better offers and post-purchase flows", "CRO Specialist"]
        ])
      }
    ]
  },
  {
    id: "retention",
    title: "Retention",
    deliverables: [
      {
        id: "advanced-lifecycle-marketing",
        title: "Advanced Lifecycle Marketing",
        tasks: buildTasks("advanced-lifecycle-marketing", [
          ["Run advanced lifecycle flows", "Email/SMS Specialist"],
          ["Improve segmentation", "Email/SMS Specialist"],
          ["Increase retention and repeat revenue", "Email/SMS Specialist"]
        ])
      },
      {
        id: "email-sms-strategy",
        title: "Email & SMS Strategy",
        tasks: buildTasks("email-sms-strategy", [
          ["Own email and SMS direction", "Email/SMS Specialist"],
          ["Manage calendar and offers", "Email/SMS Specialist"],
          ["Lead segmentation strategy", "Email/SMS Specialist"]
        ])
      },
      {
        id: "campaign-management",
        title: "Campaign Management (promotions, launches)",
        tasks: buildTasks("campaign-management", [
          ["Plan campaigns", "Email/SMS Specialist"],
          ["Build launch and promotional campaigns", "Email/SMS Specialist"],
          ["Execute across retention channels", "Email/SMS Specialist"]
        ])
      }
    ]
  },
  {
    id: "tracking-optimization",
    title: "Tracking & Optimization",
    deliverables: [
      {
        id: "advanced-tracking-optimization",
        title: "Advanced Tracking & Optimization",
        tasks: buildTasks("advanced-tracking-optimization", [
          ["Improve event architecture", "Media Buyer"],
          ["Validate data quality", "Media Buyer"],
          ["Maintain stronger measurement systems", "Media Buyer"]
        ])
      },
      {
        id: "performance-insights-reporting",
        title: "Performance Insights & Reporting",
        tasks: buildTasks("performance-insights-reporting", [
          ["Deliver deeper reporting", "Account Manager"],
          ["Surface insights clearly", "Account Manager"],
          ["Connect performance to business decisions", "Account Manager"]
        ])
      },
      {
        id: "strategic-direction",
        title: "Strategic Direction",
        tasks: buildTasks("strategic-direction", [
          ["Lead high-level strategy", "Account Manager"],
          ["Decide priorities", "Account Manager"],
          ["Align execution with growth targets", "Account Manager"]
        ])
      }
    ]
  },
  {
    id: "support-communication",
    title: "Support & Communication",
    deliverables: [
      {
        id: "priority-support",
        title: "Priority Support (Slack/WhatsApp)",
        tasks: buildTasks("priority-support", [
          ["Provide fast support access", "Account Manager"],
          ["Handle urgent decisions and approvals", "Account Manager"],
          ["Remove blockers quickly", "Account Manager"]
        ])
      },
      {
        id: "weekly-on-demand-calls",
        title: "Weekly / On-demand Calls",
        tasks: buildTasks("weekly-on-demand-calls", [
          ["Run weekly or ad hoc calls", "Account Manager"],
          ["Review performance", "Account Manager"],
          ["Solve issues", "Account Manager"],
          ["Keep momentum high", "Account Manager"]
        ])
      }
    ]
  },
  {
    id: "strategy-growth",
    title: "Strategy & Growth",
    deliverables: [
      {
        id: "full-growth-strategy-ownership",
        title: "Full Growth Strategy Ownership",
        tasks: buildTasks("full-growth-strategy-ownership", [
          ["Take ownership of overall growth direction", "Account Manager"],
          ["Coordinate channel, offer, creative, and retention strategy", "Account Manager"]
        ])
      },
      {
        id: "channel-expansion-planning",
        title: "Channel Expansion Planning",
        tasks: buildTasks("channel-expansion-planning", [
          ["Identify expansion opportunities", "Account Manager"],
          ["Validate new channels", "Account Manager"],
          ["Sequence rollout plans", "Account Manager"]
        ])
      },
      {
        id: "offer-testing-funnel-development",
        title: "Offer Testing & Funnel Development",
        tasks: buildTasks("offer-testing-funnel-development", [
          ["Test new offers", "Creative Strategist"],
          ["Build supporting funnel assets", "CRO Specialist"],
          ["Unlock more scale", "Creative Strategist"]
        ])
      },
      {
        id: "creative-direction-at-scale",
        title: "Creative Direction at Scale",
        tasks: buildTasks("creative-direction-at-scale", [
          ["Set the creative direction", "Creative Strategist"],
          ["Guide high-volume output", "Creative Strategist"],
          ["Align messaging with performance insights", "Creative Strategist"]
        ])
      }
    ]
  }
];
const genericProcessItems: MenuItem[] = [
  {
    id: "diagnostic-call",
    label: "Diagnostic Call",
    subtitle: "Core Process",
    purpose: "Purpose: Understand the business and identify the main problem to solve.",
    sections: diagnosticCallSections
  }
];

const menuGroups: MenuGroup[] = [
  {
    id: "service-businesses",
    label: "Service Businesses",
    tone: "orange",
    processItems: [],
    serviceItems: [
      { id: "service-growth-audit", label: "Growth Audit", subtitle: "Core Process", purpose: "Purpose: Identify growth opportunities and create a clear action plan.", sections: growthAuditSections },
      { id: "service-onboarding", label: "Onboarding", subtitle: "Core Process", purpose: "Purpose: Gather access, align on goals, and prepare systems.", sections: onboardingSections },
      { id: "service-setup-implementation", label: "Setup & Implementation", subtitle: "Core Process", purpose: "Purpose: Fix tracking, structure accounts, and establish baseline performance.", sections: setupImplementationSections },
      { id: "service-foundation", label: "Package 1: Foundation", subtitle: "VPM Services", purpose: "Purpose: Add a short purpose here.", sections: [{ id: "foundation-summary", title: "Overview", description: "Add the Foundation package summary, fit, and promise here." }, { id: "foundation-inclusions", title: "Inclusions", description: "Add the service inclusions, deliverables, and key responsibilities here." }] },
      { id: "service-growth", label: "Package 2: Growth", subtitle: "VPM Services", purpose: "Purpose: Add a short purpose here.", sections: [{ id: "growth-summary", title: "Overview", description: "Add the Growth package summary, fit, and commercial framing here." }, { id: "growth-inclusions", title: "Inclusions", description: "Add the service inclusions, testing layers, and ownership here." }] },
      { id: "service-scale", label: "Package 3: Scale", subtitle: "VPM Services", purpose: "Purpose: Add a short purpose here.", sections: [{ id: "scale-summary", title: "Overview", description: "Add the Scale package summary, fit, and value proposition here." }, { id: "scale-inclusions", title: "Inclusions", description: "Add the strategic ownership, delivery layers, and expectations here." }] }
    ]
  },
  {
    id: "ecommerce",
    label: "Ecommerce",
    tone: "blue",
    processItems: [],
    serviceItems: [
      { id: "ecom-growth-audit", label: "Growth Audit", subtitle: "Core Process", purpose: "Purpose: Identify growth opportunities and create a clear action plan.", sections: growthAuditSections },
      { id: "ecom-onboarding", label: "Onboarding", subtitle: "Core Process", purpose: "Purpose: Gather access, align on goals, and prepare systems.", sections: onboardingSections },
      { id: "ecom-setup-implementation", label: "Setup & Implementation", subtitle: "Core Process", purpose: "Purpose: Fix tracking, structure accounts, and establish baseline performance.", sections: setupImplementationSections },
      { id: "ecom-foundation", label: "Package 1: Foundation", subtitle: "Core Process", purpose: "Purpose: Build a stable, converting foundation for growth.", sections: [], deliverableSections: foundationDeliverableSections, hideProcessOverview: true },
      { id: "ecom-growth", label: "Package 2: Growth", subtitle: "Core Process", purpose: "Purpose: Scale what's working and improve performance across the funnel.", sections: [], deliverableSections: growthDeliverableSections, hideProcessOverview: true },
      { id: "ecom-scale", label: "Package 3: Scale", subtitle: "Core Process", purpose: "Purpose: Turn marketing into a scalable, high-performance growth engine.", sections: [], deliverableSections: scaleDeliverableSections, hideProcessOverview: true }
    ]
  }
];

const defaultItemId = "diagnostic-call";

export function SalesProcessWorkspace() {
  const [activeItemId, setActiveItemId] = useState(defaultItemId);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [openDeliverables, setOpenDeliverables] = useState<Record<string, boolean>>({});

  const activeRecord = useMemo(() => {
    for (const item of genericProcessItems) {
      if (item.id === activeItemId) {
        return { group: null, item };
      }
    }

    for (const group of menuGroups) {
      for (const item of [...group.processItems, ...group.serviceItems]) {
        if (item.id === activeItemId) {
          return { group, item };
        }
      }
    }

    return { group: null, item: genericProcessItems[0] };
  }, [activeItemId]);

  const sidebarGroups = useMemo<DashboardSidebarGroup[]>(() => {
    return [
      {
        id: "core-process",
        label: "Process",
        items: genericProcessItems.map((item) => ({ id: item.id, label: item.label, tone: "orange" as const }))
      },
      ...menuGroups.map((group) => ({
        id: `${group.id}-services`,
        label: group.label,
        items: group.serviceItems.map((item) => ({ id: item.id, label: item.label, tone: group.tone }))
      }))
    ];
  }, []);

  function toggleSection(sectionKey: string) {
    setOpenSections((current) => ({ ...current, [sectionKey]: !current[sectionKey] }));
  }

  function toggleDeliverable(deliverableKey: string) {
    setOpenDeliverables((current) => ({ ...current, [deliverableKey]: !current[deliverableKey] }));
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f6f5f2]">
      <DashboardSidebar
        activeItemId={activeItemId}
        groups={sidebarGroups}
        onSelect={setActiveItemId}
        subtitle="Sales processes, packages, and placeholders in one dashboard shell."
        title="VPM Checklists"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          activeHref="/"
          subtitle="Improve structure, keep spacing consistent, and leave the right side ready for checklist content."
          title={activeRecord.item.label}
        />

        <div className="flex-1 px-6 py-4">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            <DashboardPanel subtitle={activeRecord.item.purpose} title={activeRecord.item.subtitle ?? activeRecord.group?.label ?? "Process"} />

            {activeRecord.item.hideProcessOverview ? null : (
              <DashboardPanel title="Process Overview">
                <div className="flex flex-col gap-4">
                  {activeRecord.item.sections.map((section) => (
                    <div className="rounded-xl border border-zinc-200 bg-white p-4" key={section.id}>
                      <p className="text-sm font-semibold text-zinc-900">{section.title}</p>
                      <p className="mt-1 text-[12px] text-zinc-600">{section.description}</p>
                    </div>
                  ))}
                </div>
              </DashboardPanel>
            )}

            {activeRecord.item.deliverableSections?.length ? (
              <DashboardPanel title="Deliverables">
                <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-zinc-500">Deliverables</p>
                <div className="space-y-5">
                  {activeRecord.item.deliverableSections.map((section) => {
                    const sectionKey = `${activeRecord.item.id}-${section.id}`;
                    const sectionOpen = Boolean(openSections[sectionKey]);
                    return (
                      <div className="rounded-xl border border-zinc-200 bg-white shadow-[0_1px_0_rgba\(0,0,0,0.02\)]" key={section.id}>
                        <button className="flex w-full items-center justify-between px-5 py-4 text-left" onClick={() => toggleSection(sectionKey)} type="button">
                          <span className="text-lg font-semibold text-zinc-950">{section.title}</span>
                          <span className="text-xs text-zinc-500">{sectionOpen ? "Hide" : "Show"}</span>
                        </button>

                        {sectionOpen ? (
                          <div className="border-t border-zinc-200 px-5 py-3.5">
                            <div className="space-y-2.5">
                              {section.deliverables.map((deliverable) => {
                                const deliverableKey = `${sectionKey}-${deliverable.id}`;
                                const deliverableOpen = Boolean(openDeliverables[deliverableKey]);
                                return (
                                  <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 transition hover:bg-zinc-50" key={deliverable.id}>
                                    <button className="flex w-full items-center justify-between px-3.5 py-2.5 text-left" onClick={() => toggleDeliverable(deliverableKey)} type="button">
                                      <span className="text-[12px] font-medium text-zinc-700">{deliverable.title}</span>
                                      <span className="text-xs text-zinc-500">{deliverableOpen ? "Hide" : "Open"}</span>
                                    </button>

                                    {deliverableOpen ? (
                                      <div className="border-t border-zinc-200 px-3.5 py-2.5">
                                        <div className="space-y-2.5">
                                          {deliverable.tasks.map((task) => (
                                            <div className="flex flex-col gap-0.5 border-l border-zinc-200 pl-3 sm:flex-row sm:items-start sm:justify-between" key={task.id}>
                                              <p className="text-[12px] text-zinc-700">{task.title}</p>
                                              <p className="text-[11px] text-zinc-500">{task.role}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </DashboardPanel>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}






