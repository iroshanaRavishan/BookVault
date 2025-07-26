import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import styles from './note.module.css';
import { LuUndo2, LuRedo2, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { HiMiniCog6Tooth } from 'react-icons/hi2';
import { IoCaretDown } from 'react-icons/io5';

export default function Note({ isPanelPinned }) {
    const [content, setContent] = useState('');
    const quillRef = useRef(null); // Ref to access Quill instance
    const [lineHeight, setLineHeight] = useState(24); // px height for both

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

    const backgroundOffset = `${(24 - lineHeight) * 1.5}px`;

    useEffect(() => {
    if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        editor.root.style.lineHeight = `${lineHeight}px`;  // match px to background
    }
    }, [lineHeight]);

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
            </select>
        </div>

        <div className={styles.noteActions} style={{margin: '10px 0'}}>  
            <div>
                <span className={styles.undoRedoBtns} onClick={() => quillRef.current?.getEditor().history.undo()}><LuUndo2 /></span>
                <span className={styles.undoRedoBtns} onClick={() => quillRef.current?.getEditor().history.redo()}><LuRedo2 /></span>
            </div>
            <div className={styles.noteNavigation}>
                <LuChevronLeft className={styles.navigationIcons} size={22}/>
                {/* <span> 5 </span> */}
                <span className={styles.pageText}>Page 5 </span>
                <LuChevronRight className={styles.navigationIcons} size={22}/>
            </div>
            <div className={styles.settings}>
                <HiMiniCog6Tooth className={styles.menuIcon} size={18}/> <IoCaretDown size={10}/>
            </div>
        </div>

        <input
            type="range"
            min="24"
            max="30"
            value={lineHeight}
            onChange={(e) => setLineHeight(Number(e.target.value))}
        />
        
        {/* Editor */}
        <ReactQuill
            ref={quillRef}
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Type your note here..."
            className={styles.editor}
            style={{
                background: `repeating-linear-gradient(
                    #fff,
                    #fff ${lineHeight - 1}px,
                    #bdbdbdff ${lineHeight}px
                )`,
                backgroundPositionY: backgroundOffset
            }}
        />
        <div className={styles.noteContentActions}>
            <button>cancel</button>
            <button>save</button>
        </div>
    </div>
  );
}
