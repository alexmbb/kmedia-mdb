import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { Document, Page } from 'react-pdf/build/entry.webpack';
import { Container } from 'semantic-ui-react';

import PDFMenu from './PDFMenu';
import { BS_TAAS_PARTS } from '../../../helpers/consts';

class PDF extends Component {
  static propTypes = {
    pdfFile: PropTypes.string.isRequired,
    startsFrom: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
    pageNumberHandler: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  static isTaas = source => (BS_TAAS_PARTS[source] !== undefined);

  static startsFrom = source => BS_TAAS_PARTS[source];

  constructor(props) {
    super(props);

    let pageNumber = props.pageNumber + props.startsFrom + -1;
    if (pageNumber > props.startsFrom) {
      pageNumber = props.startsFrom;
    }
    this.state = {
      pageNumber,
      numPages: null,
      width: null,
    };
  }

  componentWillMount() {
    window.removeEventListener('resize', this.throttledSetDivSize);
  }

  componentDidMount() {
    this.setDivSize();
    window.addEventListener('resize', this.throttledSetDivSize);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pdfFile !== nextProps.pdfFile) {
      const pageNumber = nextProps.pageNumber + nextProps.startsFrom + -1;
      this.setState({
        pageNumber,
        numPages: null,
      });
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    const { pageNumber } = this.state;
    const pageNo         = pageNumber <= numPages ? pageNumber : numPages;
    this.setState({ numPages, pageNumber: pageNo }, this.props.pageNumberHandler(pageNo));
  };

  setDivSize = () => this.setState({ width: document.getElementById('pdfWrapper').getBoundingClientRect().width });

  setPage = (pageNo) => {
    this.setState({ pageNumber: pageNo }, this.props.pageNumberHandler(pageNo));
  };

  throttledSetDivSize = () => throttle(this.setDivSize, 500);

  render() {
    const { numPages, pageNumber, width, } = this.state;
    const { startsFrom, }                  = this.props;

    return (
      <div id="pdfWrapper" style={{ marginTop: '10px' }}>
        <Container fluid textAlign="center">
          <PDFMenu
            numPages={numPages}
            pageNumber={pageNumber}
            startsFrom={startsFrom}
            setPage={this.setPage}
          />
        </Container>
        <div style={{ direction: 'ltr' }}>
          <Document
            file={this.props.pdfFile}
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            {
              numPages ?
                <Page
                  width={width}
                  pageNumber={pageNumber + (-startsFrom) + 1}
                  renderAnnotations={false}
                  renderTextLayer={false}
                /> : null
            }
          </Document>
        </div>
      </div>
    );
  }
}

export default PDF;
