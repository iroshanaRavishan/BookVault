import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import styles from './note.module.css';

export default function Note() {
    const [content, setContent] = useState('');

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
        ]
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
    ];

  return (
    <div className={styles.noteWrapper}>
        {/* Editor */}
        <ReactQuill
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
