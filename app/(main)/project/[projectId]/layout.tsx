import { Suspense } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="animated-dotted-background dark:animated-dotted-background-dark">
        <Suspense fallback={<span>Loading...</span>}>
        {children}
        </Suspense>
      </div>
    );
};

export default Layout;