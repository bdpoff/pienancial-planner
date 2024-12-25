import React, { useEffect } from 'react';
import { AppBar, Dialog, IconButton, Toolbar, Slide } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';
//import { PDFDownloadLink, pdf, usePDF, Document, Page, View, StyleSheet, Text } from '@react-pdf/renderer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import PienancialPlan from './PienancialPlan';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/*const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

const Plan = () => {
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
};*/

export default function DownloadDialog(props) {
  /*const [instance, updateInstance] = usePDF({ document: {Plan} });
  useEffect(() => {
    console.log(instance)
  }, [instance])*/

  /*const downloadPdf = async () => {
    const fileName = 'test.pdf';
    const blob = await pdf(<Plan />).toBlob();
    saveAs(blob, fileName);
  };*/

  const pdfify = () => {
    const input = document.getElementById('pienancial-plan');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        // pdf.output('dataurlnewwindow');
        pdf.save("download.pdf");
      })
    ;
  }

  return (
    <Dialog fullScreen open={props.open} onClose={props.onClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={props.onClose}
            aria-label="close"
          >
            <CloseRoundedIcon />
          </IconButton>
          <IconButton
              edge="end"
              color="inherit"
              onClick={pdfify}
              aria-label="download"
            >
             <DownloadRoundedIcon />
            </IconButton>
            {/*<PDFDownloadLink document={<Plan />} fileName="somename.pdf">
            {({ blob, url, loading, error }) =>
              loading ? null : <IconButton><DownloadRoundedIcon/></IconButton>
            }
          </PDFDownloadLink>*/}
          
        </Toolbar>
      </AppBar>
      <PienancialPlan id="pienancial-plan"/>
    </Dialog>
  );
};