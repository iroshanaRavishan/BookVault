import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import styles from './note.module.css';
import { LuUndo2, LuRedo2 } from "react-icons/lu";
import { HiMiniCog6Tooth } from 'react-icons/hi2';

export default function Note() {
    const [content, setContent] = useState('');
    const quillRef = useRef(null); // Ref to access Quill instance

    const modules = {
        toolbar: {
            container: '#toolbar',
        },
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
        <div id="toolbar" className={styles.customToolbar}>
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />

            <select className="ql-color" />
            <select className="ql-background" />

            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <select className="ql-align" />

            <button className="ql-link" />
            <button className="ql-clean" />
            <select className="ql-size" defaultValue="">
                <option value="small">Small</option>
                <option value="">Normal</option>
                <option value="large">Large</option>
                <option value="huge">Huge</option>
            </select>
        </div>

        <div className={styles.noteActions} style={{margin: '5px 0'}}>  
            <div >
                <button onClick={() => quillRef.current?.getEditor().history.undo()}><LuUndo2 /></button>
                <button onClick={() => quillRef.current?.getEditor().history.redo()}><LuRedo2 /></button>
            </div>
            <div>
                <button>prev</button>
                <span> 5 </span>
                <span>page</span>
                <button>next</button>
            </div>
            <div>
                <HiMiniCog6Tooth className={styles.menuIcon} size={21}/> Settings
            </div>
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
