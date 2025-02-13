const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="animated-dotted-background dark:animated-dotted-background-dark">
        {children}
      </div>
    );
};

export default Layout;