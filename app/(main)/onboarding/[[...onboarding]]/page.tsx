'use client'
import { OrganizationList, useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingPage() {
     const { organization } = useOrganization();
    const router = useRouter();

    useEffect(() => {
        if (organization) {
            router.push(`/organization/${organization.slug}`);
        }
    }, [organization, router]); 

    return (
        <div className="text-2xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            <h1>Onboarding Page</h1>
            <div className="flex justify-center items-center pt-14">
                <OrganizationList hidePersonal
                afterCreateOrganizationUrl={`/organization/${organization?.slug}`}
                afterSelectOrganizationUrl={`/organization/${organization?.slug}`}
                />
            </div>
        </div>
    );
}
