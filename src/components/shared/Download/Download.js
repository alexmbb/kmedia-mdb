import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button, } from 'semantic-ui-react';

class Download extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    mimeType: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
  };

  static defaultProps = {
    children: null,
  };

  static fileDownload = (data, path, mimeType) => {
    const [filename] = path.split('/').slice(-1);

    const blob = new Blob([data], { type: mimeType || 'application/octet-stream' });
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      // IE workaround for "HTML7007: One or more blob URLs were
      // revoked by closing the blob for which they were created.
      // These URLs will no longer resolve as the data backing
      // the URL has been freed."
      window.navigator.msSaveBlob(blob, filename);
      return;
    }

    const blobURL          = window.URL.createObjectURL(blob);
    const tempLink         = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href          = blobURL;
    tempLink.setAttribute('download', filename);

    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }

    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  };

  static downloadAsset = (path, mimeType) => axios({
    url: path,
    headers: {
      Accept: mimeType
    },
    responseType: 'blob'
  }).then((response) => {
    Download.fileDownload(response.data, path, mimeType);
  });

  render() {
    const { children, path, mimeType, } = this.props;
    const [filename]                    = path.split('/').slice(-1);

    return typeof filename !== 'undefined' &&
      <Button compact size="small" icon="download" onClick={() => Download.downloadAsset(path, mimeType)}>{children}</Button>;
  }
}

export default Download;
