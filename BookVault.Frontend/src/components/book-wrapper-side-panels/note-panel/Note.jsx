import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import styles from './note.module.css';
import { LuUndo2, LuRedo2, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { HiMiniCog6Tooth } from 'react-icons/hi2';
import { IoCaretDown, IoCloseCircleSharp } from 'react-icons/io5';
import { decrypt, encrypt } from '../../../utils/encryptUtils';
import { FiPaperclip } from "react-icons/fi";
import { USER_NOTES } from '../../../constants/constants';
import { useNoteContext } from '../../../context/NoteContext.jsx';
import { useParams } from 'react-router-dom';
import { useUser } from '../../../context/UserContext.jsx';

export default function Note({ isPanelPinned, currentPageInfo }) {
    const { setHasUnsavedChanges, showUnsavedWarningPopup, setShowUnsavedWarningPopup } = useNoteContext();
    const { id } = useParams(); 
    const { user } = useUser();
    const sliderRef = useRef(null);
    const settingsRef = useRef(null);
    const hasMountedRef = useRef(false);
    const quillRef = useRef(null); // Ref to access Quill instance

    const [content, setContent] = useState('');
    const [notesByPage, setNotesByPage] = useState({});
    const [manualPage, setManualPage] = useState(null);
    const [lineHeight, setLineHeight] = useState(24); // px height for both
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [tooltipLeft, setTooltipLeft] = useState('10px');
    const [ruleVisibility, setRuleVisibility] = useState('show');
    const [navigationMode, setNavigationMode] = useState('auto');
    const [showDiscardModal, setShowDiscardModal] = useState(false);
    const [noteContent, setNoteContent] = useState('');
    const [initialContent, setInitialContent] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    const [prevPageInfo, setPrevPageInfo] = useState({
        left: 0,
        right: 1,
        total: null,
    });

    const [highlightPage, setHighlightPage] = useState(() => {
        const stored = localStorage.getItem('highlightPage');
        return stored ? parseInt(stored) : null;
    });

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await fetch(`https://localhost:7157/api/Note/${user.id}/${id}`);
                if (!res.ok) throw new Error("Failed to fetch notes");
                const data = await res.json();

                // Convert to map
                const map = {};
                data.forEach(note => {
                    map[note.pageNumber] = decrypt(note.content);
                });
                setNotesByPage(map);

                if (map[1]) {
                    setContent(map[1]);
                    setNoteContent(map[1]);
                    setInitialContent(map[1]);
                } else {
                    setContent("");
                    setNoteContent("");
                    setInitialContent("");
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchNotes();
    }, []);

    // Set localStorage to 1 on **page refresh only**
    useEffect(() => {
        const handleBeforeUnload = () => {
            // This will run on page refresh or browser/tab close
            // So set a flag to detect it
            localStorage.setItem('wasPageRefreshed', 'true');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        const wasPageRefreshed = localStorage.getItem('wasPageRefreshed');

        if (wasPageRefreshed === 'true') {
            localStorage.setItem('highlightPage', '1');
            setHighlightPage(1);
            localStorage.removeItem('wasPageRefreshed'); // Clean up the flag
        }
    }, []);

    useEffect(() => {
        if (!hasMountedRef.current) {
            // First mount — likely a reopen
            hasMountedRef.current = true;
            setPrevPageInfo(currentPageInfo); // Initialize prev info
            return;
        }

        const { left: prevLeft, right: prevRight } = prevPageInfo;
        const { left: newLeft, right: newRight, total } = currentPageInfo;

        let newHighlight = null;

        // Forward navigation
        if (newRight > prevRight) {
            if (newRight <= total) {
                newHighlight = newRight;
            } else if (newLeft > 0 && newLeft <= total) {
                newHighlight = newLeft;
            }
        }

        // Backward navigation
        if (newLeft < prevLeft) {
            if (newLeft > 0 && newLeft <= total) {
                newHighlight = newLeft;
            } else if (newRight > 0 && newRight <= total) {
                newHighlight = newRight;
            }
        }

        // Special handling for jumping directly over the last odd content page
        const isOdd = total % 2 !== 0;
        const skippedLastPage =
            isOdd &&
            newLeft > total &&
            newRight > total &&
            prevRight <= total;

        if (skippedLastPage) {
            newHighlight = total;
        }

        if (newHighlight !== null && newHighlight <= total) {
            if (navigationMode === "auto") {
                setHighlightPage(newHighlight);
            }
            goToNote(newHighlight)
            localStorage.setItem('highlightPage', newHighlight);
        }

        setPrevPageInfo(currentPageInfo);
    }, [currentPageInfo]);

    const goToNote = (pageNum) => {
        if (navigationMode === "auto") {
            setHighlightPage(pageNum);
       
            if (notesByPage[pageNum]) {
                const noteContent = notesByPage[pageNum];
                setContent(noteContent);
                setNoteContent(noteContent);
                setInitialContent(noteContent);
            } else {
                setContent("");
                setNoteContent("");
                setInitialContent("");
            }
         }
        setHasChanges(false);
    };

    const goToNoteManual = (pageNum) => {
        setHighlightPage(pageNum);

        if (notesByPage[pageNum]) {
            const noteContent = notesByPage[pageNum];
            setContent(noteContent);
            setNoteContent(noteContent);
            setInitialContent(noteContent);
        } else {
            setContent("");
            setNoteContent("");
            setInitialContent("");
        }
        setHasChanges(false);
    };

    const handlePrevPage = () => {
        if (navigationMode !== "manual") return;
        if (manualPage > 1) {
            const newPage = manualPage - 1;
            setManualPage(newPage);
            goToNoteManual(newPage);
        }
    };

    const handleNextPage = () => {
        if (navigationMode !== "manual") return;
        if (manualPage < currentPageInfo.total) {
            const newPage = manualPage + 1;
            setManualPage(newPage);
            goToNoteManual(newPage);
        }
    };

    const getPageClass = (pageNumber) =>
    highlightPage === pageNumber ? styles.highlightedPage : '';

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
        'list',
        'link',
        'align',
    ];

    const updateTooltipPosition = () => {
        if (!sliderRef.current) return;

        const slider = sliderRef.current;
        const min = Number(slider.min);
        const max = Number(slider.max);
        const percent = (lineHeight - min) / (max - min);

        const sliderWidth = slider.offsetWidth;
        const thumbWidth = 28; // must match the thumb size
        const left = percent * (sliderWidth - thumbWidth) + thumbWidth / 2;

        setTooltipLeft(`${left}px`);
    };

    useEffect(() => {
        const savedEncryptedNote = localStorage.getItem('note_content');
        if (savedEncryptedNote) {
            const decrypted = decrypt(savedEncryptedNote);
            setContent(decrypted);
        }
    }, []);

    useEffect(() => {
        const encrypted = encrypt(content);
        localStorage.setItem('note_content', encrypted);
    }, [content]);

    useEffect(() => {
        const storedLineHeight = localStorage.getItem('note_lineHeight');
        const storedRuleVisibility = localStorage.getItem('note_ruleVisibility');
        const storedNavigationMode = localStorage.getItem('note_navigationMode');

        if (storedLineHeight) setLineHeight(Number(storedLineHeight));
        else setLineHeight(24); // 1 → 24 px

        if (storedRuleVisibility) setRuleVisibility(storedRuleVisibility);
        else setRuleVisibility('show');

        if (storedNavigationMode) setNavigationMode(storedNavigationMode);
        else setNavigationMode('auto');
    }, []);

    useEffect(() => {
        localStorage.setItem('note_lineHeight', lineHeight);
    }, [lineHeight]);

    useEffect(() => {
        localStorage.setItem('note_ruleVisibility', ruleVisibility);
    }, [ruleVisibility]);

    useEffect(() => {
        localStorage.setItem('note_navigationMode', navigationMode);
    }, [navigationMode]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setSettingsOpen(false);
            }
        }

        if (settingsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [settingsOpen]);

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

        // Always apply line height
        editorRoot.style.lineHeight = `${lineHeight}px`;

        // Remove any background if ruleVisibility is 'hide'
        if (ruleVisibility === 'hide') {
            editorRoot.style.background = 'none';
            return;
        }

        const minLineHeight = 24;
        const maxLineHeight = 30;
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
    }, [lineHeight, ruleVisibility]);

    useEffect(() => {
        setHasChanges(noteContent !== initialContent);
    }, [noteContent, initialContent]);

    const handleQuillChange = (value) => {
        if (value === "<p><br></p>") value = ""; // Mark note as dirty when user types
        if (value) setHasUnsavedChanges(true);
        setContent(value);
        setNoteContent(value); // if using noteContent to track save/cancel
    };

    useEffect(() => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const MAX = USER_NOTES.MAX_CHARS;

        const handleBeforeInput = (e) => {
            const currentLength = quill.getLength() - 1; // Exclude final newline
            if (
                currentLength >= MAX &&
                e.inputType &&
                e.inputType.startsWith('insert')
            ) {
                e.preventDefault(); // BLOCK input, including space
            }
        };

        const handleTextChange = (delta, oldDelta, source) => {
            if (source !== 'user') return;

            const currentLength = quill.getLength() - 1;
            if (currentLength > MAX) {
                // Remove extra characters if somehow inserted
                const excess = currentLength - MAX;
                quill.deleteText(MAX, excess);
            }
        };

        quill.root.addEventListener('beforeinput', handleBeforeInput);
        quill.on('text-change', handleTextChange);

        return () => {
            quill.root.removeEventListener('beforeinput', handleBeforeInput);
            quill.off('text-change', handleTextChange);
        };
    }, []);

    const handleSave = async () => {
        try {
            const payload = {
                userId: user.id,
                bookId: id,
                pageNumber: highlightPage,
                content: encrypt(content)
            };

            const response = await fetch("https://localhost:7157/api/Note", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            console.log("Note saved successfully:", data);

            // Remove draft content from local storage
            localStorage.removeItem('note_content');

            // Update state to reflect saved note
            setInitialContent(noteContent);
            setHasChanges(false);
            setHasUnsavedChanges(false); // Reset status after save

            // update notesByPage for the current page
            setNotesByPage(prev => ({
                ...prev,
                [highlightPage]: content
            }));
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    const handleCancel = () => {
        setShowDiscardModal(true);
    };

    const confirmDiscard = () => {
        setContent(initialContent)
        setNoteContent(initialContent);
        setHasChanges(false); // TODO: have to be aware here, bcz, even the cancel button is clicked and clicked yes on the popup,
        //  the save and cancel buttons are enabled. Get disabled only when again do for the second file
        setHasUnsavedChanges(false); // Reset status after save
        localStorage.removeItem('note_content');
        setShowDiscardModal(false);
    };

    const closeModal = () => {
        setShowDiscardModal(false);
    };

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
            <div className={styles.undoRedoActionsButtons}>
                <span className={styles.undoRedoButton} onClick={() => quillRef.current?.getEditor().history.undo()}><LuUndo2 /></span>
                <span className={styles.undoRedoButton} onClick={() => quillRef.current?.getEditor().history.redo()}><LuRedo2 /></span>
            </div>
            <div className={styles.noteNavigation}>
                <LuChevronLeft
                    className={styles.navigationIcons}
                    size={22}
                    onClick={handlePrevPage}
                    style={{
                        cursor: navigationMode === "manual" ? "pointer" : "not-allowed",
                        opacity: navigationMode === "manual" ? 1 : 0.4
                    }}
                />

                <span className={styles.pageText}>
                    {/* Left Page */}
                    {currentPageInfo.left > 0 && currentPageInfo.left <= currentPageInfo.total ? (
                    <span
                        className={`${styles.noteNagigationPageNumber} ${getPageClass(currentPageInfo.left)}`}
                        style={{padding: '5px 8px 8.2px 8px'}}
                        onClick={() => {
                        setHighlightPage(currentPageInfo.left);
                        localStorage.setItem('highlightPage', currentPageInfo.left);
                        }}
                    >
                        {currentPageInfo.left}
                    </span>
                    ) : (
                    ''
                    )}

                    {/* Separator */}
                    {currentPageInfo.left > 0 && currentPageInfo.left <= currentPageInfo.total &&
                    currentPageInfo.right > 0 && currentPageInfo.right <= currentPageInfo.total
                    ? <span className={styles.notePageSeparator}></span>
                    : ''}

                    {/* Right Page */}
                    {currentPageInfo.right > 0 && currentPageInfo.right <= currentPageInfo.total ? (
                    <span
                        className={`${styles.noteNagigationPageNumber} ${getPageClass(currentPageInfo.right)}`}
                        style={{padding: '5px 8px 8.2px 8px'}}
                        onClick={() => {
                        setHighlightPage(currentPageInfo.right);
                        localStorage.setItem('highlightPage', currentPageInfo.right);
                        }}
                    >
                        {currentPageInfo.right}
                    </span>
                    ) : currentPageInfo.left <= 0 && currentPageInfo.right === 1 ? (
                    <span
                        className={`${styles.noteNagigationPageNumber} ${getPageClass(1)}`}
                        style={{padding: '5px 8px 8.2px 8px'}}
                        onClick={() => {
                        setHighlightPage(1);
                        localStorage.setItem('highlightPage', 1);
                        }}
                    >
                        1
                    </span>
                    ) : currentPageInfo.left > currentPageInfo.total ? (
                    <span
                        className={`${styles.noteNagigationPageNumber} ${getPageClass(currentPageInfo.total)}`}
                        style={{padding: '5px 8px 8.2px 8px'}}
                        onClick={() => {
                        setHighlightPage(currentPageInfo.total);
                        localStorage.setItem('highlightPage', currentPageInfo.total);
                        }}
                    >
                        {currentPageInfo.total}
                    </span>
                    ) : (
                    ''
                    )}
                </span>

                <LuChevronRight
                    className={styles.navigationIcons}
                    size={22}
                    onClick={handleNextPage}
                    style={{
                        cursor: navigationMode === "manual" ? "pointer" : "not-allowed",
                        opacity: navigationMode === "manual" ? 1 : 0.4
                    }}
                />
            </div>
            <div
                className={styles.settings}
                onMouseDown={(e) => {
                    e.stopPropagation(); // Prevent click from reaching document listener
                }}
                onClick={() => setSettingsOpen(prev => !prev)}
                style={{ cursor: 'pointer' }}
            >
                <HiMiniCog6Tooth className={styles.menuIcon} size={18} />
                <IoCaretDown size={10} />
            </div>
        </div>

        <div className={styles.noteDetailBar}>
            <div className={styles.pageAttachementText}> 
                <FiPaperclip size={15} />
                The note is attached to 
                <span style={{fontWeight: '700'}}>
                    <u>page - {highlightPage}</u>
                </span>
            </div>
            <div className={styles.characterLimitTextWrapper}>
                <span style={{ color: (quillRef.current?.getEditor().getLength() - 1) >= USER_NOTES.MAX_CHARS ? 'red' : 'gray' }}>
                    {(quillRef.current?.getEditor().getLength() - 1) || 0} / {USER_NOTES.MAX_CHARS} characters
                </span> 
            </div>
        </div>

        {/* Editor */}
        <ReactQuill
            ref={quillRef}
            value={content}
            onChange={handleQuillChange}
            modules={modules}
            formats={formats}
            placeholder="Type your note here..."
            className={styles.editor}
            style={{
                maxHeight: isPanelPinned ? '590px' : '430px',
            }}
        />
        <div className={styles.noteContentActions}>
            <button onClick={handleCancel} disabled={!hasChanges}>Cancel</button>
            <button onClick={handleSave} disabled={!hasChanges}>Save</button>
        </div>
        {settingsOpen && (
            <div className={styles.popup} ref={settingsRef}>
                <div className={styles.popupHeader}>
                    <span className={styles.headerText}>Advance Settigns</span>
                    <IoCloseCircleSharp size={20} className="closeBtn" style={{top: '10px', right: '8px'}} onClick={() => setSettingsOpen(prev => !prev)}/>
                </div>
                <div className={styles.popupBody}>
                    <div className={styles.lineHeightSlider}>
                        <label htmlFor="lineHeightSlider" className={styles.sectionLabel}>Line Height : {lineHeight - 23}</label>
                        <div className={styles.sliderWrapper}>
                            <span className={styles.sliderLimitNumbers} style={{padding: '0 8px'}}>1</span>
                            <input
                                ref={sliderRef}
                                type="range"
                                min="24"
                                max="30"
                                value={lineHeight}
                                onChange={(e) => setLineHeight(Number(e.target.value))}
                                className={styles.slider}
                            />
                            <span className={styles.sliderLimitNumbers} style={{padding: '0 8px'}}>7</span>
                        </div>
                    </div>

                    <div className={styles.noteNavigationSelectionSection}>
                        <label htmlFor="lineHeightSlider" className={styles.sectionLabel} style={{marginTop: '0px'}}>
                            Page rules visibility
                        </label>
                        <div className={styles.pageRuleVisibility}>
                            <label className={styles.radioButtonWrapper}>
                                <input
                                    type="radio"
                                    name="ruleVisibility"
                                    id="show"
                                    checked={ruleVisibility === 'show'}
                                    onChange={() => setRuleVisibility('show')}
                                />
                                <span className={styles.radioLabel}>Show</span>
                            </label>
                            <label className={styles.radioButtonWrapper}>
                                <input
                                    type="radio"
                                    name="ruleVisibility"
                                    id="hide"
                                    checked={ruleVisibility === 'hide'}
                                    onChange={() => setRuleVisibility('hide')}
                                />
                                <span className={styles.radioLabel}>hide</span>
                            </label>
                        </div>
                    </div>

                    <div className={styles.noteNavigationSelectionSection}>
                        <label htmlFor="lineHeightSlider" className={styles.sectionLabel} style={{marginTop: '0px'}}>
                            Navigation
                        </label>
                        <div className={styles.navigationWrapper}>
                            <label className={styles.radioButtonWrapper}>
                                <input
                                    type="radio"
                                    name="navigationMode"
                                    id="manual"
                                    checked={navigationMode === 'manual'}
                                    onChange={() => setNavigationMode('manual')}
                                />
                                <span className={styles.radioLabel}>
                                    Manual - 
                                    <span className={styles.radioDesc}>
                                        The notes are not turned when the book's pages turn
                                    </span>
                                </span>
                            </label>
                            <label className={styles.radioButtonWrapper}>
                                <input
                                    type="radio"
                                    name="navigationMode"
                                    id="auto"
                                    checked={navigationMode === 'auto'}
                                    onChange={() => setNavigationMode('auto')}
                                />
                                <span className={styles.radioLabel}>
                                    Auto - 
                                    <span className={styles.radioDesc}>
                                        automatically turn the notes with the book's page is turned
                                    </span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )}
        {showDiscardModal && (
            <div className={styles.modalBackdrop}>
                <div className={styles.modal}>
                    <div className={styles.popupHeader}>
                        <span className={styles.headerText}>Do you want to discard the changes?</span>
                    </div>
                    <div className={styles.modalActionButtons}>
                        <button 
                            className={styles.modalButtons} 
                            onClick={confirmDiscard}
                        >
                            Yes
                        </button>
                        <button 
                            className={styles.modalButtons} 
                            onClick={closeModal}
                            style={{backgroundColor: '#f78080ff'}}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        )}
        {showUnsavedWarningPopup && (
            <div className={styles.modalBackdrop}>
                <div className={styles.modal}>
                    <div className={styles.popupHeader}>
                        <span className={styles.headerText}>You have unsaved notes. Please save or discard them before turning pages</span>
                    </div>
                    <div className={styles.modalActionButtons}>
                        <button 
                            className={styles.modalButtons}
                            onClick={() => {
                                setShowUnsavedWarningPopup(false);
                                handleSave();
                            }}
                        >
                            Save
                        </button>
                        <button 
                            className={styles.modalButtons}
                            onClick={() => {
                                setShowUnsavedWarningPopup(false);
                            }}
                            style={{backgroundColor: '#f78080ff'}}
                        >
                            Ok, back to editor
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
