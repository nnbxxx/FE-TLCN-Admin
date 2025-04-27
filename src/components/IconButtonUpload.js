import { PaperClipOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Tooltip, Upload } from 'antd';
import React from 'react';
import { uploadImg } from '../utils/api';
import styled from 'styled-components';

const IconButtonUpload = ({ onChange, action, headers, name }) => {
  const handleCustomUpload = async ({ file, onSuccess, onError }) => {
    try {
      const res = await uploadImg(file);
      if (res.error) {
        onError(new Error(`Upload failed with status ${res?.statusCode}`));
        if (onChange) {
          onChange({ file: { ...file, status: 'error' } });
        }
      } else {
        onSuccess(res.data, file); // Call onSuccess with the server response and file
        if (onChange) {
          onChange({
            file: { ...file, status: 'done', fileUrl: res.data[0] },
          });
        }
      }
    } catch (error) {
      onError(error);
      if (onChange) {
        onChange({ file: { ...file, status: 'error', error } });
      }
    }
  };

  const uploadProps = {
    name: name || 'files', // Changed to 'files' to match your FormData append
    customRequest: handleCustomUpload,
    headers: headers || {},
    showUploadList: false,
  };

  const iconButtonStyle = {
    padding: 0,
    border: 'none',
    background: 'transparent',
    boxShadow: 'none',
    lineHeight: 1,
    minWidth: 0,
    fontSize: '24px',
    color: '#ff5a5a',
    cursor: 'pointer',
    marginRight: '10px',
  };

  return (
    <Upload {...uploadProps}>
      <div style={iconButtonStyle}>
        <Tooltip title="Upload a file">
          <FileUploadButton icon={<PaperClipOutlined />} />
        </Tooltip>
      </div>
    </Upload>
  );
};

const FileUploadButton = styled(Button)`
  background-color: #f0f0f0;
  border-color: #d9d9d9;
  :hover {
    background-color: #f4f4f4;
    border-color: #bdbdbd;
  }
`;

export default IconButtonUpload;
