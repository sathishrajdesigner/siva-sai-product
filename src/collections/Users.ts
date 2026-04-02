import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200, // 2 hours
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },

  admin: {
    useAsTitle: 'name',
    group: 'Settings',
    defaultColumns: ['name', 'email', 'role', 'updatedAt'],
    listSearchableFields: ['name', 'email'],
    description: 'Manage who can access and edit the admin panel.',
  },

  fields: [
    // ── AVATAR + NAME row (visual identity at the top) ────────────────
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile photo. Shown in the admin sidebar. Recommended: square, min 200×200px.',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name — shown in the admin panel header and activity logs.',
        placeholder: 'e.g. Ravi Kumar',
      },
    },

    // ── SIDEBAR: role + phone ─────────────────────────────────────────
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: '👑 Super Admin — full access including delete', value: 'super_admin' },
        { label: '✏️  Editor — create and edit content',          value: 'editor'      },
        { label: '👁️  Viewer — read-only, no edits',              value: 'viewer'      },
      ],
      admin: {
        position: 'sidebar',
        description: 'Controls what this user can see and do in the admin panel.',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Optional. For internal contact only.',
        placeholder: '+91-98765-43210',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Internal notes about this user. Never shown publicly.',
        placeholder: 'e.g. Handles product uploads every Monday.',
      },
    },
  ],

  // ── ACCESS CONTROL based on role ─────────────────────────────────────
  access: {
    // Anyone logged in can read user list (so names show in dropdowns)
    read: ({ req: { user } }) => !!user,

    // Only super_admin can create new users
    create: ({ req: { user } }) => user?.role === 'super_admin',

    // Users can edit themselves; super_admin can edit anyone
    update: ({ req: { user } }) =>
      user?.role === 'super_admin'
        ? true
        : { id: { equals: user?.id } },

    // Only super_admin can delete
    delete: ({ req: { user } }) => user?.role === 'super_admin',
  },
}
