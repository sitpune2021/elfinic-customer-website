// ConfirmContext.jsx
import React, { createContext, useContext, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import './ConfirmDialog.css';

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
    const [options, setOptions] = useState(null);

    const confirmAction = (opts) => {
        setOptions(opts);
    };

    const handleAccept = () => {
        if (options?.accept) options.accept();
        setOptions(null);
    };

    const handleReject = () => {
        if (options?.reject) options.reject();
        setOptions(null);
    };

    const handleHide = () => {
        if (options?.reject) options.reject();
        setOptions(null);
    };

    const footer = options ? (
        <div className="p-dialog-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.5rem' }}>
            <Button
                label={options?.rejectLabel || "Cancel"}
                icon="pi pi-times"
                onClick={handleReject}
                className="p-button-text p-button-secondary"
                style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: 'white',
                    color: '#6c757d',
                    border: '1px solid #6c757d'
                }}
            />
            <Button
                label={options?.acceptLabel || "Yes, Remove"}
                icon="pi pi-check"
                onClick={handleAccept}
                className="p-button-danger"
                style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: '1px solid #dc3545'
                }}
                autoFocus
            />
        </div>
    ) : null;

    return (
        <ConfirmContext.Provider value={{ confirmAction }}>
            {children}
            <Dialog
                visible={!!options}
                onHide={handleHide}
                header={options?.header || "Confirmation"}
                footer={footer}
                modal
                dismissableMask
                draggable={false}
                resizable={false}
                style={{ width: '450px' }}
                contentStyle={{ padding: '1.5rem' }}
                headerStyle={{ padding: '1.5rem 1.5rem 1rem' }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <i
                        className={options?.icon || "pi pi-exclamation-triangle"}
                        style={{ fontSize: '2rem', color: '#ffc107' }}
                    ></i>
                    <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.5', color: '#495057' }}>
                        {options?.message}
                    </p>
                </div>
            </Dialog>
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    return useContext(ConfirmContext);
}
