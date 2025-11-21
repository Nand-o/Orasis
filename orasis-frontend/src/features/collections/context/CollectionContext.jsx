import React, { createContext, useState, useContext, useEffect } from 'react';

const CollectionContext = createContext();

export const useCollections = () => useContext(CollectionContext);

export const CollectionProvider = ({ children }) => {
    const [collections, setCollections] = useState(() => {
        const savedCollections = localStorage.getItem('collections');
        return savedCollections ? JSON.parse(savedCollections) : [
            { id: '1', name: 'New', designIds: [] }
        ];
    });

    useEffect(() => {
        localStorage.setItem('collections', JSON.stringify(collections));
    }, [collections]);

    const createCollection = (name) => {
        const newCollection = {
            id: Date.now().toString(),
            name,
            designIds: []
        };
        setCollections([...collections, newCollection]);
    };

    const toggleDesignInCollection = (collectionId, designId) => {
        setCollections(collections.map(col => {
            if (col.id === collectionId) {
                const isPresent = col.designIds.includes(designId);
                return {
                    ...col,
                    designIds: isPresent
                        ? col.designIds.filter(id => id !== designId)
                        : [...col.designIds, designId]
                };
            }
            return col;
        }));
    };

    const removeDesignFromCollection = (collectionId, designId) => {
        setCollections(collections.map(col => {
            if (col.id === collectionId) {
                return {
                    ...col,
                    designIds: col.designIds.filter(id => id !== designId)
                };
            }
            return col;
        }));
    };

    const deleteCollection = (collectionId) => {
        setCollections(collections.filter(col => col.id !== collectionId));
    };

    const renameCollection = (collectionId, newName) => {
        if (!newName.trim()) return; // Don't allow empty names
        setCollections(collections.map(col => {
            if (col.id === collectionId) {
                return { ...col, name: newName.trim() };
            }
            return col;
        }));
    };

    return (
        <CollectionContext.Provider value={{ collections, createCollection, toggleDesignInCollection, removeDesignFromCollection, deleteCollection, renameCollection }}>
            {children}
        </CollectionContext.Provider>
    );
};
