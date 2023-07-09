import React from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import FollowingsCard from "../FollowingsCard/FollowingsCard";

const FollowingsModal = ({ modalOpened, setModalOpened }) => {

  const theme = useMantineTheme()
  
  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="50%"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
      style={{ width: "50%", borderRadius: "10rem", transform: "translateX(22rem)" }}
    >
      <FollowingsCard location="modal" style={{ width: "50%", borderRadius: "10rem" }} />
    </Modal>
  );
};

export default FollowingsModal;
