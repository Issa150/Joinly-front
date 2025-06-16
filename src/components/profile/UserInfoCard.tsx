import { Button, Card, CardBody, CardHeader } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
// import { useState } from "react";
import { UserProfileType } from "../../interface/user";
import { getUserProfileGeneral } from "../../api/my_profileApi";
// import { useAuth } from "../../contexts/AuthContext";


interface ChildComponentAProps {
    isFormUpdate: boolean;
    setIsFormUpdate: (value: boolean) => void; // Simplified function type
}

export function UserInformation({ isFormUpdate, setIsFormUpdate }: ChildComponentAProps) {
//   const [isFormUpdate, setIsFormUpdate] = useState(false);
  // const {profileImg } = useAuth();

  const { data, isLoading, isError } = useQuery<UserProfileType>({
    // Ici nous donnons un id à notre requête
    queryKey: ["userProfile"],
    // Nous appelons la requête qui doit se trouver dans notre dossier api
    // queryFn: () => getUserProfile(),
    queryFn: getUserProfileGeneral,
    // Le slateTime c'est le temps en ms que notre appel gardera en cache
    // Si il est à 0, il n'y aura pas de cache, si nous ne mettons rien le cache durera 5 minutes
    staleTime: 0,
    // enabled: false
  });



  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    // navigate('/signin')
    return <div>Error loading user profile.</div>;
  }

  return (
    <>
      <Card className="mt-6 bg-blue-gray-50 ___ sm:mt-0 sm:rounded-t-none sm:rounded-es-sm rounded-b-4xl- sm:shadow-none sm:h-full">
        <CardHeader className="mt-0 mb-4 bg-transparent shadow-none rounded-3xl relative __">
          <img className="aspect-square rounded-full object-cover object-top w-8/12 mx-auto my-4 border-4 border-blue-gray-100 shadow-custom ___ sm:w-36" 
          src={import.meta.env.VITE_API_BASE_URL+ "media/uploads/" + data?.profileImg || "https://cdn.pixabay.com/photo/2013/07/13/10/44/man-157699_1280.png"} alt="" />
          <h5 color={"blue-gray"} className="text-joinly_blue-contraste font-black text-xl text-center">
            
            {data?.firstname} {data?.lastname}
          </h5>
          <span className="border-t-[1px] block border-black rounded-none mt-2"></span>

        </CardHeader>
        <CardBody className="p-6 rounded-ee-4xl">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-300 py-2 grid grid-cols-[150px_1fr]">
                <td className="font-semibold pr-4">Email:</td>
                <td>{data?.email}</td>
              </tr>
              <tr className="border-b border-gray-300 py-2 grid grid-cols-[150px_1fr]">
                <td className="font-semibold pr-4">Statut:</td>
                <td>{data?.role}</td>
              </tr>
              {/* <tr className="border-b border-gray-300 py-2 grid grid-cols-[150px_1fr]"> */}
                {/* <td className="font-semibold pr-4">Notifications:</td> */}
                {/* <td>{data?.activatedNotification ? "Activé" : "Désactivé"}</td> */}
              {/* </tr> */}
            </tbody>
          </table>
          <div className="text-center mt-8">
            <Button onClick={()=> setIsFormUpdate(!isFormUpdate)} className="bg-joinly_blue-principale text-white">Modifier</Button>
          </div>
        </CardBody>
      </Card> 
    
    </>
  )
}

export default UserInformation