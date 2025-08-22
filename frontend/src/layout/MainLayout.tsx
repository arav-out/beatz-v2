import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import PlayBackControls from "./components/PlayBackControls";
import { useEffect, useState } from "react";

import Aurora from "./components/aurora/Aurora/Aurora";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className='h-screen bg-black text-white flex flex-col relative'>
  <Aurora
        colorStops={["#2E1A47", "#5B2E91", "#F9F9F9"]}
        blend={.5}
        amplitude={2.5}
        speed={1.0}
      />
      <div className='flex-1 flex h-full overflow-hidden p-2 relative z-10'>
        <ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-2'>
          <AudioPlayer />
          {/* left sidebar */}
          <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
            <LeftSidebar/>
          </ResizablePanel>

          <ResizableHandle className='w-2  opacity-0' />

          {/* Main content */}
          <ResizablePanel defaultSize={isMobile ? 80 : 60}>
            <Outlet />
          </ResizablePanel>

          {!isMobile && (
            <>
              <ResizableHandle className='w-2  opacity-0' />

              {/* right sidebar */}
              <ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
                <FriendsActivity />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>

		
      </div>
	  <PlayBackControls />
    </div>
  );
};

export default MainLayout;