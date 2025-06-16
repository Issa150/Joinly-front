
import { useState } from "react";
import UpdateGeneralUserInfoForm from "../forms/UpdateGeneralUserInfo.form.tsx";
import UserInfoCard from "../UserInfoCard.tsx";
function UserInformation() {
  const [isFormUpdate, setIsFormUpdate] = useState(false);



  return (
    <>
      {!isFormUpdate
        ? <UserInfoCard isFormUpdate={isFormUpdate} setIsFormUpdate={setIsFormUpdate} />
        : <UpdateGeneralUserInfoForm isFormUpdate={isFormUpdate} setIsFormUpdate={setIsFormUpdate} />}
    </>
  )
}

export default UserInformation