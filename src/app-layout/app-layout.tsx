import { Layout } from "antd";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppHeader } from "./app-header";

const { Header, Content } = Layout;

const AppLayout: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(64);

  useEffect(() => {
    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(Math.max(64, headerRef.current.offsetHeight));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Layout className="h-dvh">
      <Header
        className="sticky top-0 z-10 w-full border-b border-[rgba(255,255,255,0.12)] bg-white p-0"
        style={{ height: `${headerHeight}px` }}
      >
        <div ref={headerRef} className="w-full">
          <AppHeader />
        </div>
      </Header>

      <Layout>
        <Content
          className="overflow-auto"
          style={{ maxHeight: `calc(100dvh - ${headerHeight}px)` }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export { AppLayout };
