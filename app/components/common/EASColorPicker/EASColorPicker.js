import React from "react";
import Fade from "@material-ui/core/Fade";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { ColorPicker } from "react-color-palette";
import { Button } from "react-bootstrap";

import { textForKey } from "../../../../utils/localization";
import styles from "./EASColorPicker.module.scss";

const EASColorPicker = ({ open, anchorEl, placement, color, onClose, onSave, setColor }) => {
  return (
    <Popper
      transition
      disablePortal
      id="color-picker"
      placement={placement || "top-start"}
      open={open}
      anchorEl={anchorEl}
      className={styles.popper}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <ClickAwayListener onClickAway={onClose}>
            <Paper elevation={10}>
              <ColorPicker
                hideHSV
                hideRGB
                width={300}
                height={200}
                color={color}
                onChange={setColor}
              />
              <Button className="positive-button" onPointerUp={onSave}>
                {textForKey('Save')}
              </Button>
            </Paper>
          </ClickAwayListener>
        </Fade>
      )}
    </Popper>
  )
};

export default EASColorPicker;
