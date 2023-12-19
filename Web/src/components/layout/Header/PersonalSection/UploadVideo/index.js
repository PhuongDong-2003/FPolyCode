import { IconButton } from "@mui/material";
import React, { Fragment, createContext, useState } from "react";
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
// import UploadProjectModal from "../../../Model/UploadProjectModal";
import { useSelector } from "react-redux";
import UploadProjectModal1 from "../../../Model/UploadProjectModal/index1";

export const UploadProjectModalContext = createContext(null);

const UploadVideo = () => {
  const isAuthenticated = useSelector(state => state.app.isAuthenticated)
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);

  return (
    <Fragment>
      <IconButton size="medium" onClick={handleOpenModal} disabled={!isAuthenticated}>
        <VideoCallOutlinedIcon fontSize="medium" />
      </IconButton>
      { isAuthenticated && (
        <UploadProjectModalContext.Provider value={{isOpenModal, handleCloseModal}}>
          <UploadProjectModal1 />
        </UploadProjectModalContext.Provider>
      )}
    </Fragment>
  );
};

export default UploadVideo;
