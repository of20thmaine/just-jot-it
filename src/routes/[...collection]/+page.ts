import type { PageLoad } from './$types';
import { GetCollection, ViewModes, EditModes } from '$lib/db';

export const load: PageLoad<CollectionView> = async ({ params }) => {
    const [collectionId, editModeId, viewModeId] = params.collection.split('/');
    return {
        collectionId: collectionId,
        editModeId: +editModeId,
        viewModeId: +viewModeId,
        notes: await GetCollection(+collectionId, ViewModes[+viewModeId].type)
    };
};
