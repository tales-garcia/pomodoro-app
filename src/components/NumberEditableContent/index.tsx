import React from 'react';

type INumberEditableContentProps = {
    onChange?(value: string): void;
}

const NumberEditableContent: React.FC<INumberEditableContentProps> = ({ children, onChange }) => {
    return (
        <strong
            suppressContentEditableWarning
            contentEditable
            onKeyPress={e => {
                if (isNaN(Number(e.key)) || e.key === ' ') e.preventDefault();
            }}
            onBlur={e => {
                if (e.currentTarget.textContent?.match(/^[0-9]/)) {
                    e.currentTarget.textContent = e.currentTarget.textContent.replace(/[^0-9]/g, '').padStart(2, '0');
                }
                onChange!(e.currentTarget.textContent!.padStart(2, '0'));
            }}
        >
            {children}
        </strong>
    );
}

export default NumberEditableContent;