'use client'

import {
    OrganizationSwitcher,
    SignedIn,
    useOrganization,
    useUser,
  } from "@clerk/nextjs";
import { usePathname } from "next/navigation"

export default function OrgSwitch() {
    const { isLoaded} = useOrganization();
    const {isLoaded : isUserLoaded} = useUser();
    const pathname = usePathname();

    if(!isLoaded || !isUserLoaded) return null;
    return (
        <div>
          <SignedIn>
          <OrganizationSwitcher
          hidePersonal
          createOrganizationMode={pathname === "/onboarding" ? "navigation" : undefined}

          afterCreateOrganizationUrl="/organization/:slug"
          afterSelectOrganizationUrl="/organization/:slug"
          createOrganizationUrl="/onboarding"
          appearance={{
            elements: {
              organizationSwitcherTrigger:
                "border-2 border-gray-300 rounded-md px-5 py-2 text-inherit",
              organizationSwitcherTriggerIcon: "text-blue-500",
            },
          }}
        />
          </SignedIn>
        </div>
    )
}