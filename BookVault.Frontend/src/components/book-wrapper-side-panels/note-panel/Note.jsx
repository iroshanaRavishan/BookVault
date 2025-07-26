import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import styles from './note.module.css';
import { LuUndo2, LuRedo2 } from "react-icons/lu";

export default function Note() {
    const [content, setContent] = useState('');
    const quillRef = useRef(null); // Ref to access Quill instance

    const modules = {
        toolbar: [
            [{ 'size': ['small', false, 'large', 'huge'] }],  // Inline font sizes
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            [{ 'align': [] }],
            ['clean'],
        ],
        history: {
            delay: 500,
            maxStack: 100,
            userOnly: true,
        }
    };

    const formats = [
        'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'list', 'bullet',
        'link',
        'align',
    ];

  return (
    <div className={styles.noteWrapper}>
        <div style={{ marginBottom: '5px' }}>
            <button onClick={() => quillRef.current?.getEditor().history.undo()}><LuUndo2 /></button>
            <button onClick={() => quillRef.current?.getEditor().history.redo()}><LuRedo2 /></button>
        </div>
        
        {/* Editor */}
        <ReactQuill
            ref={quillRef}
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Type your note here..."
            className={styles.editor}
        />
    </div>
  );
}
