import type { PageLoad } from './$types';
import { GetCollection, ViewModes } from '$lib/db';

export const load: PageLoad<CollectionView> = async ({ params }) => {
    const [collectionId, collectionName, editModeId, viewModeId] = params.collection.split('/');
    return {
        collectionId: +collectionId,
        collectionName: collectionName,
        editModeId: +editModeId,
        viewModeId: +viewModeId,
        notes: await GetCollection(+collectionId, ViewModes[+viewModeId].type)
    };
};
