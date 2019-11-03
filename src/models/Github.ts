import * as v from 'validtyped';

export const meSchema = v.object({
    current_user_repositories_url: v.string(),
});

export const repoSchema = v.object({
    id: v.number(),
    name: v.string(),
    full_name: v.string(),
    url: v.string(),
    clone_url: v.string(),
    permissions: v.object({
        pull: v.boolean(),
    }),
});
