import {  SignedOut, SignInButton,  SignUpButton, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStores";
import {  buttonVariants } from "./ui/button";
import FuzzyText from "./reactbit/fuzzy";
import NotificationIcon from "@/pages/chat/components/NotificationIcon";
import { useEffect, useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
  } from "@/components/ui/popover";
  import './Topbar.css';
//import {Badge} from '@heroui/badge';
//import {Button} from '@heroui/button';

import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
  

const Topbar = () => {
	const { isAdmin }= useAuthStore();
	 console.log({isAdmin});
	 const [nCount,setNCount] = useState(0);
	 const handleNotificationClick = () => {
		setNCount(0); // Reset the notification count
	  };
	 const getNotificnsCount = async () => {
		try{
			const response = await axiosInstance.get('/users/notifications/get/COUNT/');	
			
			setNCount(response.data);	
		}catch(err){
			console.log(err);
		}
	 }
	 useEffect(() => {
		getNotificnsCount();
	 },[])
	return (
		<div
			className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 
      backdrop-blur-md z-10
    '
		>
			<div className='flex gap-2 items-center'>
			<img
					src="/spotify.png" className="size-10" alt="Beatz"/>
			<FuzzyText 
  baseIntensity={0.08} 
  hoverIntensity={0.1} 
  enableHover={true}
>Beatz .	
</FuzzyText>

			</div>
			<div className='flex items-center gap-4'>
				{isAdmin && (
					<Link to={"/admin"}
					className= {cn(
						buttonVariants({variant:"outline"})
					)}>
						<LayoutDashboardIcon className='size-4  mr-2' />
						Admin Dashboard
					</Link>
				)}

     
				<SignedOut>
					<SignInOAuthButtons />
			
	{/* <SignInButton>
			Sign In
	</SignInButton> */}
	<div className="btn-signin">

  <SignInButton signUpForceRedirectUrl={"/auth-callback"}>
    Sign In
  </SignInButton>
</div>


<div className="btn-signin">
		  <SignUpButton>
			Sign up
		  </SignUpButton>
		  </div>

				</SignedOut>


				<UserButton />
				<Popover>
  <PopoverTrigger onClick={handleNotificationClick} >
	{/* <Badge color="warning" content={90} shape="circle">
      <Button isIconOnly aria-label={`more than ${nCount} notifications`}  radius="full" variant="light">
      
      </Button>

    </Badge> */}
	  <NotificationIcon nCount={nCount} size={26}  />
	</PopoverTrigger > 
  <PopoverContent><NotifcnContent/></PopoverContent>
</Popover>

				
				
			
			</div>
		</div>
	);
};
export default Topbar;
function NotifcnContent() {
	const [notifications, setNotifications] = useState([]);
  
	const clearNotifctns = async () => {
	  try {
		const response = await axiosInstance.get('/users/notifications/get/CLEAR/');
		console.log(response.data);
		if (response.data.status === "success") {
		  // Use toast for success
		  toast.success("Notifications Cleared", {
			style: {
			  background: 'black', 
			  color: 'white',     
			  padding: '16px',     
			},
		  });
		}
		
		setNotifications([]);
	  } catch (err) {
		console.log(err);
		// Use toast for error
		toast.error("Error clearing notifications", {
		  style: {
			background: 'black', // Black background for the toast
			color: 'white',      // White text for contrast
			padding: '16px',     // Padding for better appearance
		  },
		});
	  }
	};

	const getNotifctns = async () => {
		try{
			const response = await axiosInstance.get('/users/notifications/get/0000/');
			console.log(response.data);
			
			setNotifications(response.data);
		}catch(err){
			console.log(err);
		}
	}
	useEffect(() => {
		// Fetch notifications from your backend here
		getNotifctns();
		
	}, []);
	
	const filterNtfctns = (n:any)=>{
		let arr = n.split("__")
		if(arr[0] == "FRIEND_REQUEST"){
			return "Friends Request from "+arr[1]
		}else if(arr[0] == "FRIEND_ACCEPTED"){
			return "Friend Accepted "+arr[1]
		}else if(arr[0] == "FRIEND_REJECTED"){
			return "Friend Rejected "+arr[1]
		}
		return ''
	}

	return (
		
			<div className="notification text-center">
			  {notifications.map((notifications: any, index) => {
				const text = filterNtfctns(notifications);
				return (
				  <div key={index} className="notification-item m-4">
					{text}
				  </div>
				);
			  })}
			  {notifications.length > 0 ? (
				<button
				  className="relative cursor-pointer py-4 px-8 text-center font-barlow inline-flex justify-center text-base uppercase text-white rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline focus:outline-2 focus:outline-white focus:outline-offset-4 overflow-hidden mt-4"
				  onClick={clearNotifctns}
				>
				  <span className="relative z-20">Clear Notifications</span>
		  
				  <span
					className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out"
				  ></span>
		  
				  <span
					className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0"
				  ></span>
				  <span
					className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0"
				  ></span>
				  <span
					className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0"
				  ></span>
				  <span
					className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0"
				  ></span>
				</button>
			  ) : null}
			</div>
		  );
		  
	
}

