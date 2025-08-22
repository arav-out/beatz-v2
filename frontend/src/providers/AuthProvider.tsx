import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStores";
import { useChatStore } from "@/stores/useChatStore";

import { useAuth, useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";


import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
	
	
	if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const {  user } = useUser();
	const { getToken,userId } = useAuth();
	const [loading, setLoading] = useState(true);
const {checkAdminStatus} = useAuthStore();
const {initSocket,disconnectSocket} = useChatStore();

	useEffect(() => {
		const initAuth = async () => {
			try {
				console.log("===================================Getting token this compoent redner",user);
				
				const token = await getToken({template:'JWT_TOKENS'});
				updateApiToken(token);
				// await axiosInstance.post("/auth/callback", {
				// 	id: user.id,
				// 	firstName: user.firstName,
				// 	lastName: user.lastName,
				// 	imageUrl: user.imageUrl,
				// });
				if (token) {
					await checkAdminStatus();

					if(userId) initSocket(userId);

				}


			
				}
             catch (error: any) {
				updateApiToken(null);
				console.log("Error in auth provider", error);
			} finally {
				setLoading(false);
			}
		};

		initAuth();


		// clean up
		return () => 
			disconnectSocket();
		

		
	}, [getToken,userId,checkAdminStatus,initSocket,disconnectSocket]);

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-8 text-emerald-500 animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;
