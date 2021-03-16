import React, { useEffect } from "react";
import { wrapper } from "../store";
import MainComponent from "../components/common/MainComponent";
import { useRouter } from "next/router";

const MainPage = ({ currentClinic, currentUser }) => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/analytics/general');
  }, [])

  return (
    <MainComponent>

    </MainComponent>
  )
}

export default wrapper.withRedux(MainPage);
