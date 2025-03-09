import React, { useEffect, useRef, useState } from 'react';
import { Box } from "@mui/material";
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import styled from '@emotion/styled';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const Components = styled.div`
  background-color: #F5F5F5;
`;

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean']
];

function Editor() {
    const quillRef = useRef(null);
    const [socket, setSocket] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        if (!quillRef.current) {
            const quillInstance = new Quill("#container", {
                theme: "snow",
                modules: { toolbar: toolbarOptions }
            });
            quillRef.current = quillInstance;
            quillInstance.disable();
            quillInstance.setText("Loading document...");
        }

        return () => {
            if (quillRef.current) {
                quillRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const socketServer = io("http://localhost:4500");
        setSocket(socketServer);

        return () => {
            socketServer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket || !quillRef.current) return;

        const handleChange = (delta, oldData, source) => {
            if (source !== 'user') return;
            socket.emit('send-changes', delta);
        };

        const quill = quillRef.current;
        quill.on('text-change', handleChange);

        return () => {
            quill.off('text-change', handleChange);
        };
    }, [socket]);

    useEffect(() => {
        if (!quillRef.current || !socket) return;

        const quill = quillRef.current;

        socket.once('load-document', document => {
            quill.setContents(document);
            quill.enable();
        });

        socket.emit('get-document', id);
    }, [socket, id]);

    useEffect(() => {
        if (!socket || !quillRef.current) return;

        const handleChange = (delta) => {
            const quill = quillRef.current;
            quill.updateContents(delta);
        };

        socket.on('receive-changes', handleChange);

        return () => {
            socket.off('receive-changes', handleChange);
        };
    }, [socket]);

    // Here, we are saving  the doc

    useEffect(() => {
        if (!socket || !quillRef.current) return;
      
        const quill = quillRef.current;
        let interval;
      
        const saveDocument = async () => {
          try {
            const documentContent = quill.getContents();
            await socket.emit('save-document', documentContent);
          } catch (error) {
            console.error('Error saving document:', error);
          }
        };
      
        interval = setInterval(saveDocument, 1000);
      
        return () => {
          clearInterval(interval);
        };
      }, [socket, quillRef]);
      

    return (
        <Components>
            <Box className='container' id='container'></Box>
        </Components>
    );
}

export default Editor;
