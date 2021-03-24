import React, { useEffect } from "react";
import MainComponent from "../components/common/MainComponent";
import { useRouter } from "next/router";
import { fetchAppData } from "../middleware/api/initialization";
import { handleRequestError } from "../utils/helperFuncs";
import { Role } from "../utils/constants";

const MainPage = ({ currentClinic, currentUser }) => {
  const router = useRouter();

  useEffect(() => {
    redirectUserToPage()
  }, []);

  const redirectUserToPage = async () => {
    const selectedClinic = currentUser?.clinics.find((clinic) => clinic.isSelected) || currentUser?.clinics[0];
    if (selectedClinic != null) {
      switch (selectedClinic.roleInClinic) {
        case Role.reception:
          await router.replace('/calendar/day');
          break;
        case Role.admin:
        case Role.manager:
          await router.replace('/analytics/general');
          break;
        case Role.doctor:
          await router.replace('/doctor');
          break;
        default:
          await router.replace('/login');
          break;
      }
    } else {
      await router.replace('/login');
    }
  }

  return (
    <MainComponent
      currentClinic={currentClinic}
      currentUser={currentUser}
      currentPath='/'
    />
  )
}

export const getServerSideProps = async ({ req, res }) => {
  try {
    const appData = await fetchAppData(req.headers);
    return {
      props: appData
    }
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {},
    };
  }
}

export default MainPage;
