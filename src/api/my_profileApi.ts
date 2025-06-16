import { useApi } from "../hooks/useApi.ts";
import { UserProfileType } from "../interface/user.ts";
import { ChangeEmailType, ChangePasswordType } from "../interface/ProfileTypes.ts";
// import  userProfile  from "../pages/Profile/faker.ts";

export async function getUserProfileGeneral(): Promise<UserProfileType> {
  try {
    const api = useApi()
    const res = await api.get(`profile`)
    // console.log("React get data: " + res.data)
    return res.data;

  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getUserProfileBasic(): Promise<UserProfileType> {
  try {
    const api = useApi()
    const res = await api.get(`profile/basic`)
    // console.log("React get data: " + res.data)
    return res.data;

  } catch (error: any) {
    throw new Error(error);
  }
}


export const updateProfile = async (formData: FormData) => {
  const api = useApi();
  try {
      const response = await api.put('profile', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      return response;
  } catch (error: any) {
      console.error('Update profile error:', error.response ? error.response.data : error.message);
      throw error.response?.data || error;
  }
};


export const changePassword = async (passwordData: ChangePasswordType) => {
  const api = useApi();
  try {
    const response = await api.put('/profile/change-password', passwordData);
    return response.data;
  } catch (error: any) {
    console.error('Change password error:', error.response ? error.response.data : error.message);
    throw error.response?.data || error;
  }
};


export const changeEmail = async (emailData: ChangeEmailType) => {
  const api = useApi();
  try {
    const response = await api.put('/profile/change-email', emailData);
    return response.data;
  } catch (error: any) {
    console.error('Change email error:', error.response ? error.response.data : error.message);
    throw error.response?.data || error;
  }
};


export const deleteProfile = async () => {
  const api = useApi();
  try {
    const response = await api.delete('/profile');
    return response.data;
  } catch (error: any) {
    console.error('Delete profile error:', error.response ? error.response.data : error.message);
    throw error.response?.data || error;
  }
};