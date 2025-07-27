import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
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
    const [settingsOpen, setSettingsOpen] = useState(false);
    const sliderRef = useRef(null);
    const [tooltipLeft, setTooltipLeft] = useState('10px');

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


    useLayoutEffect(() => {
        updateTooltipPosition();
    }, [lineHeight]);

    useEffect(() => {
        // Initial calculation after mount
        updateTooltipPosition();
        window.addEventListener('resize', updateTooltipPosition);
        return () => window.removeEventListener('resize', updateTooltipPosition);
    }, []);

    useEffect(() => {
        if (!quillRef.current) return;

        const editor = quillRef.current.getEditor();
        const editorRoot = editor.root;

        // Slider range values
        const minLineHeight = 24;
        const maxLineHeight = 30;

        // Apply the requested line height
        editorRoot.style.lineHeight = `${lineHeight}px`;

        // Dynamic offset (6px -> 0px)
        const offset = (((maxLineHeight - lineHeight) / (maxLineHeight - minLineHeight)) * 2.9) + 4;

        // Measure actual line spacing
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `<div>M</div><div>M</div>`;
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '-9999px';
        tempDiv.style.lineHeight = `${lineHeight}px`;

        editorRoot.appendChild(tempDiv);
        const children = tempDiv.querySelectorAll('div');
        const lineSpacing = children[1].offsetTop - children[0].offsetTop;
        tempDiv.remove();

        // Apply gradient with dynamic offset
        editorRoot.style.background = `repeating-linear-gradient(
            #fff,
            #fff ${lineSpacing - 1}px,
            #bdbdbdff ${lineSpacing}px
        )`;
        editorRoot.style.backgroundAttachment = 'local';
        editorRoot.style.backgroundPosition = `0 ${offset}px`;
    }, [lineHeight]);

  return (
    <div className={styles.noteWrapper} style={{ position: 'relative' }}>
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
            <div
                className={styles.settings}
                onClick={() => setSettingsOpen(prev => !prev)}
                style={{ cursor: 'pointer' }}
            >
                <HiMiniCog6Tooth className={styles.menuIcon} size={18} /> <IoCaretDown size={10} />
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
            style={{
                maxHeight: isPanelPinned ? '590px' : '430px',
            }}
        />
        <div className={styles.noteContentActions}>
            <button>cancel</button>
            <button>save</button>
        </div>
        {settingsOpen && (
            <div className={styles.popup}>
                <label htmlFor="lineHeightSlider">Line Height:</label>

                <input
                    id="lineHeightSlider"
                    type="range"
                    min="24"
                    max="30"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className={styles.slider}
                />

                <div className={styles.sliderTooltip} style={{ left: `${((lineHeight - 24) / 6) * 100}%` }}>
                    {mappedValue}
                </div>
            </div>
        )}
    </div>
  );
}
