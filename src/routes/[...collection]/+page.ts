import type { PageLoad } from './$types';

export const load: PageLoad<CollectionView> = async ({ params }) => {
    const [collectionId, collectionName, editModeId, viewModeId] = params.collection.split('/');
    return {
        collectionId: +collectionId,
        collectionName: collectionName,
        editModeId: +editModeId,
        viewModeId: +viewModeId,
    };
};
