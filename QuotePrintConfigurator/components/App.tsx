import { mergeStyleSets, MessageBar } from "@fluentui/react";
import { observer } from "mobx-react";
import { ServiceProvider } from "pcf-react";
import React = require("react");
import QPCcontrolVM, { serviceProviderName } from "../ViewModels/QPCcontrolVM";
import ContextProvider from "./context";
import QuoteDetails from "./QuoteDetails";
import QuoteTree from "./QuoteTree";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import QuoteImageList from "./QuoteImageList";

initializeIcons();

export interface props {
  controlWidth?: number;
  controlHeight?: number;
  serviceProvider: ServiceProvider;
}

const App = (props: props) => {
  const vm = props.serviceProvider.get<QPCcontrolVM>(serviceProviderName);
  const styles = mergeStyleSets({
    loading: {
      height: "100%",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    noData: {
      width: "100%",
      margin: "0",
      display: "flex",
      justifyContent: "start",
      alignItems: "center",
    },
    Stack: {
      width: "100%",
      display: "flex",
      height: `calc(${vm.controlHeight as number}px - 0.5em)`,
      justifyContent: "space-around",
      alignItems: "flex-start",
      border: "1px solid #eeeeee",
    },
    StackItem: {
      width: "50%",
      // height: `${(vm.controlHeight as number) - 40}px`,
      height: "95%",
      margin: "1em",
      overflowY: "scroll",
      overflowX: "hidden",
    },
  });

  useEffect(() => {
    vm.updateData();
    if (vm.firstLoad) {
      vm.controlHeight = props.controlHeight;
      vm.controlWidth = props.controlWidth;
      console.log("version 18");
    }

    return () => {
      vm.pcfContext.parameters.sampleDataSet.refresh();
    };
  }, []);

  if (!vm.isLoaded) {
    return (
      <div className={styles.loading}>
        <TailSpin color='#00BFFF' height={50} width={50} />
      </div>
    );
  }
  if (!vm.isThereData) {
    return (
      <div className={styles.noData}>
        <MessageBar>There's No Quote Lines</MessageBar>
      </div>
    );
  } else {
    return (
      <ContextProvider value={vm}>
        <div id='wrapper' className={styles.Stack}>
          <div className={styles.StackItem}>
            <QuoteTree />
          </div>
          <div className={styles.StackItem}>
            <QuoteDetails />
            <QuoteImageList />
          </div>
        </div>
      </ContextProvider>
    );
  }
};

export default observer(App);
