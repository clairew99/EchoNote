import { Component } from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "@shared/styles/GlobalStyles";
import { theme } from "@shared/styles/theme";
import ToolBar from "@components/ToolBar";
import PdfBar from "@components/PdfBar";
import RecordingBar from "@components/RecordingBar";
import { Layout, MainContent, rootStyle, appStyle } from "@/Layout.style";
import STTBar from "@components/stt/STTBar";
import PdfViewer from "@components/PdfViewer";
import PdfButton from "@services/PDFupload/PdfUpdate";

class App extends Component {
  state = {
    isPdfBarOpened: false, // PdfBar 열림/닫힘 상태 관리
    isSTTBarOpened: false, // STTBar 열림/닫힘 상태 관리
  };

  togglePdfBar = () => {
    this.setState((prevState) => ({
      isPdfBarOpened: !prevState.isPdfBarOpened,
    }));
  };

  toggleSTTBar = () => {
    this.setState((prevState) => ({
      isSTTBarOpened: !prevState.isSTTBarOpened,
    }));
  };

  render() {
    return (
      <div style={rootStyle}>
        <div style={appStyle}>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            <ToolBar />
            <Layout>
              <RecordingBar />
              <PdfBar />
              <MainContent>
                <PdfViewer />
              </MainContent>
              <STTBar />
              {/* <PdfButton /> */}
            </Layout>
          </ThemeProvider>
        </div>
      </div>
    );
  }
}

export default App;
