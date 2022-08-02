import { mergeStyleSets, TextField } from "@fluentui/react";
import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import React = require("react");
import { useServiceProvider } from "./context";

interface props {
  ImageNumber: number;
}

const noImage =
  "data:image/png;base64,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";

const QuoteImage = (props: props) => {
  const vm = useServiceProvider();

  useEffect(() => {
    // console.log("useEffect in details");
    vm.ImageURL[props.ImageNumber] = vm.currentNode.PhotoURL
      ? vm.currentNode.PhotoURL[props.ImageNumber]
      : "";
  }, [vm.currentNode]);

  const styles = mergeStyleSets({
    "css-column": {
      margin: "1%",
      width: "50%",
    },
    "css-url-save-button": {
      position: "relative",
      // width: "10% !important",
    },
    Card: {
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.15)",
      padding: "5%",
      textAlign: "center",
      backgroundColor: "#f1f1f1",
      width: "90%",
    },
    "css-image-style": {
      width: "100%",
      height: "95%",
    },
    "text-field": {
      border: "1px solid #eeeeee",
      magrin: "1%",
      // width: "97%",
    },
  });

  return (
    <div className={styles["css-column"]}>
      <div className={styles["css-url-save-button"]}>
        <TextField
          className={styles["text-field"]}
          underlined
          onChange={(
            e: FormEvent<HTMLInputElement | HTMLTextAreaElement>
          ): void => {
            vm.imageUrlChangeHandler(e, props.ImageNumber);
          }}
          onBlur={() => {
            vm.imageUrlBlurrHandler(props.ImageNumber);
          }}
          label='URL'
          value={vm.ImageURL[props.ImageNumber]}
        />
      </div>
      <div className={styles["Card"]}>
        <img
          src={
            vm.currentNode.PhotoURL
              ? vm.currentNode.PhotoURL[props.ImageNumber]
              : ""
          }
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            console.log("image failed");
            currentTarget.src = noImage;
          }}
          className={styles["css-image-style"]}
        />
      </div>
    </div>
  );
};

export default observer(QuoteImage);
